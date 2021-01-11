'use strict';
const remote = require('electron').remote;
const Menu = remote.Menu;
const dialog = remote.dialog;
const { Anime } = require('./Anime');
const settings = require('electron-settings');
const { Days } = require('../models/defaults-config.js');
const InputMenu = Menu.buildFromTemplate([
	{
		label: 'Cortar',
		role: 'cut',
	}, {
		label: 'Copiar',
		role: 'copy',
	}, {
		label: 'Pegar',
		role: 'paste',
	},
	{
		type: 'separator',
	},
	{
		label: 'Deshacer',
		role: 'undo',
	}, {
		label: 'Rehacer',
		role: 'redo',
	}, {
		type: 'separator',
	}, {
		label: 'Seleccionar todo',
		role: 'selectall',
	},
]);

/**
 * Clase dedicada a compartir funciones comunes en toda la aplicación.
 * Va desde context menu, a nuevos prototipos para las clases.
 */
class RenderBase {
	constructor() {
		this.initPrototypes();
		this.setContextMenu();
		this.numReg = 10;
	}
	/**
	 * Establece el `ContextMenu` con las opciones de 
	 * cortar, copiar, pegar, deshacer, rehacer, seleccionar todo.
	 * Este menu solo aparece en los inputs y textarea.
	 */
	setContextMenu() {
		document.body.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();

			let node = e.target;

			while (node) {
				if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
					InputMenu.popup(remote.getCurrentWindow());
					break;
				}
				node = node.parentNode;
			}
		});
	}
	/**
	 * Inicializa los prototipos para agregar y eliminar
	 * clases a un elemento HTML.
	 */
	initPrototypes() {
		HTMLElement.prototype.removeClass = this.removeClass;
		HTMLElement.prototype.addClass = this.addClass;
	}
	/**
	 * Quita los acentos del string proporcionado.
	 * @param {string} str String a analizar.
	 */
	quitaAcentos(str) {
		var res = str.toLowerCase()
		res = res.replace(new RegExp(/[àáâãäå]/g), 'a')
		res = res.replace(new RegExp(/[èéêë]/g), 'e')
		res = res.replace(new RegExp(/[ìíîï]/g), 'i')
		res = res.replace(new RegExp(/ñ/g), 'n')
		res = res.replace(new RegExp(/[òóôõö]/g), 'o')
		res = res.replace(new RegExp(/[ùúûü]/g), 'u')
		return res
	}
	/**
	 * Retorna un objeto con los metadatos del
	 * estado de un anime.
	 * 		- 0: Viendo
	 * 		- 1: Finalizado
	 * 		- 2: No me gusto
	 * @param {number} estado Estado de anime.
	 */
	getState(estado) {
		return {
			0: {
				name: 'Viendo',
				icon: 'icon-play',
				color: 'green-text',
				backgroundColor: 'green'
			},
			1: {
				name: 'Finalizado',
				icon: 'icon-ok-squared',
				color: 'teal-text',
				backgroundColor: 'teal'
			},
			2: {
				name: 'No me gusto',
				icon: 'icon-emo-unhappy',
				color: 'red-text',
				backgroundColor: 'red'
			},
			3: {
				name: 'En pausa',
				icon: 'icon-pause',
				color: 'orange-text',
				backgroundColor: 'orange'
			}
		}[estado]
	}
	/**
	 * Retorna un objeto con los metadatos del
	 * tipo de anime.
	 * 		- 0: TV
	 * 		- 1: Película
	 * 		- 2: Especial
	 * 		- 3: OVA
	 * @param {number} tipo Tipo de anime.
	 */
	getStateType(tipo) {
		return {
			0: {
				name: 'Anime (TV)',
			},
			1: {
				name: 'Película',
			},
			2: {
				name: 'Especial',
			},
			3: {
				name: 'OVA',
			}
		}[tipo];
	}
	/**
	 * Busca los hermanos de un elemento HTML.
	 * @param {HTMLElement} el Elemento HTML.
	 * @return {HTMLElement[]} Hermanos del elemento HTML.
	 */
	siblings(el) {
		return Array.prototype.filter.call(el.parentNode.children, (child) => {
			return child !== el;
		});
	}
	/**
	 * Remueve la clase CSS del elemento HTML.
	 * @param {HTMLElement} el Elemento HTML:
	 * @param {string} className Nombre de la clase.
	 */
	removeClass(el, className) {
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
	/**
	 * Agrega la clase CSS al elemento HTML.
	 * @param {HTMLElement} el Elemento HTML.
	 * @param {string} className Nombre de la clase.
	 */
	addClass(el, className) {
		if (el.classList)
			el.classList.add(className);
		else
			el.className += ' ' + className;
	}
	/**
	 * Elimina el elemento HTML que se proporciona (se elimina a si mismo).
	 * @param {HTMLElement} el Elemento HTML
	 */
	removeEl(el) {
		el.parentNode.removeChild(el);
	}
	/**
	 * Cancela la acción predeterminada de los links
	 * con la clase `.no-link`.
	 * Evitar que se haga una redirección.
	 */
	noLink() {
		document.querySelectorAll('.no-link').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
			})
		});
	}
	/**
	 * Obtiene el día de la semana
	 * de la fecha dada.
	 * @param {Date} date Fecha
	 */
	getDiaSemana(date) {
		let diasSemana = new Array("domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado")
		return diasSemana[date.getDay()]
	}
	/**
	 * Retorna el mismo día de la semana, pero 
	 * agregado los acentos respectivos.
	 * @param {string} dia Día que se muestra de título sobre la lista de animes.
	 */
	addDiasAccents(dia) {
		if (dia === 'sabado')
			return 'sábado'
		else if (dia === 'miercoles')
			return 'miércoles'
		else
			return dia
	}
	/**
	 * Captura la dirección del input
	 * proporcionado y lo guarda en atributos.
	 * Método especifico de para ciertos
	 * inputs tipo file.
	 * @param {HTMLElement} input Input al cual se va a agregar la dirección
	 */
	getFolder(input) {
		let folders = dialog.showOpenDialogSync(null, {
			properties: ['openDirectory']
		});
		if (this.isNoData(folders)) return;
		let folder = folders[0];
		input.setAttribute('value', folder);

		let label = this.siblings(input)[0];
		label.innerHTML = 'Cargado';
		label.setAttribute('data-tooltip', folder);
		label.removeClass(label, 'blue'); // método hecho con prototipos de la clase RenderBase
		label.addClass(label, 'green'); // método hecho con prototipos de la clase RenderBase
		label.removeClass(label, 'blue-text'); // método hecho con prototipos de la clase RenderBase
		label.addClass(label, 'green-text'); // método hecho con prototipos de la clase RenderBase
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
	}
	/**
	 * Convierte todos los backslash `\` a slash `/`
	 * @param {string} folder Dirección de la carpeta
	 */
	slashFolder(folder) {
		let path = ''
		for (let i in folder) {
			if (folder.charCodeAt(i) === 92) {
				path += '/'
				continue
			}
			path += folder[i]
		}
		return path
	}
	/**
	 * Comprueba que el string sea o no una URL
	 * válida.
	 * @param {string} path Dirección a comprobar.
	 */
	isUrl(path) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(path)
	}
	/**
	 * Comprueba que si parámetro tiene 
	 * datos.
	 * @param {any} data 
	 */
	isNoData(data) {
		return data === undefined || data === null
	}
	/**
	 * Convierte la primera letra a mayúscula.
	 * @param {string} value Cualquier texto
	 */
	firstUpperCase(value) {
		return value.charAt(0).toUpperCase() + value.slice(1)
	}
	/**
	 * Esta línea super larga solo significa que tome el primer valor del objeto anidado.
	 * @param {Object} menuSettings Estos son los días que se guardan en el archivo Settings, esto días pueden se cambiados por el usuario.
	 */
	firstDaySettings(menuSettings) {
		return menuSettings[Object.keys(menuSettings)[0]][Object.keys(menuSettings[Object.keys(menuSettings)[0]])[0]].id;
	}
	/**
	 * Recarga la pagina actual. Funciona siempre y
	 * cuando el link de la pagina no tenga al final
	 *  `#` o `#!`
	 */
	recargarPagina() {
		// Se ve raro pero funciona :v
		window.location.href = window.location.href;
	}
	/**
	 * Calcula el número de paginas posibles,
	 * en base al total de registros proporcionados.
	 * @param {number} totalReg Total de registros consultados.
	 */
	_totalPag(totalReg) {
		return Math.ceil(totalReg / this.numReg)
	}
	/**
	 * Calcula el salto de paginación para la base de datos.
	 * @param {number} pag Pagina a mostrar.
	 * @param {number} totalReg Total de registros consultados.
	 */
	saltoPaginacion(pag, totalReg) {
		return this.numReg * (pag - 1)
	}
	/**
	 * Determina si el número de paginas obtenidas supera
	 * el límite predeterminado.
	 * 10 es el límite de las paginas a mostrar.
	 * @param {number} todasPag Todas las paginas consultadas.
	 * @return {boolean}
	 */
	limitePaginas(todasPag) {
		/**/
		return todasPag > 10
	}
	/**
	 * Calcula el límite de paginas a mostrar.
	 */
	limitePaginasInicio(pagActual, totalPag) {
		let inicio = pagActual - 5
		let passLimitEnd = totalPag - 9
		if (inicio < 2)
			return 1
		else
			return pagActual + 4 > totalPag ? passLimitEnd : inicio
	}
	/**
	 * Determina el número de paginas que se 
	 * mostraran a la vez.
	 */
	limitePaginasFin(pagActual, totalPag) {
		let inicio = pagActual - 5
		let fin = pagActual + 4 > totalPag ? totalPag : pagActual + 4
		if (inicio < 2)
			return 10
		else
			return fin
	}
	/**
	 * Este addEventListener() es porque la validación del select
	 * de materialize no funciona, y este es un fix para eso. Esta 
	 * variación solo muestra una línea roja como indicativo de
	 * error.
	 */
	_fixSelectValidationLine() {
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
					if (select.value === "") {
						select.parentElement.classList.add('error-line');
					} else {
						select.parentElement.classList.remove('error-line');
					}
				});
			});
		});
	}
	/**
	 * Corrigue el error de la validación de los select 
	 * `An invalid form control with name='tipo' is not focusable.`
	 */
	_fixSelectForm() {
		let selects = document.querySelectorAll('select[required]');
		selects.forEach((value, key) => {
			value.style.display = 'inline';
			value.style.position = 'absolute';
			value.style.top = '10px';
			value.style.padding = 0;
			value.style.margin = 0;
			value.style.border = 0;
			value.style.height = 0;
			value.style.width = 0;
			value.style.zIndex = -10;
		});
	}
	async comprobarVersion(bd) {
		let animesAntiguos = await bd.buscarAnimeAntiguo();
		if (animesAntiguos.length > 0) {
			await this.advertenciaVersion1();
			this.advertenciaProcesando();
			let migrated = await this.convertirANuevoAnime(animesAntiguos, bd);
			if (migrated) {
				await swal({
					title: "Éxito",
					text: "Hemos actualizado los datos con éxito. Se recargara la ventana.",
					icon: "success",
					className: "success-swal"
				});
				window.location.href = window.location.href;
			}
			else {
				await swal({
					title: "Houston, tenemos un problema",
					text: "Hubo un error leyendo los datos del archivo original. Por favor recargue la ventana y vuelva a intentarlo.",
					icon: "error",
					className: "error-swal"
				});
			}
		}
	}
	/**
	 * Mensaje de advetencia de versión `1.x.x`.
	 */
	advertenciaVersion1() {
		return swal({
			title: "¿Problemas de actualización?",
			text: "Se encontró animes en la versión 1.x.x esto puede dar problemas en esta versión así que vamos a actualizar sus datos para que no de conflictos.",
			icon: "warning",
			button: {
				className: "green"
			},
			className: "warning-swal"
		});
	}
	async advertenciaProcesando() {
		let preload = document.createElement('div');
		preload.innerHTML = /*html*/`
        <h4 class="center blue-grey-text mb-40">Procesando...</h4>
        <div class="preloader-wrapper big bigger active mb-20">
			<div class="spinner-layer spinner-blue">
				<div class="circle-clipper left">
				<div class="circle"></div>
				</div><div class="gap-patch">
				<div class="circle"></div>
				</div><div class="circle-clipper right">
				<div class="circle"></div>
				</div>
			</div>
			<div class="spinner-layer spinner-red">
				<div class="circle-clipper left">
				<div class="circle"></div>
				</div><div class="gap-patch">
				<div class="circle"></div>
				</div><div class="circle-clipper right">
				<div class="circle"></div>
				</div>
			</div>
			<div class="spinner-layer spinner-yellow">
				<div class="circle-clipper left">
				<div class="circle"></div>
				</div><div class="gap-patch">
				<div class="circle"></div>
				</div><div class="circle-clipper right">
				<div class="circle"></div>
				</div>
			</div>
			<div class="spinner-layer spinner-green">
				<div class="circle-clipper left">
				<div class="circle"></div>
				</div><div class="gap-patch">
				<div class="circle"></div>
				</div><div class="circle-clipper right">
				<div class="circle"></div>
				</div>
			</div>
        </div>
        `;
		return swal({
			content: preload,
			buttons: false,
			closeOnClickOutside: false,
			className: "swal-preload-modal",
		});
	}
	/**
	 * Utiliza los datos de los animes en la versión antigua y crea objetos nuevos 
	 * tipo `Anime` que se utilizarán para actulizar los mismos animes en la base de 
	 * datos.
	 * @param {any} listaOldAnimes Lista de animes que coincidieron con la versión antigua.
	 * @param {any} db Instancia de la base de datos.
	 */
	async convertirANuevoAnime(listaOldAnimes, db) {
		for (const oldAnime of listaOldAnimes) {
			let nombre = oldAnime.nombre;
			let dias = [{
				dia: this._diasNuevoFormato(oldAnime.dia),
				orden: oldAnime.orden
			}];
			let nrocapvisto = oldAnime.nrocapvisto;
			let totalcap = parseInt(oldAnime.totalcap) === undefined ? null : parseInt(oldAnime.totalcap);
			let tipo = oldAnime.tipo === undefined ? null : oldAnime.tipo;
			let pagina = oldAnime.pagina;
			let carpeta = oldAnime.carpeta;
			let estudios = null;
			let origen = '';
			let generos = null;
			let duracion = null;
			let portada = {
				type: 'url',
				path: ''
			};
			let estado = oldAnime.estado;
			let repetir = [];
			let activo = oldAnime.activo; // solo hubo 1 caso undefined de 217 posibles casos
			let primeravez = true;
			let fechaPublicacion = null;
			let fechaEstreno = null;
			let fechaCreacion = oldAnime.fechaCreacion;
			let fechaUltCapVisto = oldAnime.fechaUltCapVisto || null;
			let fechaEliminacion = oldAnime.fechaEliminacion || null;
			let anime = new Anime(nombre, dias, nrocapvisto, totalcap, tipo, pagina, carpeta, estudios, origen, generos, duracion, portada, estado, repetir, activo, primeravez, fechaPublicacion, fechaEstreno, fechaCreacion, fechaUltCapVisto, fechaEliminacion, oldAnime._id);
			try {
				await db.actualizarAnime(oldAnime._id, anime);
			} catch (error) {
				return false;
			}
		}
		return true;
	}
	/**
	 * Reconoce y cambia el día del formato antiguo al nuevo.
	 * @param {string} dia Día en formato antiguo
	 */
	_diasNuevoFormato(dia) {
		switch (dia) {
			case 'lunes':
				return 'Lunes';
			case 'martes':
				return 'Martes';
			case 'miercoles':
				return 'Miércoles';
			case 'jueves':
				return 'Jueves';
			case 'viernes':
				return 'Viernes';
			case 'sabado':
				return 'Sábado';
			case 'domingo':
				return 'Domingo';
			case 'sin ver':
				return 'Sin ver';
			case 'visto':
				return 'Visto';
			case 'ver hoy':
				return 'Ver hoy';
			default:
				return 'Lunes';
		}
	}
	/**
     * Comprueba si una `url` es accesible. El método funciona de 
     * forma síncrona ignorando el mensaje `deprecate`.
     * @param {string} url URL a probar.
     */
	urlExists(url) {
		try {
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			return http.status != 404;
		} catch (_error) {
			return false;
		}
	}
	/**
	 * Modifica una página con un contenedor para mostrar solo una
	 * imagen y un texto debajo de ella diciendo que no 
	 * hay datos para mostrar.
	 * @param {string} el Contenedor de la imagen
	 * @param {string} img Imagen a mostrar
	 */
	containerBlancoConImagen(el, img) {
		document.body.classList.add('vh-100');
		let container = document.getElementById(el);
		container.classList.add('flex', 'flex-x-center', 'flex-y-center');
		container.innerHTML = /*html*/`
			<div class="mt-20">
				<img class="responsive-img" width="400" src="../../images/${img}" />
				<p class="blue-grey-text bold center">No hay datos disponibles, inténtalo de nuevo más tarde.</p>
			</div>
		`;
	}
	/**
     * Busca entre los días guardados (semana, estrenos) el nombre
     * alternativo del día dado.
     * @param {string} today Día del cual se buscará el nombre alternativo.
     */
	getAlternativeDay(today) {
		let alternativeDay = '';
		let diasSettings = settings.get('days', Days);
		for (const groupDay of diasSettings) {
			for (const day of groupDay.data) {
				if (day.name === today) {
					alternativeDay = day.alternative;
				}
			}
		}
		return alternativeDay;
	}
}

exports.RenderBase = RenderBase;