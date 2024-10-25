import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB7RZJ0Zs2QiuWt8lxGruB5dBjgIlSEBjI",
    authDomain: "deliverygourmet-c367d.firebaseapp.com",
    projectId: "deliverygourmet-c367d",
    storageBucket: "deliverygourmet-c367d.appspot.com",
    messagingSenderId: "1099409715996",
    appId: "1:1099409715996:web:d33b21ae6c134ab0c840d9",
    measurementId: "G-YSL4M6FFH4"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar productos desde Firebase según la categoría seleccionada
async function loadAndRenderProducts(category = 'all') {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const catalog = document.getElementById('catalog');
        catalog.innerHTML = ''; // Limpiar catálogo

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const product = {
                id: doc.id,
                name: data.nombre,
                price: parseFloat(data.precio), // Aseguramos que el precio sea numérico
                description: data.descripcion || 'Descripción no disponible',
                image: data.imageUrl || 'https://via.placeholder.com/150', // Imagen por defecto
                category: data.categoria
            };

            // Filtrar por categoría
            if (category === 'all' || product.category === category) {
                // Crear una tarjeta de producto
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                const formattedPrice = isNaN(product.price) ? "Precio no disponible" : product.price.toFixed(2);

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Precio: Q${formattedPrice}</p>
                    <p>${product.description}</p>
                    <button class="cartButton" data-product-name="${product.name}" data-product-price="${formattedPrice}">
                        Comprar
                    </button>
                `;

                catalog.appendChild(productCard);
            }
        });

        // Añadir evento a los botones de "Comprar"
        const cartButtons = document.querySelectorAll('.cartButton');
        cartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.getAttribute('data-product-name');
                const productPrice = parseFloat(this.getAttribute('data-product-price'));
                addToCart({ name: productName, price: productPrice });
            });
        });
    } catch (e) {
        console.error('Error al cargar los productos de Firebase: ', e);
    }
}

// Función para agregar productos al carrito usando localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} ha sido añadido al carrito`);
}

// Cargar los productos de todas las categorías inicialmente
loadAndRenderProducts();

// Filtrar productos cuando se selecciona una categoría
document.getElementById('categoryFilter').addEventListener('change', function() {
    const selectedCategory = this.value;
    loadAndRenderProducts(selectedCategory);
});
