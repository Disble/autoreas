// require('electron-reload')(__dirname);
const electron = require('electron');
const { app, BrowserWindow, screen, ipcMain, nativeTheme } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Menu = electron.Menu;
const { autoUpdater } = require('electron-updater');

let template = [
    {
        label: 'The Will of the',
        submenu: [
            {
                label: 'Ver',
                accelerator: 'CmdOrCtrl+1',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.webContents.send('router', '/wild');
                            })
                        }
                    }
                }
            },
            {
                label: 'Editar',
                accelerator: 'CmdOrCtrl+3',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'editar.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Agregar',
                accelerator: 'CmdOrCtrl+4',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            // BrowserWindow.getAllWindows().forEach(function (win) {
                            //     win.loadFile(path.join('views', 'animes', 'agregar.html'));
                            // })
                            const win = BrowserWindow.getFocusedWindow();
                            win.loadFile(path.join('views', 'animes', 'agregar.html'));
                        }
                    }
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Historial',
                accelerator: 'CmdOrCtrl+h',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                argsHistory = { pag: 1 };
                                win.loadFile(path.join('views', 'animes', 'historial.html'));
                            })
                        }
                    }
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Capítulos vistos',
                accelerator: 'CmdOrCtrl+g',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'viendo.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Capítulos restantes',
                accelerator: 'CmdOrCtrl+j',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'capitulos_restantes.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Páginas',
                accelerator: 'CmdOrCtrl+p',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'paginas.html'));
                            })
                        }
                    }
                }
            }
        ]
    },
    {
        label: 'Steins Gate',
        accelerator: 'CmdOrCtrl+S',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                if (focusedWindow.id === 1) {
                    BrowserWindow.getAllWindows().forEach(function (win) {
                        win.loadFile(path.join(__dirname, 'public', 'index.html'));
                        win.webContents.on('did-finish-load', () => {
                            win.webContents.send('ping', 'whoooooooh!');
                        });
                    })
                }
            }
        }
    },
    {
        label: 'Animes',
        submenu: [
            {
                label: 'Ver',
                accelerator: 'CmdOrCtrl+1',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'ver.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Editar',
                accelerator: 'CmdOrCtrl+3',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'editar.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Agregar',
                accelerator: 'CmdOrCtrl+4',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            // BrowserWindow.getAllWindows().forEach(function (win) {
                            //     win.loadFile(path.join('views', 'animes', 'agregar.html'));
                            // })
                            const win = BrowserWindow.getFocusedWindow();
                            win.loadFile(path.join('views', 'animes', 'agregar.html'));
                        }
                    }
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Historial',
                accelerator: 'CmdOrCtrl+h',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                argsHistory = { pag: 1 };
                                win.loadFile(path.join('views', 'animes', 'historial.html'));
                            })
                        }
                    }
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Capítulos vistos',
                accelerator: 'CmdOrCtrl+g',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'viendo.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Capítulos restantes',
                accelerator: 'CmdOrCtrl+j',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'capitulos_restantes.html'));
                            })
                        }
                    }
                }
            },
            {
                label: 'Páginas',
                accelerator: 'CmdOrCtrl+p',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.loadFile(path.join('views', 'animes', 'paginas.html'));
                            })
                        }
                    }
                }
            }
        ]
    },
    {
        label: 'Pendientes',
        submenu: [{
            label: 'Ver',
            accelerator: 'Alt+1',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            win.loadFile(path.join('views', 'pendientes', 'pendientes.html'));
                        })
                    }
                }
            }
        },
        {
            label: 'Agregar',
            accelerator: 'Alt+2',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            win.loadFile(path.join('views', 'pendientes', 'agregar.html'));
                        })
                    }
                }
            }
        },
        {
            label: 'Editar',
            accelerator: 'Alt+3',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            win.loadFile(path.join('views', 'pendientes', 'editar.html'));
                        })
                    }
                }
            }
        }
        ]
    },
    {
        label: 'Editar',
        submenu: [{
            label: 'Deshacer',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        },
        {
            label: 'Rehacer',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        },
        {
            type: 'separator'
        },
        {
            label: 'Cortar',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        },
        {
            label: 'Copiar',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        },
        {
            label: 'Pegar',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        },
        {
            label: 'Seleccionar todo',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }
        ]
    },
    {
        label: 'Preferencias',
        submenu: [

            {
            label: 'Opciones',
            accelerator: 'CmdOrCtrl+O',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            win.loadFile(path.join('views', 'opciones', 'index.html'));
                        })
                    }
                }
                }
            },
            {
                label: 'Toggle Theme',
                accelerator: 'CmdOrCtrl+O',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                win.webContents.send('dark-mode', 'dark');
                            })
                        }
                    }
                }
            }
        ]
    },
    {
        label: 'Ventana',
        role: 'window',
        submenu: [{
            label: 'Recargar',
            accelerator: 'CmdOrCtrl+R',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            if (win.id > 1) {
                                win.close()
                            }
                        })
                    }
                    focusedWindow.reload()
                }
            }
        },
        {
            label: 'Alternar pantalla completa',
            accelerator: (function () {
                if (process.platform === 'darwin') {
                    return 'Ctrl+Command+F'
                } else {
                    return 'F11'
                }
            })(),
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                }
            }
        },
        {
            label: 'Alternar herramientas de desarrollo',
            visible: isDev ? true : false,
            accelerator: (function () {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I'
                } else {
                    return 'Ctrl+Shift+I'
                    // return 'F12'
                }
            })(),
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Minimizar',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Cerrar',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }
        ]
    },
    {
        label: 'Ayuda',
        role: 'help',
        submenu: [
            {
                label: 'Notas de versión',
                click: function () {
                    electron.shell.openExternal('https://gitlab.com/Disble/automatizar-tareas/blob/master/CHANGELOG.md');
                }
            },
            {
                label: 'Acerca de',
                click: function () {
                    electron.shell.openExternal('https://gitlab.com/Disble/automatizar-tareas');
                }
            }]
    }
]

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    window = new BrowserWindow({
        width: width / 1.25,
        height: height / 1.25,
        icon: path.join(__dirname, '/icons/png/512x512.png'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    window.setTitle('Autoreas');
    // window.loadFile('public/index.html');
    window.loadFile(path.join('views', 'animes', 'ver.html'));

    // Loading menu from menu template
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Open the DevTools.
    if (isDev) window.toggleDevTools();
    // HISTORY
    let argsHistory = null;
    // Events IPC
    ipcMain.on('load-info-page', (event, arg) => {
        argsHistory = arg;
        window.loadFile(path.join('views', 'animes', 'info.html'));
        event.returnValue = 'pong';
    });
    // load the view historial.html and send idAnime loaded already.
    ipcMain.on('return-me-history', (event, arg) => {
        window.loadFile(path.join('views', 'animes', 'historial.html'));
        event.returnValue = argsHistory;
    });
    ipcMain.on('reset-args-history', (event, arg) => {
        argsHistory = arg;
        event.returnValue = 'reset-args-history';
    });
    ipcMain.on('return-history', (event, arg) => {
        event.returnValue = argsHistory;
    });
    // DARK MODE
    nativeTheme.on('updated', () => {
        window.webContents.send('is-dark-mode', nativeTheme.shouldUseDarkColors);
    });

    // Loading autoUpdater
    if (!isDev) {
        autoUpdater.checkForUpdatesAndNotify();
    }
};

let window = null;

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit());