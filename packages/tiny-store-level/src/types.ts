/** @description Tuple, [0]=id, [1]=value */
export type StoreRecord<T> = [string, T];

export interface Store<T> {
    add(id: string, data: T): Promise<any>,
    update(id: string, data: Partial<T>): Promise<any>,
    findOne(id: string): Promise<T>,
    findMany(): Promise<StoreRecord<T>[]>,
    remove(id: string): Promise<any>,
    clear(): Promise<any>,
}

export type Serializer = {
    serialize: (a: any) => string;
    deserialize: (value: string | Buffer) => any;
};

export type KeyEncoder = {
    encode(s: string): string;
    decode(s: string): string;
    isMatch: (s: string | Buffer) => boolean;
};