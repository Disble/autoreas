const { pendientesdb } = require('./db-pendientes.js');
const { Pendiente } = require('./Pendiente');
class ModelPendiente {
    constructor() {
      this.db = pendientesdb;
    }

    new(pendiente) {
      return new Promise((resolve, reject) => {
        this.db.insert(pendiente, function(err, record) {
      		if (err) {
      			reject(new Error(err));
      			return;
      		}
          resolve(true);
      	});
      });
    }

    update(id, pendiente) {
      return new Promise((resolve, reject) => {
        this.db.update({_id : id}, pendiente, function(err, record) {
          if (err) {
            reject(new Error(err));
            return;
          }
          resolve(true);
        });
      });
    }

    remove(id) {
      return new Promise((resolve, reject) => {
        this.db.remove({ _id : id }, {}, function(err, record) {
          if (err) {
            reject(new Error(err));
            return;
          }
          resolve(true);
        });
      });
    }

    activeOff(id) {
      return new Promise((resolve, reject) => {
        this.db.update({_id : id}, {$set: {activo: false, fechaFin : new Date()}}, function(err, record) {
          if (err) {
            reject(new Error(err));
            return;
          }
          resolve(true);
        });
      });
    }

    getOnce(id) {
		return new Promise((resolve, reject) => {
			this.db.findOne({ _id: id }).exec(function (err, record) {
				if (err) {
					reject(new Error(err));
					process.exit(0);
				}
				resolve(new Pendiente(record.nombre, record.detalle, record.orden, record.pagina, record.activo, record.fechaFin, record.fechaCreacion, record._id));
			});
		});
    }

    getAll() {
      return new Promise((resolve, reject) => {
        this.db.find({}).sort({"orden":-1}).exec(function(err, record) {
      		if (err) {
            reject(new Error(err));
      			process.exit(0);
      		}
          resolve(record);
      	});
      });
    }

    getAllActive() {
      return new Promise((resolve, reject) => {
        this.db.find({activo : true}).sort({"orden":-1}).exec(function(err, record) {
      		if (err) {
            reject(new Error(err));
      			process.exit(0);
      		}
          resolve(record);
      	});
      });
    }

    getAllCount() {
      return new Promise((resolve, reject) => {
        this.db.count({}).sort({"orden":-1}).exec(function(err, record) {
      		if (err) {
            reject(new Error(err));
      			process.exit(0);
      		}
          resolve(record);
      	});
      });
    }

    getMaxOrder() {
      return new Promise((resolve, reject) => {
        this.db.find({}, {orden : 1})
        .sort({"orden":-1}).exec(function(err, record) {
      		if (err) {
            reject(new Error(err));
      			process.exit(0);
      		}
          let mayor = 0;
          if (record.length > 0) {
            mayor = record[0].orden;
            record.map((value, index) => {
              if (value > mayor) {
                mayor = value;
              }
            });
          }

          resolve(mayor);
      	});
      });
    }
}

exports.ModelPendiente = ModelPendiente;