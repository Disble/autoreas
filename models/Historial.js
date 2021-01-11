'use strict'
const { RenderBase } = require('./RenderBase.js');
const { BDAnimes } = require('./consultas.js');
const { Estados, Tipos } = require('./defaults-config.js');
const { ipcRenderer } = require('electron');
const { Anime } = require('./Anime');
const fs = require('fs');

/**
 * Controla todo lo referente a la página Historia y 
 * páginas de estadísticas como: capítulos vistos,
 * capítulos restantes, páginas.
 */
class Historial extends RenderBase {
	/**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
	constructor() {
		super();
		this.db = new BDAnimes();
	}
	/**
	 * Imprime una tabla con los datos de los animes
	 * consultados.
	 * @param {any} consulta Datos de los animes.
	 * @param {number} salto Contador del total de animes consulados.
	 * @param {number} pagina Página actual
	 */
	imprimirHistorial(consulta, salto, pag) {
		this._resetArgsHistory();
		let tblListaAnimes = '';
		let cont = salto;
		consulta.forEach((value, i) => {
			tblListaAnimes += /*html*/`
			<tr>
				<td>${++cont}</td>
				<td>${consulta[i].nombre}${consulta[i].activo === false ? '<i class="icon-state-trash icon-trash-empty right">' : ''}</td>
				<td>${this.isNoData(consulta[i].nrocapvisto) ? 'No Data' : consulta[i].nrocapvisto}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this._setCalendarDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this.firstUpperCase(this.addDiasAccents(this.getDiaSemana(consulta[i].fechaUltCapVisto)))}</td>
				<td>${this.isNoData(consulta[i].fechaUltCapVisto) ? 'No Data' : this._setHourDate(consulta[i].fechaUltCapVisto)}</td>
				<td>${this.isNoData(consulta[i].estado) ? 'No Data' : `<i class="icon-state-historial ${this.getState(consulta[i].estado).icon} ${this.getState(consulta[i].estado).color}"></i>`}</td>
				<td class="hidden" id="key" autoreas-pag="${pag}">${consulta[i]._id}</td>
			</tr>`
		});
		document.getElementById('contenido').innerHTML = tblListaAnimes;
		this._enlaceHistAnime();
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50,
			enterDelay: 350
		});
	}
	/**
	 * Vuelve a cargar los datos del historial con nuevos datos.
	 * @param {number} pagina Número de paginación.
	 * @param {number} opcion Opción para la función `cargarHistorial()`
	 */
	async _cargarHistorial(pagina, opcion) {
		let { datos, salto, totalReg, pag } = await this.db.cargarHistorial(pagina, opcion);
		this.imprimirHistorial(datos, salto, pag);
		this.imprimirPagination(totalReg, pag);
	}
	/**
	 * Imprime la paginación en formato HTML.
	 * También inicializa los eventos respectivos.
	 * @param {number} totalReg Total de registros consultados.
	 * @param {number} actual Pagina actual.
	 */
	imprimirPagination(totalReg, actual) {
		let paginas = document.getElementById('paginas');
		paginas.innerHTML = ''; // es solo para resetar los child
		let todasPag = this._totalPag(totalReg);
		let inicio = this.limitePaginas(todasPag) ? this.limitePaginasInicio(actual, todasPag) : 1;
		let fin = this.limitePaginas(todasPag) ? this.limitePaginasFin(actual, todasPag) : todasPag;
		// li inicio
		let liInicio = document.createElement('li');
		let liInicioA = document.createElement('a');
		liInicio.classList.add('waves-effect');
		if (actual === inicio) liInicio.classList.add('disabled');
		liInicioA.href = '#';
		liInicioA.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (actual !== inicio) {
				this._cargarHistorial(1);
			}
		});
		liInicioA.innerHTML = /*html*/`<i class="icon-pag icon-left-open"></i>`;
		liInicio.appendChild(liInicioA);
		paginas.appendChild(liInicio);
		// li intermedios
		for (let i = inicio; i <= fin; i++) {
			let liInter = document.createElement('li');
			let liInterA = document.createElement('a');
			liInter.classList.add('waves-effect');
			if (actual === i) liInter.classList.add('active');
			liInterA.href = '#';
			liInterA.addEventListener('click', async (e) => {
				e.preventDefault();
				e.stopPropagation();
				this._cargarHistorial(i);
			});
			liInterA.innerHTML = i;
			liInter.appendChild(liInterA);
			paginas.appendChild(liInter);
		}
		// li fin
		let liFin = document.createElement('li');
		let liFinA = document.createElement('a');
		liFin.classList.add('waves-effect');
		if (actual === fin) liFin.classList.add('disabled');
		liFinA.href = '#';
		liFinA.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (actual !== fin) {
				this._cargarHistorial(todasPag);
			}
		});
		liFinA.innerHTML = /*html*/`<i class="icon-pag icon-right-open"></i>`;
		liFin.appendChild(liFinA);
		paginas.appendChild(liFin);
	}
	/**
	 * Cargando datos de selects para el buscador.
	 */
	_cargarSelectsBuscador() {
		let tiposSelect = document.getElementById('tipo-select');
		let estadosSelect = document.getElementById('estado-select');
		for (const tipo in Tipos) {
			let opcion = document.createElement('option');
			opcion.value = Tipos[tipo];
			opcion.innerText = this.firstUpperCase(tipo);
			tiposSelect.appendChild(opcion);
		}
		for (const estado in Estados) {
			const valor = Estados[estado];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = estado;
			estadosSelect.appendChild(opcion);
		}
	}
	/**
	 * Inicializa todos los eventos necesarios para
	 * que funciones el buscador. Entre estos están eventos 
	 * de botón cuando se escribe, autocompletado, modales, 
	 * atajo global `ctr+f`, botón recargar.
	 */
	async configurarBuscador() {
		this._cargarSelectsBuscador();
		let data = await this.db.buscarAutocompleteHistorial();
		document.getElementById('search-history').addEventListener('keyup', (e) => {
			let query = document.getElementById('search-history').value;
			if (query.length > 0) {
				this._buscarAnimes(query, false);
			} else {
				this._recargarHistorial();
			}
		});
		M.Autocomplete.init(document.querySelectorAll('input.autocomplete'), {
			data,
			limit: 5,
			onAutocomplete: val => {
				this._buscarAnimes(val, false);
			}
		});
		// Inicializando el modal con el campo de búsqueda
		M.Modal.init(document.querySelectorAll('.modal'), {
			onOpenEnd() {
				document.getElementById('search-history').focus();
			}
		});
		// Inicializando los selects del buscador.
		M.FormSelect.init(document.querySelectorAll('select'));
		// Configurando que el modal se cierre al aplastar enter
		let searchConfirm = document.getElementById('search-confirm');
		document.getElementById('search-history').addEventListener('keypress', (e) => {
			if (e.keyCode === 13) {
				searchConfirm.click();
			}
		});
		// Botón para recargar el historial
		document.getElementById('reload-history').addEventListener('click', e => {
			this._recargarHistorial();
		});
		// Combinación de Ctrl + f global para activar el buscador
		document.addEventListener('keypress', (e) => {
			if (e.ctrlKey === true && e.keyCode === 6) {
				M.Modal.getInstance(document.getElementById('modal-search')).open();
			}
		});
		this._fitrarOpciones();
	}

	async _buscarAnimes(query, esFiltro, opcionOrden) {
		let datos = await this.db.buscarAutocompleteAnimes(query, esFiltro, opcionOrden);
		this.imprimirHistorial(datos, 0);
		this._ocultarOpciones();
		document.getElementById('div-filter').style.display = 'block';
	}

	_ocultarOpciones() {
		document.getElementById('reload-history').style.display = 'block';
		document.getElementById('paginas').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'true');
	}
	/**
	 * Regresa a los valores por defecto a la 
	 * página y oculta el botón recargar.
	 */
	async _recargarHistorial() {
		this._cargarHistorial(1, 1);
		document.getElementById('reload-history').style.display = 'none';
		document.getElementById('paginas').style.display = 'block';
		document.getElementById('div-filter').style.display = 'none';
		document.getElementById('div-filter').setAttribute('show', 'false');
		document.getElementById('search-history').value = '';
	}

	_fitrarOpciones() {
		document.getElementById('filter-history').addEventListener('click', (e) => {
			let divFilter = document.getElementById('div-filter');
			let show = divFilter.getAttribute('show');

			if (show === 'true') {
				divFilter.style.display = 'none';
				divFilter.setAttribute('show', 'false');
			} else if (show === 'false') {
				divFilter.style.display = 'block';
				divFilter.setAttribute('show', 'true');
			}
		});
		document.getElementById('btn-filter').addEventListener('click', async (e) => {
			let query = document.getElementById('search-history').value;
			// los select estan funcionando mal
			let estados = M.FormSelect.getInstance(document.getElementById('estado-select')).getSelectedValues();
			let tipos = M.FormSelect.getInstance(document.getElementById('tipo-select')).getSelectedValues();
			let orden = this._getSelectedValueFix(M.FormSelect.getInstance(document.getElementById('orden-select')));
			let opcionesFiltro = {};
			let opcionesEstado = [];
			let opcionesTipo = [];
			let opcionOrden = {};

			// console.log('datos: ', query, estados, tipos, orden);

			if (parseInt(orden) === 1) {
				opcionOrden = {
					"nombre": 1
				}
			} else if (parseInt(orden) === 2) {
				opcionOrden = {
					"fechaUltCapVisto": -1
				}
			} else if (parseInt(orden) === 3) {
				opcionOrden = {
					"fechaCreacion": -1
				}
			} else {
				opcionOrden = {
					"fechaUltCapVisto": -1
				}
			}

			if (estados.length === 0 && tipos.length === 0) {
				return this._buscarAnimes(query, true, opcionOrden);
			}

			for (const estado of estados) {
				opcionesEstado.push({
					"estado": parseInt(estado)
				});
			}

			for (const tipo of tipos) {
				opcionesTipo.push({
					"tipo": parseInt(tipo)
				});
			}

			if (opcionesEstado.length > 0 && opcionesTipo.length > 0) {
				opcionesFiltro.$and = [];
				opcionesFiltro.$and.push({ $or: opcionesEstado });
				opcionesFiltro.$and.push({ $or: opcionesTipo });
			} else if (opcionesEstado.length > 0) {
				opcionesFiltro.$or = opcionesEstado;
			} else if (opcionesTipo.length > 0) {
				opcionesFiltro.$or = opcionesTipo;
			}

			// console.log('filtros: ', query, opcionesFiltro, opcionOrden);

			let datos = await this.db.filtrarBuscadorHistorial(query, opcionesFiltro, opcionOrden);
			this.imprimirHistorial(datos, 0);
			this._ocultarOpciones();
		});
	}
	/**
	 * Corrigue el método `getSelectedValues()`
	 * de Materialize-css
	 * que no capturaba bien los datos con un 
	 * select simple.
	 * @param {any} orden Instance de select de Materialize-css
	 */
	_getSelectedValueFix(orden) {
		for (let i = 0; i < orden.$selectOptions.length; i++) {
			const element = orden.$selectOptions[i];
			if (element, orden.$selectOptions[i].selected) {
				return orden.$selectOptions[i].value;
			}
		}
	}
	/**
	 * Carga la interfaz de la página `Capítulos vistos` 
	 * con una estadística de los animes viendo.
	 * @param {any[]} lista Lista de animes que se están viendo
	 */
	capitulosVistos(lista) {
		let listFilter = this._filterCapActiveChart(lista)
		this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos vistos')
	}
	/**
	 * Modifica la pagina completa para mostrar solo una
	 * imagen y un texto debajo de ella diciendo que no 
	 * hay datos para mostrar.
	 */
	paginaBlancoConImagen() {
		document.body.classList.add('vh-100', 'flex', 'flex-x-center', 'flex-y-center');
		document.body.innerHTML = /*html*/`
			<div>
				<img class="responsive-img" width="400" src="../../images/not_found.svg" />
				<p class="blue-grey-text bold">No hay datos disponibles, inténtalo de nuevo más tarde.</p>
			</div>
		`;
	}
	/**
	 * Inicializa el chart con el número de capítulos 
	 * vistos, y después carga los datos del anime dentro 
	 * del modal.
	 * @param {any} anime Datos del anime.
	 */
	capitulosVistosUnAnime(anime) {
		let animeFilter = this._filterCapChart(anime);
		this._chartCapResVistos(animeFilter.datasets, animeFilter.name, 'Capítulos vistos');
	}
	/**
	 * Crea un evento `click` para cada fila de la tabla 
	 * de animes. Cada vez que se haga clic en una fila 
	 * se generara un modal para mostrar los datos del anime.
	 */
	_enlaceHistAnime() {
		document.querySelectorAll('td.hidden').forEach((value, i) => {
			value.parentElement.addEventListener('click', e => {
				let row = value.parentElement.querySelector('#key');
				let key = row.innerHTML;
				let pag = parseInt(row.getAttribute('autoreas-pag'));
				ipcRenderer.sendSync('load-info-page', {
					key,
					pag
				}); // envia la clave del anime al main y luego el main carga la vista info.
			});
		});
	}
	/**
	 * Vuelve los argumentos del historial a `null` para
	 * que así se puedan volver a validar.
	 */
	_resetArgsHistory() {
		ipcRenderer.sendSync('reset-args-history', null);
	}
	/**
	 * Establece los datos del anime en la 
	 * sección de información.
	 * @param {Anime} anime Datos del anime
	 */
	setInfoAnime(anime) {
		// Cover
		// Para mostrar la imagen en realidad lo único que importa es la dirección del slash.
		this._isDefaultImage(anime.portada.path).then(isDefault => { // se encuentra en este formato para que la validación no detenga la carga de datos
			let cover = document.getElementById('info-cover');
			if (isDefault) {
				cover.setAttribute('style', `background-image: url('../../images/Eiffel_tower.svg'); background-size: contain;`);
			} else {
				cover.setAttribute('style', `background-image: url('${anime.portada.path}')`);
			}
		});
		// Info
		document.getElementById('nombre').innerText = anime.nombre === '' ? 'Una típica historia' : anime.nombre;
		document.getElementById('estado').innerText = this.getState(anime.estado).name;
		let numcapvistos = '';
		if (this.isNoData(anime.nrocapvisto) || anime.nrocapvisto === 0) {
			numcapvistos = 'Empieza hoy una nueva aventura';
		} else if (anime.nrocapvisto === 1) {
			numcapvistos = `${anime.nrocapvisto} capítulo visto`;
		} else {
			numcapvistos = `${anime.nrocapvisto} capítulos vistos`;
		}
		document.getElementById('capvistos').innerText = numcapvistos;
		document.getElementById('totalcap').innerText = this.isNoData(anime.totalcap) ? 'No hay datos del total de capítulos' : `${anime.totalcap} capítulos en total`;
		document.getElementById('duracion').innerText = this.isNoData(anime.duracion) ? 'No hay datos de la duración por capítulo' : `${anime.duracion} minutos por capitulo`;
		document.getElementById('tipo').innerText = this.isNoData(anime.tipo) ? 'Desconocido' : this.getStateType(anime.tipo).name;
		document.getElementById('pagina').innerText = this.isNoData(anime.pagina) ? 'Houston, tenemos un problema...' : anime.pagina;
		document.getElementById('carpeta').innerText = this.isNoData(anime.carpeta) ? '¿Todo online?' : anime.carpeta;
		document.getElementById('origen').innerText = this.isNoData(anime.origen) || anime.origen === '' ? 'Todo tiene un origen, incluso un anime' : anime.origen;
		// Estadisticas
		document.getElementById('fechapublicacion').value = this.isNoData(anime.fechaPublicacion) ? 'Desconocido' : this._setFullDate(anime.fechaPublicacion);
		document.getElementById('fechaestreno').value = this.isNoData(anime.fechaEstreno) ? 'Desconocido' : this._setFullDate(anime.fechaEstreno);
		document.getElementById('fechacreacion').value = this.isNoData(anime.fechaCreacion) ? 'Desconocido' : this._setFullDate(anime.fechaCreacion);
		document.getElementById('fechaultcap').value = this.isNoData(anime.fechaUltCapVisto) ? 'Desconocido' : this._setFullDate(anime.fechaUltCapVisto);
		document.getElementById('fechaeliminacion').value = this.isNoData(anime.fechaEliminacion) ? 'Desconocido' : this._setFullDate(anime.fechaEliminacion);
		// Generos
		let chipsGeneros = document.getElementById('chips-generos');
		if (!this.isNoData(anime.generos) && anime.generos.length > 0)
			for (const genero of anime.generos) {
				let chip = document.createElement('div');
				chip.classList.add('chip');
				chip.innerText = genero;
				chipsGeneros.append(chip);
			}
		if (this.isNoData(anime.generos) || anime.generos.length === 0) { // en caso de no haber datos
			chipsGeneros.innerHTML = /*html*/`<h6 class="bold">¿Acción o Terror? ¿Fantasía o Ciencia ficción?</h6>`;
		}
		// Estudios
		if (!this.isNoData(anime.estudios) && anime.estudios.length > 0) {
			let estudiosHTML = '';
			for (const estudio of anime.estudios) {
				estudiosHTML += /*html*/`<h6 class="bold" id="origen">${estudio.estudio} <span class="grey-text">${estudio.url === '' ? '' : '•'}
				${estudio.url}</span></h6>`;
			}
			document.getElementById('estudios').innerHTML = estudiosHTML;
		}
		// Botón Eliminar
		document.querySelector('.btn-eliminar-anime').addEventListener('click', e => {
			e.preventDefault();
			e.stopPropagation();
			this._deleteAnime(anime._id);
		});
		// Botón Restaurar
		if (!anime.activo) {
			document.getElementById('restaurar-container').classList.remove('hide');
			document.querySelector('.btn-restaurar-anime').addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this._restoreRow(anime._id);
			});
		}
		// Botón Repetir
		if (anime.repetir.length > 0) {
			document.getElementById('historial-repeticion').classList.remove('hide');
			document.getElementById('for-repeticion').innerHTML = this._htmlRepetirHistorial(anime.repetir);
		}
		if (anime.estado > 0) {
			document.getElementById('repetir-container').classList.remove('hide');
			document.querySelector('.btn-repetir-anime').addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this._repeatAnime(anime);
			});
		}
		// Charts
		this.capitulosVistosUnAnime(anime);
		this._setInfoLineaTiempo(anime);
	}
	/**
	 * Genera una estructura html con los datos de cada repetición 
	 * del anime.
	 * @param {any} repeticiones Lista del historico de repeticiones
	 */
	_htmlRepetirHistorial(repeticiones) {
		let repeticionHistorial = '';
		for (const repeticion of repeticiones) {
			repeticionHistorial += /*html*/`
				<li>
					<div class="collapsible-header">Repetición ${repeticion.numrepeticion}</div>
					<div class="collapsible-body">
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this.getState(repeticion.estado).name}">
								<label>Estado</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${repeticion.nrocapvisto}">
								<label>Número de capitulos vistos</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this.isNoData(repeticion.fechaCreacion) ? 'Desconocido' : this._setFullDate(repeticion.fechaCreacion)}">
								<label>Fecha de creación</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this.isNoData(repeticion.fechaEstreno) ? 'Desconocido' : this._setFullDate(repeticion.fechaEstreno)}">
								<label>Fecha de estreno</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this.isNoData(repeticion.fechaUltCapVisto) ? 'Desconocido' : this._setFullDate(repeticion.fechaUltCapVisto)}">
								<label>Fecha de último capitulo visto</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this.isNoData(repeticion.fechaEliminacion) ? 'Desconocido' : this._setFullDate(repeticion.fechaEliminacion)}">
								<label>Fecha de eliminación</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
								<input readonly type="text" value="${this._setFullDate(repeticion.fechaRepeticion)}">
								<label>Siguiente repetición</label>
							</div>
						</div>
					</div>
				</li>
			`;
		}
		return repeticionHistorial;
	}
	/**
	 * Establece la línea de tiempo para el anime
	 * dado.
	 * @param {any} anime Datos del anime.
	 */
	_setInfoLineaTiempo(anime) {
		let animeFil = this._filtroLineaTiempo(anime);
		this._chartLineaTiempo(animeFil, 'line', 'Línea de tiempo');
	}
	/**
	 * Repite un anime.
	 * @param {Anime} anime Anime
	 */
	async _repeatAnime(anime) {
		let confirm = await swal({
			title: "¿Nueva partida?",
			text: "Se hará un respaldo de los datos actuales y luego se resetearan para que puedas vivir otra vez esta historia.",
			icon: "info",
			className: "info-swal",
			buttons: {
				cancel: {
					text: "Cancelar",
					visible: true,
					className: "transparent"
				},
				confirm: {
					text: "OK",
					visible: true,
					className: "blue lighten-4 blue-text text-darken-4"
				}
			},
			dangerMode: true,
		});
		if (confirm) {
			if (anime.primeravez) anime.primeravez = false;
			if (this.isNoData(anime.repetir) || anime.repetir.length === 0) anime.repetir = [];
			anime.repetir.push({
				numrepeticion: anime.repetir.length,
				nrocapvisto: anime.nrocapvisto,
				estado: anime.estado,
				fechaCreacion: anime.fechaCreacion,
				fechaEstreno: anime.fechaEstreno,
				fechaUltCapVisto: anime.fechaUltCapVisto,
				fechaEliminacion: anime.fechaEliminacion,
				fechaRepeticion: new Date()
			});
			anime.nrocapvisto = 0;
			anime.estado = 0; // siempre activo
			anime.fechaCreacion = new Date();
			anime.fechaEstreno = null;
			anime.fechaUltCapVisto = null;
			anime.fechaEliminacion = null;
			anime.activo = true; // hay que restaurar el anime si esta eliminado
			//
			let numUpdate = await this.db.actualizarAnime(anime._id, anime);
			if (numUpdate > 0) {
				await swal({
					title: "Éxito",
					text: "Este mundo está lleno de infinitas posibilidades. Entre ellas, esta allí en alguna parte. ¡Así que encuéntrala! ¡Mira y mira otra vez! ¡Mil, diez mil, un millón de veces!",
					icon: "success",
					className: "success-swal"
				});
				this.recargarPagina();
			} else {
				await swal({
					title: "Error",
					text: "Houston, tenemos un problema.",
					icon: "info",
					className: "info-swal"
				});
			}
		} else {
			await swal({
				title: "¡Acción cancelada!",
				icon: "info",
				className: "info-swal"
			});
		}
	}
	_restoreRow(id) {
		swal({
			title: "¿Estás seguro?",
			text: "¡Volverá a aparecer en la lista de ver animes!",
			icon: "warning",
			buttons: ["Cancelar", "OK"],
			className: "warning-swal",
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					this.db.restaurarFila(id).then(async (resolve) => {
						if (resolve > 0) {
							await swal({
								title: 'Éxito',
								text: 'El anime ya vuelve a estar disponible.',
								icon: 'success',
								className: 'success-swal'
							});
							this.recargarPagina();
						} else {
							swal({
								title: 'Error',
								text: 'Tuvimos un pequeño problema al restaurar este anime. Tal vez si lo intentas más tarde...',
								icon: 'error',
								className: 'error-swal'
							});
						}
					});
				} else {
					swal({
						title: "¡Acción cancelada!",
						icon: "info",
						className: "info-swal"
					});
				}
			});
	}
	/**
	 * Borra el anime proporcionado. Antes hay una
	 * confirmación por modal, donde se puede cancelar.
	 */
	_deleteAnime(id) {
		swal({
			title: "¿Estás seguro?",
			text: "¡Una vez borrado, no vas a poder recuperarlo!",
			icon: "warning",
			className: "warning-swal",
			buttons: ["Cancelar", "OK"],
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					this.db.borrarAnime(id).then(async (resolve) => {
						if (resolve > 0) {
							await swal({
								title: 'Éxito',
								text: 'Toda posibilidad de recuperación se ha perdido.',
								icon: 'success',
								className: 'success-swal'
							});
							document.getElementById('return-history').click(); // aquí estoy aprovechandome del evento por defecto para regresar
						} else {
							swal({
								title: 'Error',
								text: 'Tuvimos un pequeño problema al borrar este anime. Tal vez si lo intentas más tarde...',
								icon: 'error',
								className: 'error-swal'
							});
						}
					});
				} else {
					swal({
						title: "¡Acción cancelada!",
						icon: "info",
						className: "info-swal"
					});
				}
			});
	}
	/**
	 * Genera el Chart de la línea de tiempo, dentro de
	 * la sección de información.
	 * @param {any} listaFil Lista de datos filtrada
	 * @param {string} tipo Tipo de Chart
	 * @param {string} title Título del Chart
	 */
	_chartLineaTiempo(listaFil, tipo, title) {
		let ctx = document.getElementById('lineatiempo')
		new Chart(ctx, {
			type: tipo,
			data: {
				labels: this._filterLabelChart(listaFil.labels),
				datasets: [{
					data: listaFil.data,
					backgroundColor: listaFil.backgroundColor,
					borderColor: listaFil.borderColor,
					fill: listaFil.fill
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: title
				},
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							callback: () => '' // esto solo quita los ticks de la izquierda
						}
					}]
				},
				tooltips: {
					callbacks: {
						label: (tooltipItem, data) => {
							let allData = data.datasets[tooltipItem.datasetIndex].data;
							let tooltipData = allData[tooltipItem.index];
							return this.isNoData(tooltipData.x) ? 'Desconocido' : `Fecha: ${this._setCalendarDate(tooltipData.x)}`;
						}
					}
				}
			}
		});
	}

	_chartCapVistos(listFilter, tipo, title) {
		let ctx = document.getElementById('capVistos')
		new Chart(ctx, {
			type: tipo,
			data: {
				labels: this._filterLabelChart(listFilter.nombres),
				datasets: [{
					data: listFilter.nroCap,
					backgroundColor: listFilter.colorTransparente,
					borderColor: listFilter.color,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							min: 0
						}
					}]
				},
				title: {
					display: true,
					text: title
				},
				legend: {
					display: false
				}
			}
		})
	}
	/**
	 * Crea un chart que muestra una comparativa de los capítulos restantes contra los totales.
	 * Si en esta comparativa son iguales o no hay totales solo se muestran los restantes.
	 * @param {{name: string[], datasets: {data: number[], backgroundColor: string}[]}} datasets Arrays de datos para mostrar.
	 * @param {string} name Nombre del anime.
	 * @param {string} title Titulo del chart.
	 */
	_chartCapResVistos(datasets, name, title) {
		let ctx = document.getElementById('capVistos')
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: this._filterLabelChart(name),
				datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true
					}]
				},
				title: {
					display: true,
					text: title
				},
				legend: {
					display: false
				}
			}
		})
	}
	/**
	 * Si el tamaño de un label es mayor a 40,
	 * lo corta para que no deforme la gráfica.
	 * @param {string[]} labels Labels de cada gráfica.
	 */
	_filterLabelChart(labels) {
		let newLabels = [];
		for (const label of labels) {
			if (label.length > 40) {
				newLabels.push(`${label.slice(0, 40).trim()}...`);
			} else {
				newLabels.push(label)
			}
		}
		return newLabels;
	}
	/**
	 * Carga un estadistica de las paginas donde 
	 * se descargan los animes.
	 */
	async paginasAnimesActivos() {
		let res = await this.db.buscarPaginas();
		if (res.length > 0) {
			let paginasFiltradas = this._filterPageActiveChart(res);
			let template = this._generatorTemplate(paginasFiltradas.nombres);
			this.menuRender(template);
			this._statisticsPagesSaw(paginasFiltradas);
			let instances = M.Collapsible.init(document.querySelectorAll('.collapsible'));
			instances[0].open(0);
		} else {
			this.paginaBlancoConImagen();
		}
	}

	async menuRender(menu) {
		var salidaMenu = '';
		for (const index1 in menu) {
			const value1 = menu[index1];
			salidaMenu += `<li>
			<div class="collapsible-header"><h5 class="no-margin">${this.firstUpperCase(index1)}</h5></div>`;
			if (value1 != null) {
				salidaMenu += `<div class="collapsible-body no-padding">
				<div class="collection">`;
			}
			for (const index2 in value1) {
				const value2 = value1[index2];
				salidaMenu += `<a `;
				for (const index3 in value2) {
					const value3 = value2[index3];
					salidaMenu += `${index3}="${value3}" `;
				}
				salidaMenu += `><span class="badge"></span>${this.firstUpperCase(index2)} </a>`;
			}
			if (value1 != null) {
				salidaMenu += `</div>
						  </div>`;
			}
			salidaMenu += `</li>`;
		}
		document.getElementById('menu').innerHTML = salidaMenu;
		this.noLink();
	}
	/**
	 * Genera la interfaz de la pagina 
	 * `Capítulos restantes`.
	 */
	async numCapRestantes() {
		let capRestantes = await this.db.animesCapsRestantes();
		if (capRestantes.length > 0) {
			let listFilter = this._filterCapResChart(capRestantes);
			this._chartCapVistos(listFilter, 'horizontalBar', 'Capítulos restantes');
		} else {
			this.paginaBlancoConImagen();
		}
	}

	_generatorTemplate(nombres, paginas) {
		let aux = {};
		let template = {};
		for (let key in nombres) {
			let subData = {};
			nombres[key].map((value, index) => {
				subData[value] = {
					'href': '#!',
					'class': 'collection-item no-link blue-text'
				}
				//console.log('subdata:', subData);
			});
			aux[nombres[key]] = subData;
			template[key] = aux[nombres[key]];
		}
		// console.log(template);
		return template;
	}

	_statisticsPagesSaw(listFiltered) {
		let ctx = document.getElementById('pagCapVistos');
		let capVistos = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: listFiltered.paginas,
				datasets: [{
					data: listFiltered.contador,
					backgroundColor: listFiltered.colorTransparente,
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'Páginas'
				},
				legend: {
					display: true
				},
				animation: {
					animateScale: true,
					animateRotate: true
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem, data) {
							let allData = data.datasets[tooltipItem.datasetIndex].data;
							let tooltipLabel = data.labels[tooltipItem.index];
							let tooltipData = allData[tooltipItem.index];
							let total = 0;
							for (let i in allData) {
								total += allData[i];
							}
							let tooltipPercentage = Math.round((tooltipData / total) * 100);
							return `${tooltipLabel} : ${tooltipData} (${tooltipPercentage}%)`;
						}
					}
				}
			}
		});
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{día} de {mes}, {año}`.
	 * @param {Date} date Fecha
	 */
	_setCalendarDate(date) {
		let year = date.getFullYear();
		let month = date.getMonth();
		let day = date.getDate();
		let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		return `${day} de ${months[month]}, ${year}`;
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{hora}:{minutos}`.
	 * @param {Date} date Fecha
	 */
	_setHourDate(date) {
		let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		return `${hour}:${minutes}`;
	}
	/**
	 * Convierte la fecha a el formato 
	 * `{día} de {mes}, {año} {hora}:{minutos}`.
	 * @param {Date} date Fecha
	 */
	_setFullDate(date) {
		return `${this._setCalendarDate(date)} ${this._setHourDate(date)}`;
	}

	_filterCapActiveChart(list) {
		let nombres = []
		let nroCap = []
		let colorTransparente = []
		let color = []
		list.forEach((value, i) => {
			if (list[i].estado === 0) { // estado 0 significa 'anime viendo'
				let colorRand = this._getColorRandom(0.4)
				let colorT = colorRand.replace('0.4', '1')
				nombres.push(list[i].nombre)
				nroCap.push(list[i].nrocapvisto)
				colorTransparente.push(colorRand)
				color.push(colorT)
			}
		});
		let data = {
			'nombres': nombres,
			'nroCap': nroCap,
			'colorTransparente': colorTransparente,
			'color': color
		}
		return data
	}
	/**
	 * Filtra los datos de un anime, creando una
	 * línea de tiempo.
	 * @param {any} anime Datos del anime.
	 */
	_filtroLineaTiempo(anime) {
		return {
			labels: [
				'Creación',
				'Estreno',
				'Últ Cap Visto',
				'Eliminación',
			],
			data: [
				{
					y: 1,
					x: anime.fechaCreacion
				},
				{
					y: 1,
					x: anime.fechaEstreno
				},
				{
					y: 1,
					x: anime.fechaUltCapVisto
				},
				{
					y: 1,
					x: anime.fechaEliminacion
				}
			],
			fill: false,
			backgroundColor: 'hsl(207, 69%, 58%)',
			borderColor: 'hsl(207, 69%, 58%)',
		};
	}
	/**
	 * Filtra los datos de un anime para crear un objeto que 
	 * posteriormente se usara en el método `_chartCapResVistos()`. 
	 * En este método se comparan el número de capítulos visto contra 
	 * los totales.
	 * @param {Anime} anime Datos del Anime
	 */
	_filterCapChart(anime) {
		let datasets = [
			{
				data: [anime.nrocapvisto],
				backgroundColor: 'hsl(207, 69%, 68%)',
			}
		];
		if ((!this.isNoData(anime.totalcap) || anime.totalcap > 0) && anime.totalcap !== anime.nrocapvisto && anime.totalcap - anime.nrocapvisto >= 0) {
			datasets.push({
				data: [anime.totalcap - anime.nrocapvisto],
				backgroundColor: 'hsl(230, 24%, 64%)',
			});
		}
		return {
			name: [anime.nombre],
			datasets
		};
	}

	_filterCapResChart(list) {
		let nombres = []
		let nroCap = []
		let colorTransparente = []
		let color = []
		list.forEach((value, i) => {
			if (list[i].estado == 0) { // estado 0 significa 'anime viendo'
				let colorRand = this._getColorRandom(0.4)
				let colorT = colorRand.replace('0.4', '1')
				let capRestantes = list[i].totalcap - list[i].nrocapvisto < 0 ? 0 : list[i].totalcap - list[i].nrocapvisto;
				nombres.push(list[i].nombre)
				nroCap.push(capRestantes)
				colorTransparente.push(colorRand)
				color.push(colorT)
			}
		});
		let data = {
			'nombres': nombres,
			'nroCap': nroCap,
			'colorTransparente': colorTransparente,
			'color': color
		}
		return data;
	}

	_filterPageActiveChart(data) {
		let pages = [];
		let count = [];
		let nombres = [];
		let contador = [];
		let paginas = [];
		let colorTransparente = [];
		data.map((value, index) => {
			let url = document.createElement('a');
			url.href = value.pagina;
			let hostname = url.hostname === "" ? "otros" : url.hostname;
			pages[hostname] = hostname;
			nombres[hostname] += [',' + value.nombre];
			nombres[hostname] = nombres[hostname].split(',');
			count[hostname] = (count[hostname] || 0) + 1;
		});
		for (let value in nombres) {
			nombres[value] = nombres[value].slice(1, nombres[value].length);
		}

		for (let value in pages) {
			paginas.push(value);
		}
		for (let value in count) {
			contador.push(count[value]);
			let colorRand = this._getColorRandom(0.8);
			colorTransparente.push(colorRand);
		}

		return {
			'paginas': paginas,
			'contador': contador,
			'colorTransparente': colorTransparente,
			'nombres': nombres
		}
	}

	_getColorRandom(transparent) {
		return `rgba(${this._getRandom()}, ${this._getRandom()}, ${this._getRandom()}, ${transparent})`;
	}

	_getRandom() {
		return Math.abs(Math.round(Math.random() * 255) - Math.round(Math.random() * 85));
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
	async _isDefaultImage(pathImage) {
		// no se puede usar path.normalize() porque background-url no le acepta con un solo backslash (windows format)
		let pathRes = null;
		if (this.isNoData(pathImage) || pathImage === "") {
			return true;
		}
		if (this.isUrl(pathImage)) {
			let urlExists = this.urlExists(pathImage);
			if (urlExists) {
				pathRes = false;
			} else {
				pathRes = true;
			}
		} else {
			try {
				if (fs.existsSync(pathImage)) {
					pathRes = false;
				} else {
					pathRes = true;
				}
			} catch (err) {
				pathRes = true;
			}
		}
		return pathRes;
	}
}

exports.Historial = Historial;