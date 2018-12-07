import { connected } from "@australis/tiny-sql-simple-repo";

export default (name: string, script: string, envKey = "DB") => {
  const repo = connected(name, script, envKey);
  return {
    findOne(id: string) {
      return repo.byId(id);
    },
    findMany() {
      return repo.all();
    },
    remove(id: string) {
      return repo.remove(id);
    },
    add(id: string, data: any) {
      return repo.add({
        id,
        ...data,
      });
    },
    update(id: string, data: any) {
      return repo.update({
        id,
        ...data,
      });
    },
    init: repo.init
  };
};
