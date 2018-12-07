# Tiny Stores

NodeJs's various implementations of

    /* Where T is Pojo */
    interface Store<T> {
        add(id: string, data: T): Promise<any>,
        update(id: string, data: Partial<T>): Promise<any>,
        findOne(id: string): Promise<T>,
        findMany(): Promise<StoreRecord<T>[]>,
        remove(id: string): Promise<any>,
        clear(): Promise<any>,
    }


- Find minimum common denominator between databases
- For easy environment switching
- For quick prototyping
- with typescript
- Transpiled to be Transpiled
- unbundled

## Build:

    ./scripts/run-task build

## Test:

    ./scripts/run-task test

