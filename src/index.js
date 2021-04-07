const {app} = require('electron')
const {CrearVentana} = require('./main');

require('./database');
console.log(__dirname);
require('electron-reload')(__dirname);

contextIsolation = true;
app.whenReady().then(CrearVentana)