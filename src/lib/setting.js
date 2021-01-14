import Store from 'electron-store';

const setting = new Store();
export default setting;

/**
 * Esto es muy interesante, porque en este post
 * https://medium.com/@rajeshnaroth/singletons-in-javascript-and-es6-26f276a21df8
 * explican que en ES6 todos los módulos son singleton, así que solo hay que
 * exportarle para que el módulo sea un singleton como tal.
 */
