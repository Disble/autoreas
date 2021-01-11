'use strict'
const path = require('path');
const fs = require('fs');
const { shell, clipboard } = require('electron');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const settings = require('electron-settings');
const { Days } = require('../models/defaults-config.js');
const { Anime } = require('./Anime');
/**
 * Clase para la sección `Ver Anime`
 */
class RenderVerAnime extends RenderBase {
    /**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
    constructor() {
        super();
        this.db = new BDAnimes();
    }
    /**
	 * Inicializa la pagina Ver Animes.
	 */
    async initVerAnime() {
        this._verAnime();               // se cargan los anime-card
        this._initVerAnimeHTML();       // se carga el menu, badges, downloader
    }
    /**
     * Inicializa el menú, badges y botón downloader.
     */
    _initVerAnimeHTML() {
        this._initProgramDownloader();
        this.menuRender();
    }
    /**
	 * Inicializa el botón que lanza
	 * el programa que haya configurado
	 * el usuario.
	 */
    _initProgramDownloader() {
        let dir = settings.get('downloader.dir');
        let downloader = document.getElementById('icon-downloader');
        if (dir === undefined) {
            downloader.style.display = 'none';
            return;
        }
        downloader.innerHTML = /*html*/`<i class="icon-rocket grey-text text-darken-2 icon-big"></i>`;
        downloader.addEventListener('click', e => {
            let program = this._obtenerDirPrograma();
            if (shell.openItem(program)) {
                M.toast({
                    html: `Abriendo ${path.basename(program, '.exe')}...`,
                    displayLength: 4000
                });
            } else {
                swal({
                    title: "Hubo problemas al abrir el programa",
                    text: "Por favor revise que la dirección del programa sea correcta en Opciones.",
                    icon: "error",
                    className: "error-swal"
                });
            }
        });
        downloader.setAttribute('data-tooltip', path.basename(this._obtenerDirPrograma(), '.exe'));
    }
	/**
	 * Obtiene la dirección del programa que este guardado
	 * en settings (Gestor de descargas).
	 * 
	 * En caso de error muestra un modal con dicho mensaje.
	 */
    _obtenerDirPrograma() {
        let dir = settings.get('downloader.dir');
        if (dir === undefined) { // esto es solo que caso de que se muestre por error
            swal({
                title: "No configurado",
                text: "No esta configurado la dirección del programa, por favor hagalo en Opciones.",
                icon: "error",
                className: "error-swal"
            });
            return;
        }
        return path.normalize(dir);
    }
    /**
	 * Genera el menú en base al objeto `Days`, además le da 
     * funcionalidad.
	 */
    async menuRender() {
        let diasSettings = settings.get('days', Days);
        let seasonMode = settings.get('is-season', false);
        let menuDropdown = document.getElementById('menu');
        menuDropdown.innerHTML = '';
        let dayTitle = '';
        let i = 0;
        for (const grupoDias of diasSettings) {
            let menu = '';
            let li = document.createElement('li');
            if (seasonMode) {
                if (i++ === 1) li.classList.add('active');
            } else {
                if (i++ === 0) li.classList.add('active');
            }
            menu += /*html*/`
                    <div class="collapsible-header">
                        <h5 class="no-margin blue-grey-text">${grupoDias.title}</h5>
                    </div>
                    <div class="collapsible-body no-padding">
                        <div class="collection">
                    `;
            for (const dias of grupoDias.data) {
                let dia = dias.name === dias.alternative ? dias.name : dias.alternative;
                menu += /*html*/`
                            <a href="#!" class="collection-item no-link blue-text" dia="${dias.name}" dia-alternative="${dias.alternative}">${dia}<span class="badge"></span></a>
                        `;
            }
            menu += /*html*/`
                        </div>
                    </div>`;
            li.innerHTML = menu;
            menuDropdown.appendChild(li);
            /** ACTIVE SCRIPTS */
            li.querySelectorAll('[dia]').forEach(item => {
                item.addEventListener('click', () => {
                    let day = item.getAttribute('dia');
                    let dayAlternative = item.getAttribute('dia-alternative');
                    document.getElementById('title-day').innerText = dayAlternative;
                    this._loadAnime(day);
                });
            });
        }
        this.noLink();
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
        this._buscarMedallas();
    }
    /** GET AND SHOW DATA */
    /**
     * Buscar y carga todos los animes del día 
     * actual.
     */
    async _verAnime() {
        let seasonMode = settings.get('is-season', false);
        let today = seasonMode ? 'Ver hoy' : this._dayWeek();
        let alternativeDay = this.getAlternativeDay(today);
        document.getElementById('title-day').innerText = alternativeDay;
        this._loadAnime(today);
    }
    /**
     * Carga los animes filtrados por el parametro `día`; además, inicializa 
     * todos los eventos.
     * @param {string} day Día por el cual se va a filtrar los animes
     */
    async _loadAnime(day) {
        let animeCards = document.getElementById('anime-cards');
        animeCards.innerHTML = '';
        let { datos: animes } = await this.db.buscar(day);
        //
        if (animes.length === 0) { // no necesito más porque si no hay datos el for no hace nada.
            let col = document.createElement('div');
            col.classList.add('col', 's12');
            col.innerHTML = /*html*/`
            <div class="center mt-10">
                <img class="ver-default-image" src="../../images/not_found.svg">    
                <p class="mt-20 grey-text bold">¿Aún no has agregado algún anime?</p>
            </div>
            `;
            animeCards.appendChild(col);
        }
        for (const animeRaw of animes) {
            let anime = new Anime(animeRaw.nombre, animeRaw.dias, animeRaw.nrocapvisto, animeRaw.totalcap, animeRaw.tipo, animeRaw.pagina, animeRaw.carpeta, animeRaw.estudios, animeRaw.origen, animeRaw.generos, animeRaw.duracion, animeRaw.portada, animeRaw.estado, animeRaw.repetir, animeRaw.activo, animeRaw.primeravez, animeRaw.fechaPublicacion, animeRaw.fechaEstreno, animeRaw.fechaCreacion, animeRaw.fechaUltCapVisto, animeRaw.fechaEliminacion, animeRaw._id);
            let col = document.createElement('div');
            col.classList.add('col', 's12');
            col.innerHTML = /*html*/`
                <div class="row no-margin">
                    <div id="modal${anime._id}" class="modal modal-radius">
                        <div class="modal-footer">
                            <h5 class="left-align pl-10 mt-10">¿En este momento el estado es...?<a href="#!" class="modal-action modal-close grey-text waves-effect waves right ver-modal-close"><i class="icon-cancel"></i></a></h5>        
                        </div>
                        <div class="modal-content blue-grey lighten-5">
                            <div class="center-align">
                                <img src="../../images/Golden_gate_bridge.svg" alt="golden gate bridge" height="150"/>
                            </div>
                            <div class="flex flex-x-center mt-20">
                                <a class="btn btn-small modal-close z-depth-0 waves-effect waves mr-10 transparent black-text no-link" dia="${day}" idanime="${anime._id}" id="anime-estado-viendo"><i class="green-text icon-play"></i> Viendo</a>
                                <a class="btn btn-small modal-close z-depth-0 waves-effect waves mr-10 transparent black-text no-link" dia="${day}" idanime="${anime._id}" id="anime-estado-fin"><i class="teal-text icon-ok-squared"></i> Finalizar</a>
                                <a class="btn btn-small modal-close z-depth-0 waves-effect waves mr-10 transparent black-text no-link" dia="${day}" idanime="${anime._id}" id="anime-estado-no-gusto"><i class="red-text icon-emo-unhappy"></i> No me Gusto</a>
                                <a class="btn btn-small modal-close z-depth-0 waves-effect waves mr-10 transparent black-text no-link" dia="${day}" idanime="${anime._id}" id="anime-estado-pausa"><i class="orange-text icon-pause"></i> En pausa</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card horizontal ver-radius-card mt-0">
                    <div class="card-image">
                        <div class="responsive-img ver-img-card" id="ver-img"
                            style="background-image: url('');">
                        </div>
                    </div>
                    <div class="card-stacked">
                        <div class="card-content ver-card-content">
                            <div class="row no-margin flex flex-y-center">
                                <div class="col s9">
                                    <h6 class="bold">${anime.nombre}</h6>
                                    <h6 class="ver-cap-vistos">
                                        <span id="span-cap-vistos" cap="${anime.nrocapvisto}" capTotal="${anime.totalcap}">${anime.nrocapvisto} capítulos vistos</span>
                                        <span class="grey-text"> • </span>
                                        <span class="grey-text">${this.getState(anime.estado).name}</span>
                                    </h6>
                                    <div class="flex">
                                        <a class="waves-effect waves btn btn-small transparent grey-text darken-1 z-depth-0 flex flex-x-center ver-folder-icon tooltipped"
                                            data-position="bottom" data-tooltip="${anime.carpeta}" id="anime-folder"><i
                                                class="icon-folder-open"></i></a>
                                        <a class="waves-effect waves btn btn-small transparent grey-text darken-1 z-depth-0 flex flex-x-center ver-link-icon tooltipped"
                                            data-position="bottom" data-tooltip="${anime.pagina}" id="anime-link"><i
                                                class="icon-link"></i></a>
                                        <a class="waves-effect waves btn btn-small transparent grey-text darken-1 z-depth-0 flex flex-x-center ver-sun-icon tooltipped modal-trigger"
                                            data-position="bottom" data-tooltip="${this.getState(anime.estado).name}" data-target="modal${anime._id}"><i
                                                class="icon-sun-inv"></i></a>
                                    </div>
                                </div>
                                <div class="col s3 flex flex-y-center">
                                    <a
                                        class="waves-effect waves btn transparent red-text z-depth-0 flex flex-x-center" dia="${day}" cap="${anime.nrocapvisto}" idanime="${anime._id}" id="anime-minus"><i
                                            class="icon-minus"></i></a>
                                    <a
                                        class="waves-effect waves btn transparent blue-text z-depth-0 flex flex-x-center" dia="${day}" cap="${anime.nrocapvisto}" idanime="${anime._id}" id="anime-plus"><i
                                            class="icon-plus"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            animeCards.appendChild(col);
            // ACTION SCRIPT
            this.noLink();
            this._validateDefaultImage(anime.portada.path).then(path => { // se encuentra en este formato para que la validación no detenga la carga de datos
                col.querySelector('#ver-img').setAttribute('style', `background-image: url('${path}')`)
            });
            if (this.isNoData(anime.carpeta) || anime.carpeta === '') col.querySelector('#anime-folder').classList.add('hide'); // validacion para carpeta
            if (!this.isUrl(anime.pagina)) col.querySelector('#anime-link').classList.add('hide');
            col.querySelector('#anime-link').addEventListener('mouseup', (e) => {
                // if (!this.isUrl(anime.pagina)) return;
                if (e.button === 0) {
                    if (!shell.openExternal(anime.pagina)) {
                        swal({
                            title: "Hubo problemas al abrir la url",
                            text: "Por favor revise el formato de la url en Editar Animes.",
                            icon: "error",
                            className: "error-swal"
                        });
                    }
                } else if (e.button === 2) {
                    clipboard.writeText(anime.pagina);
                    M.toast({
                        html: 'URL copiada al portapapeles',
                        displayLength: 4000
                    });
                }
            });
            col.querySelector('#anime-folder').addEventListener('mouseup', e => {
                if (e.button === 0) {
                    shell.openItem(anime.carpeta);
                } else if (e.button === 2) {
                    clipboard.writeText(anime.carpeta);
                    M.toast({
                        html: 'Dirección de la carpeta copiada al portapapeles',
                        displayLength: 4000
                    });
                }
            });
            col.querySelector('#anime-estado-viendo').addEventListener('click', async e => {
                this._updateState(e.currentTarget, 0);
            });
            col.querySelector('#anime-estado-fin').addEventListener('click', async e => {
                this._updateState(e.currentTarget, 1);
            });
            col.querySelector('#anime-estado-no-gusto').addEventListener('click', async e => {
                this._updateState(e.currentTarget, 2);
            });
            col.querySelector('#anime-estado-pausa').addEventListener('click', async e => {
                this._updateState(e.currentTarget, 3);
            });
            /** BOTÓNES MÁS Y MENOS CAPÍTULOS */
            let animeMinus = col.querySelector('#anime-minus');
            let animePlus = col.querySelector('#anime-plus');
            if (this._blockSerie(anime.estado)) {
                animeMinus.classList.add('disabled');
                animePlus.classList.add('disabled');
            }
            animeMinus.addEventListener('click', e => {
                let cap = parseFloat(e.currentTarget.getAttribute('cap'));
                let dia = e.currentTarget.getAttribute('dia');
                let id = e.currentTarget.getAttribute('idanime');
                cap = cap <= 0.5 ? 0 : cap - 1;
                this.actualizarCapitulo(anime, dia, cap, id);
            });
            animeMinus.addEventListener('mouseup', e => {
                if (e.button === 2) {
                    // Click derecho para minus
                    let cap = parseFloat(e.currentTarget.getAttribute('cap'));
                    let dia = e.currentTarget.getAttribute('dia');
                    let id = e.currentTarget.getAttribute('idanime');
                    cap = cap <= 0 ? 0 : cap - 0.5;
                    this.actualizarCapitulo(anime, dia, cap, id);
                }
            });
            animePlus.addEventListener('click', e => {
                let cap = parseFloat(e.currentTarget.getAttribute('cap'));
                let dia = e.currentTarget.getAttribute('dia');
                let id = e.currentTarget.getAttribute('idanime');
                cap += 1;
                this.actualizarCapitulo(anime, dia, cap, id);
            });
            animePlus.addEventListener('mouseup', e => {
                if (e.button === 2) {
                    // Click derecho para plus
                    let cap = parseFloat(e.currentTarget.getAttribute('cap'));
                    let dia = e.currentTarget.getAttribute('dia');
                    let id = e.currentTarget.getAttribute('idanime');
                    cap += 0.5;
                    this.actualizarCapitulo(anime, dia, cap, id);
                }
            });
            // Capitulos restantes
            let spanCapVistos = col.querySelector('#span-cap-vistos');
            spanCapVistos.addEventListener('mouseover', () => {
                let cap = parseFloat(spanCapVistos.getAttribute('cap'));
                let capTotal = parseFloat(spanCapVistos.getAttribute('capTotal'));
                if (!isNaN(capTotal) && !isNaN(capTotal) && cap <= capTotal) {
                    cap = parseInt(cap);
                    let capInv = capTotal - cap;
                    spanCapVistos.innerText = `${capInv} capítulos restantes`;
                }
            });
            spanCapVistos.addEventListener('mouseout', () => {
                let cap = parseFloat(spanCapVistos.getAttribute('cap'));
                if (!isNaN(cap)) {
                    spanCapVistos.innerText = `${cap} capítulos vistos`;
                }
            });
            //
        }
        M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        M.Modal.init(document.querySelectorAll('.modal'));
    }
    /**
	 * Busca los animes que ya no se están viendo 
	 * y por cada uno día agrega una medalla (`badge`)
	 * con el número de animes que cumplen la condición.
	 */
    async _buscarMedallas() {
        let diasSettings = settings.get('days', Days);
        let medallas = [];
        let contNombres = 0;
        for (const dias of diasSettings) {
            for (const dia of dias.data) {
                let datos = await this.db.buscarMedalla(dia.name);
                medallas.push({
                    itemMenu: contNombres++,
                    datos: datos
                });
            }
        }
        medallas.forEach((medalla) => {
            let { datos, itemMenu } = medalla;
            if (datos >= 0) {
                let tagDia = document.getElementById('menu').querySelectorAll('a')[itemMenu].querySelector('span');
                let numMedallas = datos == 0 ? '' : datos;
                tagDia.innerText = numMedallas;
            }
        });
    }
    /**
	 * Actualiza el número de capítulo de un anime y
	 * recarga la lista de animes.
	 * @param {Anime} anime Datos del anime.
	 * @param {number} cont Número de capítulo a actualizar.
     * @param {number} id Id del anime a actualizar
	 */
    async actualizarCapitulo(anime, dia, cont, id) {
        let estrenar = anime.fechaUltCapVisto === null && anime.fechaEstreno === null;
        let res = await this.db.actualizarCap(id, cont, estrenar);
        if (res === 0) {
            M.toast({
                html: 'Houston, tenemos un problema',
                displayLength: 4000
            });
        }
        this._loadAnime(dia);
    }
    /**
	 * Cambia el estado de un anime y 
	 * recarga la lista de animes.
	 * @param {HTMLElement} el Botón al que se ha hecho clic.
	 * @param {number} estado Estado del anime a guardar.
	 */
    async _updateState(el, estado) {
        let dia = el.getAttribute('dia');
        let id = el.getAttribute('idanime');
        await this.db.estadoCap(id, estado);
        this._loadAnime(dia);
        this._buscarMedallas();
    }
    /**
     * Comprueba que el `path` de la imagen sea válido, cumpliendo una 
     * serie de requisitos.
     * 
     * 1. Que el `path` tenga datos y no sea una `string` vacio.
     * 2. Que sea una `url`.
     * 3. En caso de ser una `url` que esta sea accesible.
     * 4. En caso de no ser una `url`, que sea un path de disco accesible.
     * 
     * Si no cumple con estas condiciones devuelve una imagen por defecto.
     * @param {string} pathImage Path de la imagen, puede ser una url o path de disco.
     */
    async _validateDefaultImage(pathImage) {
        // no se puede usar path.normalize() porque background-url no le acepta con un solo backslash (windows format)
        let pathRes = '';
        let images = [ // revisar que el backslash funcione bien en linux, mac
            '../../images/before_dawn.svg',
            '../../images/not_found.svg',
            '../../images/Tree_swing.svg'
        ];
        if (this.isNoData(pathImage) || pathImage === "") {
            return images[0];
        }
        if (this.isUrl(pathImage)) {
            let urlExists = this.urlExists(pathImage);
            if (urlExists) {
                pathRes = pathImage;
            } else {
                pathRes = images[0];
            }
        } else {
            try {
                if (fs.existsSync(pathImage)) {
                    pathRes = pathImage;
                } else {
                    pathRes = images[0];
                }
            } catch (err) {
                pathRes = images[0];
            }
        }
        return pathRes;
    }
    /* TOOLS AND MORE */
    /**
	 * Retorna el día de la semana actual.
	 * Se basa en la fecha actual del sistema.
	 */
    _dayWeek() {
        let daysWeek = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado")
        let date = new Date()
        return daysWeek[date.getDay()]
    }
    /**
	 * Comprueba si un anime debe estar bloqueado 
	 * de acuerdo a su estado.
	 * @param {number} estado Estado del anime.
	 */
    _blockSerie(estado) {
        if (estado == undefined || estado == 0)
            return false
        else if (estado === 1 || estado === 2 || estado === 3)
            return true
    }
}

exports.RenderVerAnime = RenderVerAnime;
