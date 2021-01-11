const settings = require('electron-settings');
const Datastore = require('nedb');
const path = require('path');
const isDev = require('electron-is-dev');
const pendientesdb = isDev ? new Datastore({ filename: path.join(__dirname, '..', 'data', 'pendientes.dat'), autoload: true }) :
    new Datastore({ filename: path.join(settings.file(), '..', 'data', 'pendientes.dat'), autoload: true });

exports.pendientesdb = pendientesdb;