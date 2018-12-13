import { LevelLike } from "./types";
import { keyEncoder } from "./key-encoder";
/** */
export default function PrimaryKeys(db: LevelLike, partitionName: string) {

    const { decode, isMatch } = keyEncoder(partitionName);

    const _getKeys = () =>
        new Promise<string[]>((resolve, reject) => {
            try {
                const stream = db.createReadStream({ values: false });
                let result: string[] = [];
                stream.on("data", key => {
                    if (isMatch(key)) {
                        result.push(decode(key));
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

    let _primaryKeys: string[] = null;

    const getKeys = async () => {
        if (_primaryKeys) return _primaryKeys;
        _primaryKeys = await _getKeys();
        return _primaryKeys;
    }

    const addPrimaryKey = (id: string) => {
        _primaryKeys.push(id);        
    };

    const remove = (id: string) => {
        _primaryKeys = _primaryKeys.filter(k => k !== id);        
    };

    const clear = () => {
        _primaryKeys = null;        
    };

    /** forcing alphanumeric will enable easier gt & lt and reserved keys like $index? */
    const isValid = (x: any) => {
        return typeof x === "string" && /^[a-zA-Z0-9]*$/.test(x);
    }
    return {
        getKeys,
        add: addPrimaryKey,
        remove,
        clear,
        isValid,
    }
}