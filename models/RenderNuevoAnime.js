'use strict'
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const { Days, Tipos } = require('./defaults-config.js');
const settings = require('electron-settings');
const { Anime } = require('./Anime');

/**
 * Clase que se encarga del renderizado de la
 * vista `Agregar Animes`.
 */
class RenderNuevoAnime extends RenderBase {
	/**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
	constructor() {
		super();
		this.db = new BDAnimes();
		this.contNewFolder = 0;
	}
	/*------------------------- RENDER DINAMICO ---------------------------------------*/
	/**
	 * Agrega una nueva fila al formulario
	 * de la página Agregar Animes.
	 */
	increNuevosAnimes() {
		this.contNewFolder++;
		let nuevaConsulta = /*html*/ `<tr class="datos-anime-nuevo" id="anime-${this.contNewFolder}">
			<td><input type="text" name="nombre" class="validate" required></td>
			<td>
				<div class="input-field days">
					<!-- Dropdown Trigger -->
					<a class='dropdown-trigger btn btn-block dropdown-dias z-depth-0 wrap-one-line' href='#'
						data-target='dropdown-dias${this.contNewFolder}' 
						dropdown-dias="drop-anime-${this.contNewFolder}">
						<span autoreas-droptext="dropdown-dias-text-${this.contNewFolder}"
							class="dropdown-dias-text">Días</span>
						<span class="right">
							<svg class="caret" height="24" viewBox="0 0 24 24" width="24"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M7 10l5 5 5-5z"></path>
								<path d="M0 0h24v24H0z" fill="none"></path>
							</svg>
						</span>
					</a>
					<!-- Dropdown Structure -->
					<ul id='dropdown-dias${this.contNewFolder}' 
						autoreas-dropdias="drop-anime-${this.contNewFolder}" 
						class='dropdown-content days'>
					</ul>
				</div>
			</td>
			<td>
				<div class="input-field">
					<select name="tipo" class="validate" required>`;
		for (const tipo in Tipos) { // Tipos viene desde el import
			const valor = Tipos[tipo];
			let opcion = document.createElement('option');
			opcion.value = valor;
			opcion.innerText = tipo;
			nuevaConsulta += opcion.outerHTML;
		}
		nuevaConsulta +=/*html*/`
					</select>
				</div>
			</td>
			<td><input type="text" name="pagina" class="validate" required></td>
			<td>
				<input type="file" name="carpeta" id="file${this.contNewFolder}" class="inputfile btn-carpeta-buscar" webkitdirectory />
				<label for="file${this.contNewFolder}" class="tooltipped blue lighten-4 blue-text text-darken-4" data-position="bottom" data-tooltip="Este campo no es obligatorio">Escoja una carpeta</label>
			</td>
			<td>
				<a class="modal-trigger icon-big black-text" href="#modal${this.contNewFolder}"><i class="material-icons icon-dot-3 flex flex-x-center"></i></a>
				<div id="modal${this.contNewFolder}" class="modal bottom-sheet">
					<div class="modal-content left-align">
						<h5 class="mb-20">Datos opcionales</h5>
						<div class="row no-margin">
							<div class="input-field col s4">
								<input value="0" id="nrocapvisto" name="nrocapvisto" type="number" min="0"
									class="validate this-not">
								<label for="nrocapvisto">Número capítulos vistos</label>
							</div>
							<div class="input-field col s4">
								<input type="number" id="totalcap" name="totalcap" min="0"
									class="tooltipped validate this-not" data-position="bottom"
									data-delay="50" data-tooltip="Este campo no es obligatorio">
								<label for="totalcap">Total de capítulos</label>
							</div>
							<div class="input-field col s4">
								<input type="number" class="this-not" name="duracion"
									id="duracion">
								<label for="duracion">Duración (min)</label>
							</div>
						</div>
						<div class="row">
							<div class="col s12">
								<p class="portada grey-text">Portada</p>
								<select id="cambiar-tipo-imagen">
									<option value="imagen">Imagen</option>
									<option value="url">URL</option>
								</select>
								<label for="cambiar-tipo-imagen">Seleccionar portada</label>
							</div>
							<div class="file-field input-field col s12" id="cambiar-portada">
								<div class="btn btn-small blue lighten-5 blue-text text-darken-4 z-depth-0" id="cambiar-portada-input">
									<span><i class="material-icons icon-picture"></i></span>
									<input type="file" id="portada-input" name="portadainput"
										accept="image/*">
								</div>
								<div class="file-path-wrapper">
									<input class="file-path" type="text" name="portada" id="portada">
								</div>
							</div>
						</div>
						<h5>
							Remover fila
							<a class="right waves-effect waves-light btn red" id="btn-borrar-fila"><i class="icon-trash-empty material-icons right"></i>Eliminar</a>
						</h5>
						<p class="grey-text text-darken-2">Se removerá esta fila junto con sus datos.</p>
					</div>
				</div>
			</td>
		</tr>`;
		document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.insertAdjacentHTML('beforebegin', nuevaConsulta);
		let filaNueva = document.getElementById('agregarNuevoAnime').parentElement.parentElement.parentElement.previousElementSibling;

		filaNueva.querySelectorAll('.btn-carpeta-buscar').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this.getFolder(value);
			})
		});
		let dropdownDias = filaNueva.querySelector(`#dropdown-dias${this.contNewFolder}`);
		this._crearDropdownDias(dropdownDias);
		this._initDropdownDias(dropdownDias);
		this._initInputPortada(filaNueva);
		filaNueva.querySelectorAll('#btn-borrar-fila')[0].addEventListener('click', this.eliminarFila(filaNueva))
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Modal.init(document.querySelectorAll('.modal'), {
			preventScrolling: false
		});
		M.updateTextFields();
		this._fixSelectForm();
		this._fixSelectValidationLine();
		this._initSelectPortada(filaNueva); // Evento change para select de portada.
	}
	/**
	 * Inicializa el HTML y JavaScript
	 * de la página Agregar Animes
	 */
	initAgregarAnime() {
		let tiposSelect = document.getElementById('tipo');
		let dropdownDias = document.getElementById('dropdown-dias');
		this._crearDropdownDias(dropdownDias);
		for (const tipo in Tipos) {
			let opcion = document.createElement('option');
			opcion.value = Tipos[tipo];
			opcion.innerText = this.firstUpperCase(tipo);
			tiposSelect.appendChild(opcion);
		}
		this._initDropdownDias();														// carga el js de la nueva estructura dropdown-dias
		document.getElementById('agregarNuevoAnime').addEventListener('click', e => {
			this.increNuevosAnimes();
		});
		document.getElementById('nuevaListaAnimes').addEventListener('submit', async e => {
			e.preventDefault();
			e.stopPropagation();

			let validacion = this._validarDropdownDias();
			if (!validacion) return false;
			let anime = this.crearAnime();
			let resp = await this.db.crearAnime(anime);
			if (resp.length > 0) {
				e.target.reset();
				document.querySelectorAll('tr[id^="anime-"]').forEach((el, index) => {
					if (index !== 0) {
						el.parentNode.removeChild(el);
					}
				});
				document.querySelector(`.datos-anime-nuevo [data-target*="dropdown-dias"]`).classList.remove('blue');
				this._crearDropdownDias(dropdownDias);
				this._initDropdownDias(dropdownDias);
			}
		});
		document.getElementById('btn-borrar-fila').addEventListener('click', this.eliminarFila(document.getElementById('anime-0')));
		document.querySelectorAll('#file').forEach((value) => {
			value.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this.getFolder(value);
			})
		});
		this._initInputPortada();
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			exitDelay: 50
		});
		M.FormSelect.init(document.querySelectorAll('select'));
		M.Modal.init(document.querySelectorAll('.modal'), {
			preventScrolling: false
		});
		this._initSelectPortada(); // Evento change para select de portada.
		this._fixSelectForm();
		this._fixSelectValidationLine();
	}
	/**
	 * Inicializa el input tipo `file` para que cuando
	 * registre un archivo este guarde la dirección 
	 * real (y no la `fakepath`) en el `value`.
	 * @param {HTMLElement} el Elemento HTML
	 */
	_initInputPortada(el = document) {
		el.querySelectorAll('#portada-input').forEach((input) => {
			input.addEventListener('change', e => {
				if (this.isNoData(input) || input.files[0] === undefined)
					return;
				let folder = input.files[0].path;
				let path = this.slashFolder(folder);
				input.setAttribute('value', path);
			});
		});
	}
	/**
	 * Evento `change` para `select` de portada.
	 * @param {HTMLElement} el Elemento HTML
	 */
	_initSelectPortada(el = document) {
		let cambiarTipoImagen = el.querySelector('#cambiar-tipo-imagen');
		cambiarTipoImagen.addEventListener('change', (e) => {
			let portadaInput = el.querySelector('#cambiar-portada');
			if (cambiarTipoImagen.value === 'url') {
				portadaInput.classList.remove('file-field');
				portadaInput.innerHTML = /*html*/ `
                    <input id="portada" name="portada" type="url">
                    <label for="portada">Portada</label>
                `;
			}
			else if (cambiarTipoImagen.value === 'imagen') {
				portadaInput.classList.add('file-field');
				portadaInput.innerHTML = /*html*/ `
				<div class="btn btn-small blue" id="cambiar-portada-input">
					<span><i class="material-icons icon-picture"></i></span>
					<input type="file" id="portada-input" name="portadainput"
						accept="image/*">
				</div>
				<div class="file-path-wrapper">
					<input class="file-path" type="text" name="portada" id="portada">
				</div>
				`;
				this._initInputPortada(portadaInput);
			}
		});
	}

	/**
	 * Inicializa los elementos de una estructura dropdown-dias para
	 * que se despliegue y cuándo se haga clic en un `check` este 
	 * active el `input` de `orden` respectivos.
	 * @param {HTMLElement} el Elemento dropdown-dias que va a ser inicializado.
	 */
	_initDropdownDias(el = document) {
		/**
         * INICIA DROPDOWN DIAS
         */
		M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
			closeOnClick: false,
			coverTrigger: false,
			onCloseStart(el) {
				let dropdownId = el.getAttribute('dropdown-dias');
				let dropdownText = el.querySelector('[autoreas-droptext^=dropdown-dias-text]');
				let dropdownContainer = document.querySelector(`[autoreas-dropdias="${dropdownId}"]`);
				let days = dropdownContainer.querySelectorAll('#dia:not(.hide)');
				let orders = dropdownContainer.querySelectorAll('#orden');
				let selectDropdownDaysText = '';
				for (const i in days) {
					if (days.hasOwnProperty(i)) {
						const day = days[i];
						const order = orders[i];
						if (order.value.length > 0) {
							selectDropdownDaysText += selectDropdownDaysText.length === 0 ? `${day.value}, ${order.value}` : `; ${day.value}, ${order.value}`;     // guarda el día y orden para mostrarlo con el select cerrado
						}
					}
				}
				if (selectDropdownDaysText.length === 0) selectDropdownDaysText = 'Días';
				dropdownText.innerText = selectDropdownDaysText;
			}
		});
		/**
         * FIN DROPDOWN DIAS
         */
		el.querySelectorAll('#check-day').forEach((value) => {
			if (value.checked) { // Los que ya esten `checked` se activan directamente.
				let li = value.parentElement.parentElement;
				li.querySelector('#orden').removeAttribute('readonly');
			}
			value.addEventListener('change', () => {
				if (value.checked) {
					let li = value.parentElement.parentElement;
					li.querySelector('#orden').removeAttribute('readonly'); // Quita el modo solo lectura del input.
				}
				else {
					let li = value.parentElement.parentElement;
					let orden = li.querySelector('#orden');
					orden.value = ''; // Quita el valor para evitar confusiones.
					orden.setAttribute('readonly', '');
				}
			});
		});
	}

	/**
	 * Crea la estructura HTML de un estructura dropdown-dias.
	 * @param {HTMLElement} dropdownDias Elemento donde se va a inyectar el código HTML.
	 */
	_crearDropdownDias(dropdownDias) {
		dropdownDias.innerHTML = ''; // esta línea es para después de cuando se resetea el formulario.
		let diasSettings = settings.get('days', Days);
		for (const tipoDia of diasSettings) { // Días viene desde el import
			let li = document.createElement('li');
			li.classList.add('row');
			let h5 = document.createElement('h5');
			h5.classList.add('col', 's12', 'grey-text');
			h5.innerText = tipoDia.title;
			li.appendChild(h5);
			dropdownDias.appendChild(li);
			for (const dia of tipoDia.data) {
				let li = document.createElement('li');
				li.classList.add('row');
				let label = document.createElement('label');
				label.classList.add('col', 's2'); // se adapto esta línea
				label.innerHTML = `<input type="checkbox" id="check-day" /><span></span>`;
				li.appendChild(label);
				let inputDia = document.createElement('input');
				let inputOrden = document.createElement('input');
				let inputVerDia = document.createElement('input');
				//
				inputDia.value = dia.name;
				inputDia.type = 'text';
				inputDia.id = 'dia';
				inputDia.classList.add('hide');
				inputDia.readOnly = inputOrden.readOnly = true;
				//
				inputOrden.type = 'number';
				inputOrden.id = 'orden';
				inputOrden.min = 1;
				inputOrden.placeholder = 'Orden';
				inputOrden.classList.add('col', 's4', 'this-not'); // se adapto esta línea
				//
				inputVerDia.value = dia.name === dia.alternative ? dia.name : dia.alternative;
				inputVerDia.type = 'text';
				inputVerDia.id = 'dia';
				inputVerDia.classList.add('col', 's6', 'no-underline');
				inputVerDia.readOnly = inputOrden.readOnly = true;
				li.appendChild(inputDia);
				li.appendChild(inputVerDia);
				li.appendChild(inputOrden);
				dropdownDias.appendChild(li);
			}
		}
	}

	/**
	 * Borra la fila actual junto con todos
	 * sus datos.
	 * @param {Event} e Evento del botón
	 * @param {HTMLElement} el Elemento 
	 */
	eliminarFila(el) {
		return async e => {
			let confirm = await swal({
				title: "¿Estás seguro?",
				text: `Se perderan todos los datos ingresados.`,
				icon: "warning",
				buttons: ["No", "Si"],
				dangerMode: true,
				className: "warning-swal"
			});
			if (!confirm) return;
			el.parentNode.removeChild(el);
			await swal({
				title: "Éxito",
				text: "Toda posibilidad de recuperación se ha perdido.",
				icon: "success",
				className: "success-swal"
			});
		}
	}
	/**
	 * Captura todos los campos del formulario
	 * y genera un objeto javascript con ellos.
	 */
	crearAnime() {
		let cont = 0; // este contador es para el dropdown-dias de cada fila
		let listaEnviar = [];
		let nuevosAnimes = document.querySelectorAll('tr[class*="datos-anime-nuevo"]');
		for (const nuevoAnime of nuevosAnimes) {
			let anime = {};
			let inputs = nuevoAnime.querySelectorAll('input[type]:not(.select-dropdown)');
			let tipo = parseInt(nuevoAnime.querySelector('select[name="tipo"]').value);

			let diasVerificados = nuevoAnime.querySelector(`#dropdown-dias${cont === 0 ? '' : cont}`).querySelectorAll('#check-day:checked');
			let dias = [];
			// tomar en cuenta que si orden o día estan vacios pasa al siguiente sin más.
			for (const diaVerificado of diasVerificados) {
				let li = diaVerificado.parentElement.parentElement; // Llegamos a la fila
				let dia = li.querySelector('#dia').value;
				let orden = parseInt(li.querySelector('#orden').value);
				if (orden === '') continue;
				dias.push({
					dia,
					orden
				});
			}

			for (const input of inputs) {
				const valor = input.value;
				let llave = input.getAttribute('name');
				if (llave === "orden" || llave === "nrocapvisto" || llave === "totalcap" || llave === "tipo" || llave === "duracion") {
					anime[llave] = parseInt(valor);
				} else if (llave === 'carpeta' || llave === 'portadainput') {
					anime[llave] = input.getAttribute('value');
				} else {
					anime[llave] = valor.trim();
				}
				// console.log(anime);
			}
			// datos antiguos
			anime.tipo = tipo;
			anime.estado = 0;
			anime.activo = true;
			anime.fechaCreacion = new Date();
			anime.nrocapvisto = isNaN(anime.nrocapvisto) ? 0 : anime.nrocapvisto;
			// datos nuevos
			anime.dias = dias;
			anime.estudios = null;
			anime.origen = '';
			anime.generos = null;
			anime.duracion = isNaN(anime.duracion) ? null : anime.duracion;
			anime.portada = {
				type: this.isNoData(anime.portadainput) ? 'url' : 'image',
				path: anime.portadainput || anime.portada
			};
			anime.repetir = [];
			anime.primeravez = true;
			anime.fechaPublicacion = null;
			anime.fechaEstreno = null;
			anime.fechaUltCapVisto = null;
			anime.fechaEliminacion = null;

			let newAnime = new Anime(anime.nombre, anime.dias, anime.nrocapvisto, anime.totalcap, anime.tipo, anime.pagina, anime.carpeta, anime.estudios, anime.origen, anime.generos, anime.duracion, anime.portada, anime.estado, anime.repetir, anime.activo, anime.primeravez, anime.fechaPublicacion, anime.fechaEstreno, anime.fechaCreacion, anime.fechaUltCapVisto, anime.fechaEliminacion);

			listaEnviar.push(newAnime);
			cont++;
		}
		// console.log(listaEnviar);
		return listaEnviar;
	}
	/**
	 * Valida que el dropdown-dias tenga al menos una fila llena, 
	 * si no esta llena se vuelve rojo, caso contrario, azul.
	 */
	_validarDropdownDias() {
		let validado = true;
		let cont = 0;
		let nuevosAnimes = document.querySelectorAll('tr[class*="datos-anime-nuevo"]');

		for (const nuevoAnime of nuevosAnimes) {
			let diasVerificados = nuevoAnime.querySelector(`#dropdown-dias${cont === 0 ? '' : cont}`).querySelectorAll('#check-day:checked');
			let dropdownDias = nuevoAnime.querySelector(`[data-target*="dropdown-dias${cont === 0 ? '' : cont}"]`);
			let noError = true; // es para regresar al color original
			if (diasVerificados.length === 0) { // En caso de estar vacio se marca como invalido.
				dropdownDias.classList.remove('blue');
				dropdownDias.classList.add('red');
				validado = false;
				noError = false;
			}
			for (const diaVerificado of diasVerificados) {
				let li = diaVerificado.parentElement.parentElement; // Llegamos a la fila
				let orden = li.querySelector('#orden').value;
				if (orden === '') {
					dropdownDias.classList.remove('blue');
					dropdownDias.classList.add('red');
					validado = false;
					noError = false;
					continue;
				}
			}
			if (noError) {
				dropdownDias.classList.remove('red');
				dropdownDias.classList.add('blue');
			}
			cont++; // este contador es para el dropdown-dias de cada fila
		}
		return validado;
	}
	/**
	 * Arregla el bug de validación de los select
	 * de Materialize-css.
	 */
	_fixSelectValidation() {
		this._fixSelectForm();
		/**
		 * Este addEventListener() es porque la validación del select
		 * de materialize no funciona, y este es un fix para eso.
		 */
		document.querySelectorAll('button[type="submit"]').forEach((button) => {
			button.addEventListener('click', () => {
				document.querySelectorAll('select').forEach((select) => {
					let label = select.parentNode.nextElementSibling;
					if (select.value === "") {
						let error = label.getAttribute('data-error');
						label.setAttribute('data-value', error);
					} else {
						label.setAttribute('data-value', '');
					}
				});
			});
		});
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
}

exports.RenderNuevoAnime = RenderNuevoAnime;