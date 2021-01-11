// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderVerAnime } = require('../models/RenderVerAnime');
const { BDAnimes } = require('../models/consultas.js');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode
    let render = new RenderVerAnime();
    render.initVerAnime();
    // es para el algoritmo de migración
    let consultas = new BDAnimes();
    await render.comprobarVersion(consultas);
});