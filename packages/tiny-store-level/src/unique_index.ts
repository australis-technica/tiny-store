import { Schema } from "./schema";
import { StoreRecord } from "./types";

// todo: is this faster than reading from db ?
export default function UniqueIndex<T>(schemas: Schema<T>[], findMany: () => Promise<StoreRecord<T>[]>) {

    let _indexes: { key: keyof T, values: T[keyof T][] }[] = null;

    const uniqueIndex = (ignore?: (keyof T)[]) =>
        Promise.all(
            schemas
                .filter(schema => schema.unique && (!ignore || ignore.indexOf(schema.key) === -1))
                .map(({ key }) =>
                    findMany()
                        .then(x => x.map(([_id, value]) => value[key]))
                        .then(values => ({ key, values })),
                ),
        );

    const get = async () => {
        if (_indexes) return _indexes;
        _indexes = await uniqueIndex();
        return _indexes;
    }

    // todo: is this faster than reading from db ?
    const add = (data: T) => {
        for (const u of schemas.filter(schema => schema.unique)) {
            const x = _indexes.find(x => x.key === u.key);
            if (x) x.values.push(data[x.key]);
        }
    };

    const clear = () => {
        _indexes = null;
    };

    return {
        get,
        add,
        clear
    }
}