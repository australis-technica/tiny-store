
export default class MapStore<T extends {} = {}> {
  map = new Map<string, T>();
  findOne = (key: string) => Promise.resolve(this.map.get(key));
  findMany = () => {
    const out: any[] = [];
    this.map.forEach((value, key) => {
      out.push({ key, ...(value || {}) });
    });
    return Promise.resolve(out)
  }
  update = (key: string, value: T) => {
    if (!this.map.has(key))
      return Promise.reject(new Error("Not Found, Key: " + key));
    this.map.set(key, value);
    return Promise.resolve();
  };
  add = (key: string, value: T) => {
    if (this.map.has(key))
      return Promise.reject(new Error("Duplicated key: " + key));
    return Promise.resolve(this.map.set(key, value));
  };
  remove = (key: string) => {
    if (!this.map.has(key))
      return Promise.reject(new Error("Not Found, Key: " + key));
    return Promise.resolve(this.map.delete(key));
  };
}
