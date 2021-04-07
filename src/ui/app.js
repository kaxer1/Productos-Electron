const productForm = document.getElementById('productForm');

const main = require('electron').remote.require('./main')

const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productsList = document.getElementById('products')

let products = [];
let editingStatus = false;
let editProductId = 0;

productForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }

    if (!editingStatus) {
        let result = await main.CrearProducto(newProduct)
        // console.log(result);
    } else {
        await main.ActualizarProducto(editProductId, newProduct)
        editProductId = 0;
        editingStatus = false;
    }

    productForm.reset();
    productName.focus();
    await getProducts()

});

async function deleteProduct(id) {
    const response = confirm('¿Esta seguro de eliminar este producto?')
    if (response) {
        await main.EliminarProducto(id)
        await getProducts()
    }
    return;
}

async function editProduct(id) {
    let product = await main.ObtenerProductoById(id);
    // console.log(product);
    productName.value = product.nombre;
    productPrice.value = product.precio;
    productDescription.value = product.descripcion;

    editingStatus = true;
    editProductId = product.id;
}

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        productsList.innerHTML += `
            <div class="card card-body my-2 animate__animated animate__fadeInLeft">
                <h4>${product.nombre}</h4>
                <p>${product.descripcion}</p>
                <h3>${product.precio}</h3>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
                    <button class="btn btn-success" onclick="editProduct(${product.id})">Editar</button>
                </p>
            </div>
        `
    });
}

const getProducts = async() => {
    products = await main.ObtenerProductos();
    renderProducts(products);
}

async function init() {
    await getProducts()
}

init()
