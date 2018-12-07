import { Model, Document } from "mongoose";

export default <T extends Document, QueryHelpers = {}>(
  model: Model<T, QueryHelpers>,
) => {
  return {
    add(id: string, data: {}) {
      return model.create({
        _id: id,
        ...data,
      });
    },
    findOne(id: string) {
      return new Promise((resolve, reject) =>
        model
          .findById(id)
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          }),
      );
    },
    findMany() {
      return new Promise((resolve, reject) =>
        model
          .find()
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          }),
      )
    },
    remove(id?: string) {
      return new Promise((resolve, reject) =>
        model
          .findByIdAndRemove(id)
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          }),
      );
    },
    update(id: string, data: {}) {
      return new Promise((resolve, reject) =>
        model
          .updateOne(id, data)
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          }),
      );
    },
  };
};
