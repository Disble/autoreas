import Database from './database';

export default class NeDBLib {
    constructor(collection) {
        const dboxDB = new Database(collection);
        this.db = dboxDB.getInstance();
    }

    getAll(query, sort = null, skip = null, limit = null, projection = null) {
        return new Promise((resolve, reject) => {
            let res = this.db.find(query)

            if (sort !== null) res = res.sort(sort);
            if (skip !== null) res = res.skip(skip);
            if (limit !== null) res = res.limit(limit);
            if (projection !== null) res = res.projection(projection);

            res.exec(function (err, record) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(record);
            });
        });
    }

    getOnce(query, sort = null, skip = null, limit = null, projection = null) {
        return new Promise((resolve, reject) => {
            let res = this.db.findOne(query);

            if (sort !== null) res = res.sort(sort);
            if (skip !== null) res = res.skip(skip);
            if (limit !== null) res = res.limit(limit);
            if (projection !== null) res = res.projection(projection);


            res.exec(function (err, record) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(record);
            });
        });
    }

    count(query) {
        return new Promise((resolve, reject) => {
            this.db.count(query, function (err, count) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(count);
            });
        });
    }

    create(doc) {
        return new Promise((resolve, reject) => {
            this.db.insert(doc, function (err, record) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(record);
            });
        });
    }

    update(query, update, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.update(query, update, options, function (err, record) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(record);
            });
        });
    }

    delete(query, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, options, function (err, record) {
                if (err) {
                    reject(new Error(err));
                    return;
                }
                resolve(record);
            });
        });
    }
}
