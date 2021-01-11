// Archivos que estaban en routers y son globales
const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');
const { BDAnimes } = require('../models/consultas.js');
const { ipcRenderer } = require('electron');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode
    let res = ipcRenderer.sendSync('return-history', 'please'); // pide al main el idAnime y pag que se guardo antes
    let pagInfo = 1;
    if (res !== null) pagInfo = res.pag;
    let consultas = new BDAnimes();
    let { datos, salto, totalReg, pag } = await consultas.cargarHistorial(pagInfo, 1);
    let historial = new Historial();
    if (datos.length > 0) {
        historial.imprimirHistorial(datos, salto, pag);
        historial.imprimirPagination(totalReg, pag);
        historial.configurarBuscador();
        // Comprueba en que versión esta y migra si es necesario
        await historial.comprobarVersion(consultas);
    } else {
        historial.containerBlancoConImagen('container-historial', 'Eiffel_tower.svg');
    }
});


