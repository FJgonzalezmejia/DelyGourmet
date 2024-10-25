import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB7RZJ0Zs2QiuWt8lxGruB5dBjgIlSEBjI",
    authDomain: "deliverygourmet-c367d.firebaseapp.com",
    databaseURL: "https://deliverygourmet-c367d-default-rtdb.firebaseio.com",
    projectId: "deliverygourmet-c367d",
    storageBucket: "deliverygourmet-c367d.appspot.com",
    messagingSenderId: "1099409715996",
    appId: "1:1099409715996:web:d33b21ae6c134ab0c840d9",
    measurementId: "G-YSL4M6FFH4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");

// Login
btnLogin.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        alert("Inicio de sesión exitoso");

        // Redirigir a la página de productos
        window.location.href = "Ingreso_de_productos.html";  // Cambia a la URL de tu página
    } catch (error) {
        console.error("Error logging in user:", error);
        alert("Error al iniciar sesión: " + error.message);
    }
});

// Auth State Change
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
        // Redirigir automáticamente si ya está autenticado
        window.location.href = "Ingreso_de_productos.html"; 
    } else {
        console.log("No user is signed in");
    }
});
