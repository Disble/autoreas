const fs = require('fs');
const dialog = require('electron').remote.dialog;

/**
 * Clase destinada a exportar e importar archivos
 */
class Backup {
    /**
     * Leer el archivo a buscar y pide al usuario una dirección donde copiar
     * su contenido en un archivo de texto plano `.json`.
     * @param {string} dir Directorio donde se van a leer los datos a exportar.
     */
    async exportData(dir, name) {

        let content = `Hubo un error exportando el contenido. Por favor revise que el archivo animes.dat exista en el directorio '${dir}'.`;
        try {
            content = fs.readFileSync(dir, 'utf8');
        }
        catch (e) {
            await swal({
                title: "Houston, tenemos un problema",
                text: "Hubo un error leyendo los datos del archivo original. Por favor recargue la ventana y vuelva a intentarlo.",
                icon: "error",
                className: "error-swal"
            });
            return;
        }

        let saveDir = dialog.showSaveDialogSync({
            defaultPath: `*/${name}`,
            filters: [
                { name: 'Data', extensions: ['json'] }
            ]
        });
        if (saveDir === undefined) return; // validación en caso de cancelar la ventana de dialogo
        try {
            fs.writeFileSync(saveDir, content, 'utf-8');
            await swal({
                title: "Sus datos se han guardado con éxito",
                text: "Ya puede estar tranquilo.",
                icon: "success",
                className: "success-swal"
            });
        }
        catch (error) {
            if (error.code === 'ERR_INVALID_OPT_VALUE_ENCODING') console.error(`${error.code}: error de encoding`);
            await swal({
                title: "Houston, tenemos un problema",
                text: "Hubo un error guardando los datos en el destino proporcionado. Por favor recargue la ventana y vuelva a intentarlo.",
                icon: "error",
                className: "error-swal"
            });
        }
    }
    /**
     * Pide al usuario la dirección del archivo a importar, una vez dado
     * dicho archivo, se le copiara al directorio destino.
     * @param {string} importDir Directorio a donde se va copia los datos.
     */
    async importData(importDir) {
        let fileDir = dialog.showOpenDialogSync({
            filters: [
                { name: 'Data', extensions: ['json'] }
            ]
        });
        if (fileDir === undefined) return;
        let content = '';
        try {
            content = fs.readFileSync(fileDir[0], 'utf8');
        }
        catch (e) {
            await swal({
                title: "Houston, tenemos un problema",
                text: "Hubo un error leyendo los datos del archivo. Por favor recargue la ventana y vuelva a intentarlo.",
                icon: "error",
                className: "error-swal"
            });
            return;
        }
        try {
            fs.writeFileSync(importDir, content, 'utf-8');
            await swal({
                title: "Sus datos se han actualizado con éxito",
                text: "Ya puede estar tranquilo.",
                icon: "success",
                className: "success-swal"
            });
        }
        catch (error) {
            if (error.code === 'ERR_INVALID_OPT_VALUE_ENCODING') console.error(`${error.code}: error de encoding`);
            await swal({
                title: "Houston, tenemos un problema",
                text: "Hubo un error guardando los datos en el destino proporcionado. Por favor recargue la ventana y vuelva a intentarlo.",
                icon: "error",
                className: "error-swal"
            });
        }
    }
}

exports.Backup = Backup;