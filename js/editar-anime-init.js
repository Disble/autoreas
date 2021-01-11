// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderEditarAnime } = require('../models/RenderEditarAnime');
const { BDAnimes } = require('../models/consultas.js');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode.
    let render = new RenderEditarAnime();
    render.initEditAnime();
    // Comprueba en que versión esta y migra si es necesario
    let consultas = new BDAnimes();
    await render.comprobarVersion(consultas);
});
