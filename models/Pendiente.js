class Pendiente {
    constructor(nombre, detalle, orden, pagina = null, activo = true, fechaFin = null, fechaCreacion = new Date(), _id = "") {
        this.nombre = nombre;
        this.detalle = detalle;
        this.orden = orden;
        this.pagina = pagina;
        this.activo = activo;
        this.fechaFin = fechaFin;
        this.fechaCreacion = fechaCreacion;
        if (_id !== "") {
            this._id = _id;
        }
    }
}

exports.Pendiente = Pendiente;