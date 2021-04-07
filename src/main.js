const {BrowserWindow, Notification} = require('electron');

const {pool} = require('./database');

let window;

function CrearVentana() {
    window = new BrowserWindow({
        width: 1200,
        heigth: 900,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true // para que desde la ventana pueda llamar modulos de nodejs.
        }
    });

    window.loadFile('src/ui/index.html');
}

async function CrearProducto(producto) {
    try {
        let product_id = await pool.query('INSERT INTO productos(nombre, precio, descripcion) VALUES($1,$2,$3) RETURNING *', [producto.name, producto.price, producto.description])
        .then(res => {
            console.log(res.command);
            new Notification({
                title: 'Platillo Guardado',
                body: producto.name + ' registro exitoso'
            }).show();
            return res.rows[0]
        });

        return product_id
    } catch (error) {
        console.log(error);
    }
}

async function ObtenerProductos() {
    return await pool.query('SELECT * FROM productos ORDER BY id DESC').then(res => { return res.rows});
}

async function ObtenerProductoById(id) {
    return await pool.query('SELECT * FROM productos WHERE id = $1',[id]).then(res => { return res.rows[0]});
}

async function ActualizarProducto(editProductId, product) {
    return await pool.query('UPDATE productos SET nombre = $1, precio = $2, descripcion = $3 WHERE id = $4',[product.name, product.price, product.description, editProductId])
    .then(res => { 
        console.log(res.command) 
        return res;
    })
}


async function EliminarProducto(id) {
    return await pool.query('DELETE FROM productos WHERE id = $1',[id]).then(res => {
        console.log(res.command);
        return res.command
    })
}

module.exports = {
    CrearVentana,
    CrearProducto,
    ObtenerProductos,
    EliminarProducto,
    ObtenerProductoById,
    ActualizarProducto
}