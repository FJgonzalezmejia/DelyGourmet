import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
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

// Guardar producto
document.getElementById('btnGuardar').addEventListener('click', async () => {
    const nombre = document.getElementById('inputNombre').value;
    const descripcion = document.getElementById('inputDescripcion').value;
    const precio = parseFloat(document.getElementById('inputPrecio').value);
    const categoria = document.getElementById('inputCategoria').value; // Valor seleccionado de la categoría
    const file = document.getElementById('inputFile').files[0];

    // Validación de campos
    if (!nombre || !descripcion || !precio || !categoria) {
        alert("Por favor llena todos los campos.");
        return;
    }

    try {
        let imageUrl = '';
        // Subir imagen a Firebase Storage
        if (file) {
            const storageRef = ref(storage, `productos/${file.name}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
        }

        // Guardar producto en Firestore
        await addDoc(collection(db, 'productos'), {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria, // Guardar categoría
            imageUrl: imageUrl,
        });

        // Limpiar campos después de guardar
        document.getElementById('inputNombre').value = '';
        document.getElementById('inputDescripcion').value = '';
        document.getElementById('inputPrecio').value = '';
        document.getElementById('inputCategoria').value = '';
        document.getElementById('inputFile').value = '';

        alert("Producto guardado con éxito!");
    } catch (e) {
        console.error("Error añadiendo el producto: ", e);
    }
});
