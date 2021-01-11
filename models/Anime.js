/**
 * Representa todos los datos de la Base de Datos
 * correspondientes a un Anime.
 */
class Anime {
  /**
   * Representa un Anime.
   * @constructor
   * @param {string} nombre Nombre del anime.
   * @param {[...{dia: string, orden: number}]} dias Días y orden por día en que se ve el anime, no necesariamente de la semana.
   * @param {number} nrocapvisto Número de capítulos vistos.
   * @param {number} totalcap Número total de capítulos.
   * @param {number} tipo Tipo de anime: 
   *    - 0 - TV
   *    - 1 - Película
   *    - 2 - Especial
   *    - 3 - OVA.
   * @param {string} pagina Pagina de descarga del animes, también se puede almacenar otro datos.
   * @param {string} carpeta Ubicación en disco del anime.
   * @param {[...{estudio: string, url: string}]} estudios Estudios de animación del anime.
   * @param {string} origen Origen o fuente de la que se basa la animación. Ej: manga, light novel, original.
   * @param {string[]} generos Género o tema general del anime.
   * @param {number} duracion Duración en minutos de cada capítulo.
   * @param {{type: string, path: string}} portada Imagen de portada del anime, puede ser una url o la dirección de un archivo tipo imagen.
   * @param {number} estado Estado actual del anime.
   *    - 0 - Viendo
   *    - 1 - Finalizado
   *    - 2 - No me gusto
   *    - 3 - En pausa
   * @param {[...{numrepeticion: number, fechaRepeticion: Date, fechaUltCapVisto: Date}]} repetir Array que contiene los datos `numrepeticion`, `fecharepeticion`, `fechaultcapvisto` por cada vez que ve un anime.
   * @param {boolean} activo Representa si el anime es visible o no en las listas para ver animes.
   * @param {boolean} primeravez Marca si es la primera vez que se ve un anime.
   * @param {Date} fechaPublicacion Fecha en la que se publicó (estreno mundial) el anime.
   * @param {Date} fechaEstreno Fecha en la que se vio el primer capitulo del anime desde que se creo (`fechaCreacion`).
   * @param {Date} fechaCreacion Fecha en la que se creo el anime.
   * @param {Date} fechaUltCapVisto Fecha en la que se marco el último capitulo visto.
   * @param {Date} fechaEliminacion Fecha en la que se elimino de las listas para ver animes.
   * @param {string} _id Identificador único por anime.
   */
  constructor(nombre, dias, nrocapvisto, totalcap, tipo, pagina, carpeta, estudios, origen, generos, duracion, portada, estado, repetir, activo, primeravez, fechaPublicacion, fechaEstreno, fechaCreacion, fechaUltCapVisto, fechaEliminacion, _id = "") {
    this.nombre = nombre;
    this.dias = dias;
    this.nrocapvisto = nrocapvisto;
    this.totalcap = totalcap;
    this.tipo = tipo;
    this.pagina = pagina;
    this.carpeta = carpeta;
    this.estudios = estudios;
    this.origen = origen;
    this.generos = generos;
    this.duracion = duracion;
    this.portada = portada;
    this.estado = estado;
    this.repetir = repetir;
    this.activo = activo;
    this.primeravez = primeravez;
    this.fechaPublicacion = fechaPublicacion;
    this.fechaEstreno = fechaEstreno;
    this.fechaCreacion = fechaCreacion;
    this.fechaUltCapVisto = fechaUltCapVisto;
    this.fechaEliminacion = fechaEliminacion;
    if (_id !== "") {
      this._id = _id;
    }
  }
}

exports.Anime = Anime;
