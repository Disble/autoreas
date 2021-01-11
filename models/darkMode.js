const nativeTheme = require('electron').remote.nativeTheme;
const { ipcRenderer } = require('electron');
const settings = require('electron-settings');

/**
 * Activa el darkmode a la pagina actual.
 */
const darkMode = () => {
    let darkModeSettings = settings.get('darkMode', 'system');
    if (darkModeSettings === 'light') {
        nativeTheme.themeSource = 'light';
        document.body.classList.remove('dark-mode');
        return;
    } else if (darkModeSettings === 'dark') {
        nativeTheme.themeSource = 'dark';
        document.body.classList.add('dark-mode');
        return;
    }
    nativeTheme.themeSource = 'system'; // activamos el tema del sistema
    if (nativeTheme.shouldUseDarkColors) {
        document.body.classList.add('dark-mode');
    }

    ipcRenderer.on('is-dark-mode', (_e, isDarkMode) => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
};

module.exports.darkMode = darkMode;