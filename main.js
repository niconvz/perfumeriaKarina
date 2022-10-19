document.addEventListener('DOMContentLoaded', () => {

// Variables
    let productos = [
    {
            id: 1,
            nombre: "Repelente",
            precio: 620,
            imagen: "./images/cardrepelente.jpg",
        },
        {
            id: 2,
            nombre: "Suavizante",
            precio: 300,
            imagen: "./images/cardquerubin.jpg",
        },
        {
            id: 3,
            nombre: "Lavandina",
            precio: 165,
            imagen: "./images/cardayudin.jpg",
        },
        {
            id: 4,
            nombre: "Limpiador",
            precio: 490,
            imagen: "./images/cardlimpiador.jpg",
        },
        {
            id: 5,
            nombre: "Blem",
            precio: 450,
            imagen: "./images/cardlustra.jpg",
        },
        {
            id: 6,
            nombre: "Detergente",
            precio: 140,
            imagen: "./images/carddetergente.jpg",
        },
        ];

    let carrito = [];
    const moneda = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-comprar');
    const miLocalStorage = window.localStorage;

    // Funciones

    /* Dibuja todos los productos a partir de la variable productos. No confundir con el carrito */
    function renderizarProductos() {
        const url = './productos.json'
        fetch(url)
        .then ((res) => res.json())
        .then ((productos) => {
        productos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${moneda}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-danger');
            miNodoBoton.textContent = "Añadir al carrito"
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    })}

    /* Evento para añadir un producto al carrito de la compra */
    function anyadirProductoAlCarrito(evento) {
        // Añado el Nodo al carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizar el carrito 
        renderizarCarrito();
        // Actualizar el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /* Dibuja todos los productos guardados en el carrito */
    function renderizarCarrito() {
        // Vacia todo el html
        DOMcarrito.textContent = '';
        // Quita los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Genera los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtiene el item que necesitamos de la variable productos
            const miItem = productos.filter((producto) => {
                // Solo puede existir un caso
                return producto.id === parseInt(item);
            });
            // Número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // Incrementa el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Crea el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${moneda}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezcla nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Dibuja el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /* Evento para borrar un elemento del carrito */
    function borrarItemCarrito(evento) {
        // Obteniene el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borra todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // Vuelve a dibujar
        renderizarCarrito();
        // Actualiza el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /* Calcula el precio total */
    function calcularTotal() {
        // Recorre el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada producto obtenemos su precio
            const miItem = productos.filter((producto) => {
                return producto.id === parseInt(item);
            });
            // Los suma al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /* Confirma la compra y ejecuta sweetalert*/
    window.onload = function(){
        document.getElementById("boton-comprar").addEventListener("click", confirmar)
    }

    function confirmar(){
        Swal.fire(
            '¡Gracias por su compra!',
            'Tu pedido esta siendo procesado, lo recibiras dentro de las 48 horas habiles.',
            'success'
        )
        carrito = [];
        renderizarCarrito();
        localStorage.clear()
    }
    /* Vacia el carrito y vuelve a dibujarlo */
    function vaciarCarrito() {
        // Limpia los productos guardados
        carrito = [];
        // Dibuja los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});