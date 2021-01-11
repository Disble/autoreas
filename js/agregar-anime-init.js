// Variables globales
const M = require('materialize-css');
const swal = require('sweetalert');
// Variables locales
const { RenderNuevoAnime } = require('../models/RenderNuevoAnime');
const { darkMode } = require('../models/darkMode');

document.addEventListener('DOMContentLoaded', function () {
    darkMode(); // activando dark-mode
    let render = new RenderNuevoAnime();
    render.initAgregarAnime();
    M.FormSelect.init(document.querySelectorAll('select'));
});
