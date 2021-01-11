// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode
    let historial = new Historial();
    historial.numCapRestantes();
});
