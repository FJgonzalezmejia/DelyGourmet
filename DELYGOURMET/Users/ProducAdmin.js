import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

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
const storage = getStorage(app);

// Función para cargar productos
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const tableBody = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        // Formateador para el precio en quetzales
        const currencyFormatter = new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        });

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = data.nombre;
            row.insertCell(1).textContent = currencyFormatter.format(data.precio); // Formatear el precio
            row.insertCell(2).textContent = data.descripcion; // Añadir la descripción

            // Mostrar la categoría
            row.insertCell(3).textContent = data.categoria; // Mostrar categoría

            // Mostrar la imagen
            const imgCell = row.insertCell(4);
            const img = document.createElement('img');
            img.src = data.imageUrl || 'https://via.placeholder.com/100'; // Imagen por defecto si no hay URL
            img.style.width = '100px'; // Ajusta el tamaño máximo de la imagen
            img.style.height = 'auto'; // Mantiene la proporción de la imagen
            img.style.maxWidth = '150px'; // Tamaño máximo para evitar imágenes demasiado grandes
            img.style.maxHeight = '100px'; // Tamaño máximo para evitar imágenes demasiado grandes
            imgCell.appendChild(img);

            const actionsCell = row.insertCell(5);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteProduct(doc.id));
            actionsCell.appendChild(deleteButton);
        });
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

// Función para eliminar un producto
async function deleteProduct(productId) {
    const productDoc = doc(db, 'productos', productId);
    await deleteDoc(productDoc);
    loadProducts(); // Recargar la tabla
}

// Cargar productos al iniciar
loadProducts();
