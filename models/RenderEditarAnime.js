'use strict'
const path = require('path');
const { BDAnimes } = require('./consultas.js');
const { RenderBase } = require('./RenderBase.js');
const { Days, Tipos, Estados } = require('./defaults-config.js');
const settings = require('electron-settings');
const { Anime } = require('./Anime');
const { dialog } = require('electron').remote;

/**
 * Clase para la sección de `Editar Anime`.
 */
class RenderEditarAnime extends RenderBase {
    /**
	 * Inicializa la Base de Datos y otras funciones adicionales.
	 */
    constructor() {
        super();
        this.db = new BDAnimes();
        this.currentAnime = null;
    }
    /**
	 * Inicializa la pagina Editar Animes.
	 */
    async initEditAnime() {
        this._initEditAnimeHTML();
        this._editAnime();
        let data = await this._loadEditAnime();
        if (data.length > 0) {
            this._getAnimeData(data[0]._id);
        } else {
            document.getElementById('submit-editar').classList.add('disabled');
            document.getElementById('borrar-anime').classList.add('disabled');
        }
        this._editAnimebtnDelete();
    }
    /**
	 * Busca todos los animes activos y 
	 * genera una lista HTML ordenada por 
	 * su fecha de creación.
	 * @return {Promise<any[]>} Lista de animes activos ordenados por su fecha de creación del más reciente al más antiguo.
	 */
    async _loadEditAnime() {
        let data = await this.db.buscarTodoEditar();
        let lista = document.getElementById('edit-anime-list');
        lista.innerHTML = '';
        let i = 0;
        for (const anime of data) {
            var item = document.createElement('a');
            item.href = "#!";
            item.setAttribute('data-value', anime._id);
            item.className = "collection-item blue-text";
            item.innerHTML = `<span class="grey-text badge-left-edit">${++i}</span>${anime.nombre}`;
            lista.appendChild(item);
            //
            item.addEventListener('click', (e) => {
                e.preventDefault();
                let id = e.target.getAttribute('data-value');
                this._getAnimeData(id);
            });
        }
        return data;
    }
	/**
	 * Busca y carga los datos de un anime en el
	 * formulario de Editar Animes, además inicializa
	 * los componentes de materialize-css.
	 * @param {string} id Id del anime a buscar.
	 */
    async _getAnimeData(id) {
        let data = await this.db.buscarAnimePorId(id);
        this.currentAnime = new Anime(data.nombre, data.dias, data.nrocapvisto, data.totalcap, data.tipo, data.pagina, data.carpeta, data.estudios, data.origen, data.generos, data.duracion, data.portada, data.estado, data.repetir, data.activo, data.primeravez, data.fechaPublicacion, data.fechaEstreno, data.fechaCreacion, data.fechaUltCapVisto, data.fechaEliminacion, data._id);
        // Cargan los datos en el formulario
        this._loadDataFormEdit(id, data);
        //
        M.updateTextFields();
        document.querySelectorAll('select').forEach((select) => {
            var instance = M.FormSelect.getInstance(select);
            instance.destroy();
            M.FormSelect.init(select);
        });
        // Quita el mensaje de error de los select en caso de estar activos.
        document.querySelectorAll('select').forEach((select) => {
            let label = select.parentNode.nextElementSibling;
            if (this.isNoData(label)) return;                       // esta validación es en caso de que haya un select sin un label, como los autogenerados del date-picker
            label.setAttribute('data-value', '');
        });
    }
	/**
	 * Carga los datos de un anime en el
	 * formulario de Editar Animes.
	 * @param {string} id Id del formulario.
	 * @param {any} data Datos a cargar en el formulario.
	 */
    _loadDataFormEdit(id, data) {
        let form = document.getElementById('form-edit-anime');
        let nombre = document.getElementById('nombre');
        // let dia = document.getElementById('dia'); // la línea maldita jajaja (3 horas)
        let capVistos = document.getElementById('cap-vistos');
        let totalCap = document.getElementById('total-cap');
        let tipo = document.getElementById('tipo');
        let estado = document.getElementById('estado');
        let pagina = document.getElementById('pagina');
        let carpeta = document.getElementById('carpeta');
        let duracion = document.getElementById('duracion');
        let origen = document.getElementById('origen');
        // PORTADA BEGIN
        let cambiarTipoImagen = document.getElementById('cambiar-tipo-imagen');
        if (data.portada.type === 'url') {
            cambiarTipoImagen.options[1].selected = true;                   // Cambia el valor del select
            this._runChangePortadaSelect({                                  // Cambia el input para el path
                value: data.portada.type
            })();
            document.getElementById('portada').value = data.portada.path;   // Asigna el valor del path en el input
        } else if (data.portada.type === 'image') {
            cambiarTipoImagen.options[0].selected = true;
            this._runChangePortadaSelect({
                value: 'imagen'
            })();
            document.getElementById('portada').value = data.portada.path;
            document.getElementById('portada-input').setAttribute('value', data.portada.path);
        }
        M.FormSelect.init(document.querySelectorAll('select'));             // re-inicialización necesaria para actualizar el select
        // PORTADA END
        // DROPDOWN-DIAS BEGIN
        let dropdownDias = document.getElementById('dropdown-dias');
        let inputsDia = dropdownDias.querySelectorAll('#dia');
        let inputsOrden = dropdownDias.querySelectorAll('#orden');
        let selectDropdownDaysText = '';
        for (const key in inputsOrden) {                                    // Limpia el dropdown-dias antes de asignar datos
            if (inputsOrden.hasOwnProperty(key)) {
                const inputOrden = inputsOrden[key];
                const inputDia = inputsDia[key];
                inputOrden.value = undefined;
                inputDia.parentElement.querySelector('#check-day').checked = false;
            }
        }
        document.querySelectorAll('input[id="orden"]').forEach(value => {   // valida que no se queden activados los checkbox
            value.readOnly = true;
        });
        for (const dia of data.dias) {                                      // Asigna datos de dia y orden al dropdown-dias
            for (const key in inputsDia) {
                if (inputsDia.hasOwnProperty(key)) {
                    const inputDia = inputsDia[key];
                    const inputOrden = inputsOrden[key];
                    if (dia.dia === inputDia.value) {
                        let check = inputDia.parentElement.querySelector('#check-day');
                        let orden = inputDia.parentElement.querySelector('#orden');
                        check.checked = true;
                        inputOrden.value = dia.orden;
                        orden.removeAttribute('readonly');
                        selectDropdownDaysText += selectDropdownDaysText.length === 0 ? `${this.getAlternativeDay(dia.dia)}, ${dia.orden}` : `; ${this.getAlternativeDay(dia.dia)}, ${dia.orden}`;     // guarda el día y orden para mostrarlo con el select cerrado
                    }
                }
            }
        }
        document.querySelector('[autoreas-droptext^=dropdown-dias-text]').innerText = selectDropdownDaysText;       // asígna el día y orden cuando el select esta cerrado
        // DROPDOWN-DIAS END
        // DATE-PICKER BEGIN
        let pickerFechaPublicacion = M.Datepicker.getInstance(document.getElementById('fechaPublicacion'));
        pickerFechaPublicacion.setDate(data.fechaPublicacion);
        pickerFechaPublicacion.setInputValue();                 // no esta en la documentación, pero sí esta implementado
        // DATE-PICKER END
        // CHIPS GENEROS BEGIN
        // limpiando datos antiguos
        let chipsGeneros = M.Chips.getInstance(document.querySelector('.chips.chips-generos'));
        while (chipsGeneros.chipsData.length > 0) {
            chipsGeneros.deleteChip(0);
        }
        // chipsGeneros.chipsData = null;
        // cargando nuevos datos
        if (!this.isNoData(data.generos)) {
            for (const genero of data.generos) {
                chipsGeneros.addChip({
                    tag: genero
                });
            }
        }
        // CHIPS GENEROS END
        // DROPDOWN-STUDIO BEGIN
        // primero limpiamos el dropdown-studio
        let forRemove = document.getElementById('dropdown-studio').querySelectorAll('#row-studio');
        for (const el of forRemove) {
            this.removeEl(el);
        }
        if (!this.isNoData(data.estudios) && data.estudios.length > 1) {
            // segundo agregamos las nuevas filas
            for (const _i of data.estudios) {
                this._clickDropdownInputs(document.getElementById('btn-add-row'))(); // esta línea genera nueva filas en el dropdown-inputs
            }
            // después asignamos los datos.
            let dropdownStudio = document.getElementById('dropdown-studio').querySelectorAll('#row-studio');
            for (const i in dropdownStudio) {
                if (dropdownStudio.hasOwnProperty(i)) {
                    const dropdown = dropdownStudio[i];
                    dropdown.querySelector('#estudio').value = data.estudios[i].estudio;
                    dropdown.querySelector('#estudio-url').value = data.estudios[i].url;
                }
            }
        }
        // DROPDOWN-STUDIO END
        form.setAttribute('data-value', id);
        //
        duracion.value = data.duracion;
        nombre.value = data.nombre;
        dia.value = data.dia;
        capVistos.value = data.nrocapvisto;
        totalCap.value = data.totalcap;
        tipo.value = data.tipo;
        estado.value = data.estado;
        pagina.value = data.pagina;
        carpeta.value = data.carpeta;
        origen.value = data.origen;
    }
	/**
	 * Inicializa el botón que borra un anime
	 * de la lista de animes activos.
	 */
    _editAnimebtnDelete() {
        document.getElementById('borrar-anime').addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            //
            let nombreAnime = document.getElementById('nombre').value;
            let id = document.getElementById('form-edit-anime').getAttribute('data-value');
            //
            if (id === null) return;
            //
            let borrar = await swal({
                title: "¿Estás seguro?",
                text: `Estas a punto de borrar "${nombreAnime}". \n\n¡Una vez borrado aún se podra restaurar en historial!`,
                icon: "warning",
                className: "warning-swal",
                buttons: ["Cancelar", "OK"],
                dangerMode: true,
            });
            if (borrar) {
                await this.db.desactivarAnime(id);
                let data = await this._loadEditAnime();
                if (data.length > 0) {
                    this._getAnimeData(data[0]._id);
                } else {
                    this._loadDataFormEdit(null, {
                        nombre: '',
                        dia: '',
                        orden: '',
                        capVistos: '',
                        totalCap: '',
                        tipo: '',
                        estado: '',
                        pagina: '',
                        carpeta: '',
                    });
                }
                swal({
                    title: "Éxito",
                    text: "Anime enviado al historial exitosamente",
                    icon: "success",
                    className: "success-swal"
                });
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
	/**
	 * Inicializa todo los eventos relacionados
	 * al HTML de Editar Animes.
	 */
    _initEditAnimeHTML() {
        let dropdownDias = document.getElementById('dropdown-dias');
        let estadosSelect = document.getElementById('estado');
        let tiposSelect = document.getElementById('tipo');
        let diasSettings = settings.get('days', Days);
        for (const tipoDia of diasSettings) {                                   // Días viene desde el import
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
                label.classList.add('col', 's1');
                label.innerHTML = `<input type="checkbox" id="check-day" /><span></span>`;
                li.appendChild(label);
                let inputDia = document.createElement('input');
                let inputOrden = document.createElement('input');
                let inputVerDia = document.createElement('input');
                //
                inputDia.type = 'text';
                inputDia.value = dia.name;
                inputDia.id = 'dia';
                inputDia.classList.add('hide');
                inputDia.readOnly = inputOrden.readOnly = true;
                //
                inputOrden.type = 'number';
                inputOrden.id = 'orden';
                inputOrden.min = 1;
                inputOrden.placeholder = 'Orden';
                inputOrden.classList.add('col', 's4');
                //
                inputVerDia.type = 'text';
                inputVerDia.value = dia.name === dia.alternative ? dia.name : dia.alternative;
                inputVerDia.classList.add('col', 's6', 'no-underline');
                inputVerDia.readOnly = inputOrden.readOnly = true;
                li.appendChild(inputDia);
                li.appendChild(inputVerDia);
                li.appendChild(inputOrden);
                dropdownDias.appendChild(li);
            }
        }
        for (const estado in Estados) {                                         // Estados viene desde el import
            const valor = Estados[estado];
            let opcion = document.createElement('option');
            opcion.value = valor;
            opcion.innerText = estado;
            estadosSelect.appendChild(opcion);
        }
        for (const tipo in Tipos) {                                             // Tipos viene desde el import
            const valor = Tipos[tipo];
            let opcion = document.createElement('option');
            opcion.value = valor;
            opcion.innerText = tipo;
            tiposSelect.appendChild(opcion);
        }

        /* Inicializaciones de Materialize */
        M.FormSelect.init(document.querySelectorAll('select'));
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            firstDay: 1,
            showClearBtn: true,
            i18n: {
                cancel: 'Ahora no joven',
                clear: 'Limpiar',
                done: 'Ok',
                months: [
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ],
                monthsShort: [
                    'Ene',
                    'Feb',
                    'Mar',
                    'Abr',
                    'May',
                    'Jun',
                    'Jul',
                    'Ago',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dic'
                ],
                weekdays: [
                    'Domingo',
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado'
                ],
                weekdaysShort: [
                    'Dom',
                    'Lun',
                    'Mar',
                    'Mié',
                    'Jue',
                    'Vie',
                    'Sáb'
                ],
                weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
            }
        });
        this._fixSelectValidation();
        M.Collapsible.init(document.querySelectorAll('.collapsible'));          // Inicializa el collapsible de `Más datos`.
        M.Chips.init(document.querySelectorAll('.chips'), {                     // Inicializa los chips de `genero`.
            onChipAdd(el) {                                                     // Modifica el icono por defecto de los chips por uno personalizado.
                let icons = el[0].querySelectorAll('.material-icons.close');
                icons[icons.length - 1].classList.add('icon-cancel');
                icons[icons.length - 1].innerText = "";
            }
        });
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
                let days = dropdownContainer.querySelectorAll('#dia+input'); // ya que el input junto #dia no tiene id, le busque por hermanos
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
        document.querySelectorAll('#check-day').forEach((value) => {            // Configura el estado modo lectura de los inputs en base a los checks.
            if (value.checked) {                                                // Los que ya esten `checked` se activan directamente.
                let li = value.parentElement.parentElement;
                li.querySelector('#orden').removeAttribute('readonly');
            }
            value.addEventListener('change', () => {
                if (value.checked) {
                    let li = value.parentElement.parentElement;
                    li.querySelector('#orden').removeAttribute('readonly');     // Quita el modo solo lectura del input.
                } else {
                    let li = value.parentElement.parentElement;
                    let orden = li.querySelector('#orden');
                    orden.value = '';                                           // Quita el valor para evitar confusiones.
                    orden.setAttribute('readonly', '');                         // Deja el input en modo solo lectura.
                }
            })
        });
        /**
         * FIN DROPDOWN DIAS
         */
        this.initDropdownInputs();                                              // Inicializa el nuevo dropdown con dos inputs por fila.
        /**
         * Evento change para select de portada.
         */
        let cambiarTipoImagen = document.getElementById('cambiar-tipo-imagen');
        cambiarTipoImagen.addEventListener('change', this._runChangePortadaSelect(cambiarTipoImagen));
        this._initInputPortada();
        /**
         * Reemplazo para el input file webkitdirectory que dejo de funcionar desde la v2.0.0
         * ahora se maneja con la API dialog de electron.
         */
        document.getElementById('carpeta-input').addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            let folders = dialog.showOpenDialogSync(null, {
                properties: ['openDirectory']
            });
            if (this.isNoData(folders)) return;
            let folder = folders[0];
            document.getElementById('carpeta').value = path.normalize(folder);
        })
    }
    /**
     * Activa el cambio del `input` del `select` Portada, dependiendo si es 
     * imagen o url.
     * @param {{value: string}} cambiarTipoImagen Objeto que determina si el select tiene activado url o imagen
     */
    _runChangePortadaSelect(cambiarTipoImagen) {
        return () => {
            let portadaInput = document.getElementById('cambiar-portada');
            if (cambiarTipoImagen.value === 'url') {
                portadaInput.classList.remove('file-field');
                portadaInput.innerHTML = /*html*/ `
                    <input id="portada" type="url">
                    <label for="portada">Portada</label>
                `;
            }
            else if (cambiarTipoImagen.value === 'imagen') {
                portadaInput.classList.add('file-field');
                portadaInput.innerHTML = /*html*/ `
                    <div class="btn btn-small blue" id="cambiar-portada-input">
                        <span><i class="material-icons icon-picture"></i></span>
                        <input type="file" id="portada-input" accept="image/*">
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path" type="text" name="portada" id="portada">
                    </div>
                `;
                this._initInputPortada(portadaInput);
            }
        };
    }

    /**
     * Inicializa el nuevo dropdown con dos inputs por fila.
     */
    initDropdownInputs() {
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger-inputs'), {
            closeOnClick: false,
            coverTrigger: false
        });
        // Evento para agregar una nueva fila arriba del botón agregar.
        document.querySelectorAll('#btn-add-row').forEach((value) => {
            value.addEventListener('click', this._clickDropdownInputs(value));
        });
        // Evento para borrar la primera fila de dropdown inputs
        document.querySelectorAll('#btn-delete-row').forEach((value) => {
            value.addEventListener('click', () => {
                let fila = value.parentElement.parentElement;
                fila.parentNode.removeChild(fila);
            });
        });
    }
    /**
     * Genera una nueva fila para la estructura dropdown-inputs (estudios) 
     * a través del botón agregar (+).
     * @param {HTMLElement} value Elemento HTML - Botón agregar del dropdown-inputs
     */
    _clickDropdownInputs(value) {
        return () => {
            let nuevaFila = document.createElement('li');
            nuevaFila.classList.add('row'); // equivalente a <li class="row">
            nuevaFila.id = 'row-studio';
            nuevaFila.innerHTML = /*html*/ `
                    <input type="text" id="estudio" placeholder="Estudio" class="col s6">
                    <input type="text" id="estudio-url" placeholder="URL" class="col s5">
                    <div class="col s1 dropdown-trash">
                        <a id="btn-delete-row" class="red lighten-5 red-text text-darken-1">
                            <i class="material-icons icon-trash-empty"></i>
                        </a>
                    </div>
                `;
            let filaPadre = value.parentElement.parentElement; // elemento ul
            filaPadre.insertBefore(nuevaFila, filaPadre.children[filaPadre.childElementCount - 1]); // agrega la nueva fila antes de la fila del botón
            nuevaFila.querySelector('#btn-delete-row').addEventListener('click', () => {
                nuevaFila.parentNode.removeChild(nuevaFila);
            });
        };
    }

    /**
     * Inicializa el evento `submit` del formulario
     * de Editar Animes. Este método se encarga de 
     * obtener los datos del formulario y guardarlos 
     * en la base de datos.
     */
    _editAnime() {
        document.getElementById('form-edit-anime').addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            let validate = this._dropdownDiasValidation();
            if (!validate) return false;
            //
            let form = new FormData(e.target);
            let nombre = form.get('nombre').trim();
            let capVistos = parseInt(form.get('cap-vistos'));
            let totalCap = parseInt(form.get('total-cap'));
            let tipo = parseInt(form.get('tipo'));
            let estado = parseInt(form.get('estado'));
            let pagina = form.get('pagina').trim();
            let carpeta = form.get('carpeta') === "" ? null : form.get('carpeta').trim();

            // No obligatorios
            let pickerFechaPublicacion = M.Datepicker.getInstance(document.getElementById('fechaPublicacion'));
            let fechaPublicacion = pickerFechaPublicacion.date;
            let duracion = parseInt(form.get('duracion'));
            let origen = form.get('origen').trim();
            let chipsGeneros = M.Chips.getInstance(document.querySelector('.chips.chips-generos'));
            let generos = chipsGeneros.chipsData.map(value => value.tag);
            // Validation Portada
            let selectPortada = M.FormSelect.getInstance(document.querySelector('#cambiar-tipo-imagen'));
            let selectPortadaValue = selectPortada.$selectOptions.filter(value => value.selected === true)[0].value;
            let portada = {};
            if (selectPortadaValue === 'url') { // type = url
                portada.type = 'url';
                portada.path = document.getElementById('portada').value;
            } else if (selectPortadaValue === 'imagen') { // type = image
                portada.type = 'image';
                portada.path = document.getElementById('portada-input').getAttribute('value');
            }
            // tomar en cuenta que si orden o dia estan vacios pasa al siguiente sin más.
            let diasVerificados = document.getElementById('dropdown-dias').querySelectorAll('#check-day:checked');
            let dias = [];
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
            // DROPDOWN-STUDIO BEGIN
            let dropdownStudio = document.getElementById('dropdown-studio').querySelectorAll('#row-studio');
            let estudios = [];
            for (const dropdown of dropdownStudio) {
                let estudio = {};
                estudio.estudio = dropdown.querySelector('#estudio').value;
                estudio.url = dropdown.querySelector('#estudio-url').value;
                estudios.push(estudio);
            }
            // DROPDOWN-STUDIO END
            this.currentAnime.nombre = nombre;
            this.currentAnime.dias = dias;
            this.currentAnime.nrocapvisto = capVistos;
            this.currentAnime.totalcap = totalCap;
            this.currentAnime.tipo = tipo;
            this.currentAnime.estado = estado;
            this.currentAnime.pagina = pagina;
            this.currentAnime.carpeta = carpeta;
            // No obligatirios
            this.currentAnime.fechaPublicacion = fechaPublicacion || null;
            this.currentAnime.portada = portada;
            this.currentAnime.duracion = duracion;
            this.currentAnime.origen = origen;
            this.currentAnime.estudios = estudios;
            this.currentAnime.generos = generos;
            //
            this.db.actualizarAnime(this.currentAnime._id, this.currentAnime)
                .then(res => {
                    if (res > 0) {
                        M.toast({
                            html: 'Datos actualizados correctamente',
                            displayLength: 4000
                        });
                        this._loadEditAnime();
                    } else {
                        M.toast({
                            html: 'Que raro... por algún motivo no podemos hacer la actualización.',
                            displayLength: 4000
                        });
                    }
                });
        });
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
                    if (this.isNoData(label)) return;                       // esta validación es en caso de que haya un select sin un label, como los autogenerados del date-picker
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
     * Valida que el dropdown-dias tenga al menos una fila llena, 
     * si no esta llena se vuelve rojo, caso contrario, azul.
     */
    _dropdownDiasValidation() {
        let validado = true;
        let diasVerificados = document.querySelector(`#dropdown-dias`).querySelectorAll('#check-day:checked');
        let dropdownDias = document.querySelector(`[data-target*="dropdown-dias"]`);
        let noError = true; // es para regresar al color original
        if (diasVerificados.length === 0) { // En caso de estar vacio se marca como invalido.
            dropdownDias.classList.add('dropdown-error');
            validado = false;
            noError = false;
        }
        for (const diaVerificado of diasVerificados) {
            let li = diaVerificado.parentElement.parentElement; // Llegamos a la fila
            let orden = li.querySelector('#orden').value;
            if (orden === '') {
                dropdownDias.classList.add('dropdown-error');
                validado = false;
                noError = false;
                continue;
            }
        }
        if (noError) {
            dropdownDias.classList.remove('dropdown-error');
        }
        return validado;
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
}

exports.RenderEditarAnime = RenderEditarAnime;