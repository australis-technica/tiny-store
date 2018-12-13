import { keyEncoder } from "./key-encoder";
import schema, { Schema } from "./schema";
import { StoreRecord, Store, LevelLike } from "./types";
import UniqueIndex from "./unique_index";
import PrimaryKeys from "./primary-keys";
/** */
function isNotFoundError(error: Error) {
  return error instanceof (Error) && error.name === "NotFoundError";
}
/** */
const catchNotFound = (returns: any = null) => (error: Error) => {
  return isNotFoundError(error)
    ? returns
    : Promise.reject(error);
};

export class KeyError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export const cache = () => {

}
/**
 *
 */
export default <T extends { [key: string]: any } = {}>(
  db: LevelLike,
  partitionName: string,
  schemas: Schema<T>[] = []
): Store<T> => {

  const { encode, decode, isMatch } = keyEncoder(partitionName);


  const findOne = (id: string): Promise<T> =>
    db.get(encode(id)).then((value: any) => {
      return value;
    });

  const findMany = () =>
    new Promise<StoreRecord<T>[]>((resolve, reject) => {
      try {
        const stream = db.createReadStream();
        let result: StoreRecord<T>[] = [];
        stream.on("data", ({ key, value }) => {
          if (isMatch(key)) {
            result.push([decode(key), value]);
          }
        });
        stream.on("error", error => {
          reject(error);
        });
        // stream.on("close", () => {});
        stream.on("end", () => {
          resolve(result);
        });
      } catch (error) {
        return reject(error);
      }
    });

  const index = UniqueIndex(schemas, findMany);
  const _schema = schema(schemas, partitionName);
  const keys = PrimaryKeys(db, partitionName);

  return {
    /** */
    add: async (id: string, data: T) => {
      // Unique PRI-KEY
      const _keys = await keys.getKeys();
      if (_keys.indexOf(id) !== -1) return Promise.reject(new KeyError(`Duplicated key: ${id}`));
      if (!keys.isValid(id)) return Promise.reject(new KeyError(`Invalid key: ${id}`));
      try {
        // Validate Schema: Warning: adds default values
        const indexes = await index.get();
        data = _schema.validate(data, indexes);
      } catch (error) {
        return Promise.reject(error);
      }
      //
      return db
        .put(encode(id), data)
        .then(x => { index.add(data); return x; })
        .then(x => { keys.add(id); return x; });
    },
    /** */
    update: async (id: string, data: Partial<T>) => {
      try {
        const found = await findOne(id).catch(catchNotFound(null));
        if (!found) return Promise.reject(new Error(`Not Found key: ${id}`));
        const indexes = await index.get();
        const validated = _schema.validate(
          data as T, // hack:
          indexes,
          /* ignore: */ found,
        );
        const _update = Object.assign(found, validated);
        return (
          db
            .put(encode(id), _update)
            // problem: uniques values are append only ?
            .then(x => { index.clear(); return x; })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    },
    findMany,
    findOne: (id: string) => findOne(id).catch(e =>
      isNotFoundError(e)
        ? Promise.reject(new KeyError(`Key '${id}' Not Found`))
        : Promise.reject(e)),
    /** */
    async remove(id?: string): Promise<any> {
      await findOne(id); //throws
      return db.del(encode(id)).then(x => { keys.remove(id); return x; }).then(x => { index.clear(); return x; });
    },
    /** */
    clear: () =>
      new Promise<any>((resolve, reject) => {
        try {
          const stream = db.createReadStream();
          let result = 0;
          stream.on("data", async ({ key }) => {
            if (isMatch(key)) {
              result = result + 1;
              await db.del(key);
            }
          });
          stream.on("error", error => {
            reject(error);
          });
          // stream.on("close", () => {});
          stream.on("end", () => {
            resolve(result);
          });
        } catch (error) {
          return reject(error);
        }
      }).then(x => { keys.clear(); return x; }).then(x => { index.clear(); return x; }),
  };
};


