const settings = require('electron-settings');
const Datastore = require('nedb');
const path = require('path');
const isDev = require('electron-is-dev');
const animesdb = isDev ? new Datastore({ filename: path.join(__dirname, '..', 'data', 'animes.dat'), autoload: true }) :
    new Datastore({ filename: path.join(settings.file(), '..', 'data', 'animes.dat'), autoload: true });

exports.animesdb = animesdb;