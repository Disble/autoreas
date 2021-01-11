const { shell } = require('electron');
const { Anime } = require('./Anime.js');
const { Pendiente } = require('./Pendiente.js');
const { ModelAnime } = require('./ModelAnime.js');
const { ModelPendiente } = require('./ModelPendiente.js');
const { RenderBase } = require('./RenderBase.js');
const Sortable = require('sortablejs');
const { Days, Tipos } = require('./defaults-config.js');
const settings = require('electron-settings');


class RenderPendiente extends RenderBase {
	constructor() {
		super();
		this.model = new ModelPendiente();
		this.modelAnime = new ModelAnime();
	}
	/**
	 * Obtiene todos los `pendientes` activos y los 
	 * carga en una interfaz en la página `ver pendientes`.
	 */
	async getAllData() {
		let res = await this.model.getAllActive();
		if (res.length === 0) {
			this.containerBlancoConImagen('container-pendientes', 'Tree_swing.svg');
			return;
		}
		let data = '';
		let diasSettings = settings.get('days', Days);
		res.map((value, index) => {
			data += /*html*/`<li id="item-list">
			<div class="collapsible-header">
				<i class="icon-menu left icon-pag btn-sortable"></i>
				<span class="text-icon">${value.nombre}
				<a href="#!" class="secondary-content right">
				<i class="icon-ok-squared grey-text hover-icon-complete js-remove tooltipped" data-position="right" data-tooltip="¡Completar!"></i>
				</a>
				</span>
			</div>
			<div class="collapsible-body">
				<span><b>Detalle</b></span>
				<p>${value.detalle}</p>
				<div class="divider"></div>
				<p><b>Pagina : </b>${this._paginaConstructor(value.pagina)}</p>
				<span class="hidden" id="key">${value._id}</span>
				<div class="divider"></div>
				<a class="modal-trigger" href="#modal${index}"><i class="icon-fork deep-orange-text icon-big hover-icon-complete btn-forking-anime tooltipped disabled" data-position="right" data-tooltip="¡Crear anime a partir de pendiente!"></i></a>
				<!-- Modal Structure -->
				<div id="modal${index}" class="modal modal-fixed-footer">
					<form class="form-form-anime">
					<div class="modal-content">
						<h4 class="center">Crear nuevo Anime</h4>
						<div class="row no-margin">
							<div class="col s12">
								<div class="input-field">
									<input id="nombre" value="${value.nombre}" type="text" name="nombre" class="validate">
								</div>
								<div class="input-field">
									<select name="dia">`;
			for (const tipoDia of diasSettings) {
				let outgroup = document.createElement('optgroup');
				outgroup.label = this.firstUpperCase(tipoDia.title);
				for (const dia of tipoDia.data) {
					let opcion = document.createElement('option');
					opcion.value = dia.name;
					opcion.innerText = this.firstUpperCase(dia.name === dia.alternative ? dia.name : dia.alternative);
					outgroup.appendChild(opcion);
				}
				data += outgroup.outerHTML;
			}
			data +=			/*html*/`</select>
								</div>
								<div class="input-field">
									<select name="tipo">`;
			for (const tipo in Tipos) {
				const valor = Tipos[tipo];
				let opcion = document.createElement('option');
				opcion.value = valor;
				opcion.innerText = tipo;
				data += opcion.outerHTML;
			}
			data += 		/*html*/`</select>
								</div>
								<div class="input-field">
								<input type="text" id="pagina" name="pagina" value="${value.pagina}"  class="validate">
								<label for="pagina">Pagina (No obligatorio)</label>
								</div>
								<div class="row no-margin">
									<div class="input-field col s4 no-margin">
										<input type="number" name="orden" id="orden" min="1" class="validate">
										<label for="orden">Orden</label>
									</div>
									<div class="input-field col s4 no-margin">
										<input type="number" name="totalcap" id="totalcap" min="0" class="validate">
										<label for="totalcap">Total Cap (No obligatorio)</label>
									</div>
									<div class="col s2 push-s1">
										<input type="file" name="carpeta" id="file${index}" class="inputfile" webkitdirectory />
										<label for="file${index}" class="tooltipped blue lighten-4 blue-text text-darken-4" data-position="bottom" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<input type="submit" class="waves-effect btn-flat green-text" value="crear">
						<a href="#!" class="modal-action modal-close waves-effect btn-flat red-text">Cancelar</a>
					</div>
				</form>
				</div>
			</div>
			</li>`;
		});
		document.getElementById('data-pendientes').innerHTML = data;
		M.Collapsible.init(document.querySelectorAll('.collapsible'));
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			enterDelay: 350
		});
		M.Modal.init(document.querySelectorAll('.modal'));
		this._forkToAnimeOpen();
		M.FormSelect.init(document.querySelectorAll('select'));
		M.updateTextFields();
		this._urlExternal();
		document.querySelectorAll('.inputfile').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this.getFolder(value);
			});
		});
		this.elementsPen = document.getElementById('data-pendientes').querySelectorAll('li#item-list');
	}

	_forkToAnimeOpen() {
		document.querySelectorAll('.form-form-anime').forEach(value => {
			value.addEventListener('submit', e => {
				e.preventDefault();
				let form = new FormData(value);

				if (form.get('nombre').length === 0 || form.get('dia') === null || form.get('orden').length === 0 || form.get('tipo') === null) {
					swal({
						title: "¡Opss!",
						text: "Necesitamos más datos para crearlo.",
						icon: "warning",
						className: "warning-swal"
					});
					return false;
				}

				let container = value.parentElement.parentElement.parentElement;
				let nombre = form.get('nombre').trim();
				let dia = form.get('dia').trim();
				let tipo = parseInt(form.get('tipo'));
				let orden = parseInt(form.get('orden'));
				let pagina = form.get('pagina') == "" ? "No Asignada" : form.get('pagina').trim();
				let carpeta = value.querySelector('input[type=file]').getAttribute('value');
				let totalcap = parseInt(form.get('totalcap'));

				let anime = new Anime(nombre, [{ dia, orden }], 0, totalcap, tipo, pagina, carpeta, null, '', null, null, { type: 'url', path: '' }, 0, [], true, true, null, null, new Date(), null, null);

				this.modelAnime.new(anime)
					.then(async (resolve) => {
						swal({
							title: "¡Anime creado!",
							text: "¿Deseas borrar el pendiente?",
							icon: "success",
							buttons: ["NO", "SI"],
							dangerMode: true,
							className: "success-swal"
						})
							.then(async (willDelete) => {
								if (willDelete) {
									this._setOffPendiente(container);
									swal({
										title: "¡Pendiente borrado!",
										text: "",
										icon: "success",
										className: "success-swal"
									});
									this.recargarPagina();
								} else {
									swal({
										title: "No hay problema",
										text: "Este pendiente se mantendra en la lista.",
										icon: "success",
										className: "success-swal"
									});
									this.recargarPagina();
								}
							});
					})
					.catch((err) => {
						console.error(err);
						swal({
							title: "¡Opss!",
							text: `Tuvimos problemas creando "${nombre}".\nPor favor vuelva a intentarlo.`,
							icon: "error",
							className: "error-swal"
						});
					});
			});
		});
	}

	_setDataPendiente() {
		this.model.getMaxOrder()
			.then((resolve) => {
				let orden = resolve + 1;
				let nombre = document.getElementById('nombre');
				let pagina = document.getElementById('pagina');
				let detalles = document.getElementById('detalles');
				//
				let pendiente = new Pendiente(nombre.value, detalles.value, orden, pagina.value);
				this.model.new(pendiente)
					.then((resolve) => {
						if (resolve) {
							M.toast({
								html: 'Datos Ingresados Correctamente',
								displayLength: 4000
							});
							nombre.value = '';
							pagina.value = '';
							detalles.value = '';
						} else {
							M.toast({
								html: 'Houston, tenemos un problema',
								displayLength: 4000
							});
						}
					})
					.catch((err) => { return console.error(err) });
			})
			.catch((err) => { return console.error(err) });;
	}

	_setSubmitNew() {
		document.getElementById('submitPendiente').addEventListener('submit', e => {
			e.preventDefault();
			e.stopPropagation();
			this._setDataPendiente();
			return false;
		});
	}

	async _setOrderView() {
		let allPenElemModificados = document.getElementById('data-pendientes').querySelectorAll('li#item-list');
		let allPendientes = await this._reorderOrderDatabase(allPenElemModificados);
		this._setNewOrder(allPendientes);
	}

	async _setOrderEdit() {
		let allPenElemModificados = document.getElementById('edit-pen').querySelectorAll('li');
		let allPendientes = await this._reorderOrderDatabase(allPenElemModificados);
		this._setNewOrder(allPendientes);
	}

	async _setNewOrder(allPendientes) {
		for (const i in allPendientes) {
			this.model.update(allPendientes[i]._id, allPendientes[i]);
		}
	}

	async _reorderOrderDatabase(allPenElemModificados) {
		let allPendientes = [];
		let allOrders = [];
		// Aqui estamos recorriendo los elementos originales, antes de moverlos
		for (const elem of this.elementsPen) {
			let key = elem.querySelector('#key').innerHTML;
			let pendiente = await this.model.getOnce(key); // consegimos los pendiente de la BDD
			allOrders.push(pendiente.orden); // Guardamos todos los orden de los elementos originales
		}

		// Aqui estamos recorriendo los elementos modificados, los que ya movimos
		for (const elem of allPenElemModificados) {
			let key = elem.querySelector('#key').innerHTML;
			let pendiente = await this.model.getOnce(key); // consegimos los pendiente de la BDD
			allPendientes.push(pendiente); // Guardamos los objetos pendiente de la vista modificada
		}

		/**
		 * Aqui reemplazamos los valores de orden originales
		 * en los nuevos elementos. Asi se mantiene el mismo
		 * orden pero con otros elementos.
		 */
		for (const key in allPendientes) {
			allPendientes[key].orden = allOrders[key];
		}

		/**
		 * Aqui estamos guardando los elementos modificados 
		 * para que la siguiente iteración los tome como los originales.
		 */
		this.elementsPen = allPenElemModificados;

		return allPendientes;
	}

	_setOffPendiente(item) {
		let id = item.querySelector('#key').innerHTML;
		this.model.activeOff(id)
			.then((resolve) => {
				if (resolve) {
					this.elementsPen = document.getElementById('data-pendientes').querySelectorAll('li#item-list');
					M.toast({
						html: 'Marcado como completado correctamente',
						displayLength: 4000
					});
				} else {
					M.toast({
						html: 'Houston, tenemos un problema',
						displayLength: 4000
					});
				}
			})
			.catch((err) => { return console.error(err) });
	}

	setDragDrop() {
		let el = document.getElementById('data-pendientes');
		let sortable = Sortable.create(el, {
			handle: '.btn-sortable',
			animation: 150,
			onUpdate: (evt) => {
				this._setOrderView(evt.oldIndex, evt.newIndex);
			},
			filter: '.js-remove',
			onFilter: (evt) => {
				swal({
					title: "¿Estás seguro?",
					text: "¡Si lo marcas como completado, se borrara de esta lista!",
					icon: "info",
					buttons: ["NO", "SI"],
					dangerMode: true,
					className: "info-swal"
				})
					.then((willDelete) => {
						if (willDelete) {
							let el = sortable.closest(evt.item);
							el && el.parentNode.removeChild(el);
							this._setOffPendiente(evt.item);
						} else {
							swal({
								title: "¡Acción cancelada!",
								text: "",
								icon: "info",
								className: "info-swal"
							});
						}
					});
			}
		});
	}
	/**
	 * Obtiene todos los pendientes activos y los 
	 * carga en una interfaz en la página `editar pendientes`.
	 */
	async _setEdit() {
		let res = await this.model.getAllActive();
		if (res.length === 0) {
			this.containerBlancoConImagen('container-editar-pendiente', 'before_dawn.svg');
			return;
		}
		let data = '';
		res.map((value) => {
			data += /*html*/`
				<li>
					<div class="row border-bottom mb-0 flex">
						<div class="col s1 border-left border-right flex flex-y-center"><span class="hidden" id="key">${value._id}</span><i class="icon-menu left icon-pag btn-sortable"></i></div>
						<div class="col s3 border-right flex flex-y-center editable-pen mh-small" id="nombre">${value.nombre}</div>
						<div class="col s4 border-right flex flex-y-center editable-pen mh-small" id="detalle">${value.detalle}</div>
						<div class="col s4 border-right flex flex-y-center overflow-a editable-pen mh-small" id="pagina">${value.pagina}</div>
					</div>
				</li> 
			`;
		});
		document.getElementById('edit-pen').innerHTML = data;
		this._setReorderEditPen();
		this._cellEdit();
		this.elementsPen = document.getElementById('edit-pen').querySelectorAll('li');
	}

	_cellEdit() {
		document.querySelectorAll('.editable-pen').forEach(value => {
			value.addEventListener('dblclick', e => {
				value.setAttribute('contenteditable', 'true');
				value.focus();
			});
			value.addEventListener('focusout', e => {
				value.removeAttribute('contenteditable');
				let nombre = value.parentElement.parentElement.querySelector('#nombre').innerText;
				let detalle = value.parentElement.parentElement.querySelector('#detalle').innerText;
				let pagina = value.parentElement.parentElement.querySelector('#pagina').innerText;
				let key = value.parentElement.parentElement.querySelector('#key').innerText;
				this.model
					.getOnce(key)
					.then((resolve) => {
						resolve.nombre = nombre;
						resolve.detalle = detalle;
						resolve.pagina = pagina;
						return resolve;
					})
					.then((resolve) => {
						this.model.update(key, resolve);
					})
					.catch((err) => { return console.error(err.message) });
			});
			value.addEventListener('keypress', e => {
				if (e.keyCode == 13) {
					let event = document.createEvent('HTMLEvents');
					event.initEvent('focusout', true, false);
					value.dispatchEvent(event)
				}
			});
		});
	}

	_setReorderEditPen() {
		Sortable.create(document.getElementById('edit-pen'), {
			handle: '.btn-sortable',
			animation: 150,
			onUpdate: (evt) => {
				this._setOrderEdit(evt.oldIndex, evt.newIndex);
			}
		});
	}

	_paginaConstructor(pagina) {
		if (this.isUrl(pagina))
			return this._redirectExternalConstructor(pagina);
		else
			return pagina;
	}

	_redirectExternalConstructor(path) {
		let url = document.createElement('a');
		url.href = path;
		url.innerText = url.href;
		url.setAttribute('class', 'url-external');
		return url.outerHTML;
	}

	_urlExternal() {
		document.querySelectorAll('.url-external').forEach(value => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				if (!shell.openExternal(value.href)) {
					swal({
						title: "Hubo problemas al abrir la url.",
						text: "Por favor revise el formato de la url en Editar Animes.",
						icon: "error",
						className: "error-swal"
					});
				}
			});
		});
	}
}

exports.RenderPendiente = RenderPendiente;