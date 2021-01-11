// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderPendiente } = require('../models/RenderPendiente.js');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode
    let render = new RenderPendiente();
    render.getAllData();
    render.setDragDrop();
});