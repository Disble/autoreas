const M = require('materialize-css');
const swal = require('sweetalert');
const Chart = require('chart.js');
// Variables locales
const { Historial } = require('../models/Historial.js');
const { BDAnimes } = require('../models/consultas.js');
const { Anime } = require('../models/Anime');
const { ipcRenderer } = require('electron');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', async function () {
    darkMode(); // activando dark-mode
    let res = ipcRenderer.sendSync('return-history', 'please'); // pide al main el idAnime que se guardo antes
    //
    let consultas = new BDAnimes();
    let animeData = await consultas.buscarAnimePorId(res.key);
    let anime = new Anime(animeData.nombre, animeData.dias, animeData.nrocapvisto, animeData.totalcap, animeData.tipo, animeData.pagina, animeData.carpeta, animeData.estudios, animeData.origen, animeData.generos, animeData.duracion, animeData.portada, animeData.estado, animeData.repetir, animeData.activo, animeData.primeravez, animeData.fechaPublicacion, animeData.fechaEstreno, animeData.fechaCreacion, animeData.fechaUltCapVisto, animeData.fechaEliminacion, animeData._id);
    document.title = `${anime.nombre} | Información`;
    let historial = new Historial();
    historial.setInfoAnime(anime);

    M.Collapsible.init(document.querySelectorAll('.collapsible'));
    M.Chips.init(document.querySelectorAll('.chips'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
        enterDelay: 1000
    });
    M.updateTextFields();

    document.getElementById('return-history').addEventListener('click', () => {
        ipcRenderer.sendSync('return-me-history', res.pag);
    });
});