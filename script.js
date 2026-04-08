// ⚡ Usamos módulos modernos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3vpdSZTU9reI6HEobEFD1MhykuhJy3-4",
  authDomain: "rankrreo.firebaseapp.com",
  projectId: "rankrreo",
  storageBucket: "rankrreo.firebasestorage.app",
  messagingSenderId: "227814567248",
  appId: "1:227814567248:web:e915b5727298b5c9f81055",
  measurementId: "G-017P4MB7H4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let usuarioActual = null;

// LOGIN
function login() {
  const nombre = document.getElementById("nombreUsuario").value.trim();
  const emoji = document.getElementById("emojiUsuario").value.trim();

  if (!nombre || !emoji) return;

  usuarioActual = { nombre, emoji };
  localStorage.setItem("usuario", JSON.stringify(usuarioActual));

  iniciarApp();
}

// AUTO LOGIN
function autoLogin() {
  const data = localStorage.getItem("usuario");
  if (data) {
    usuarioActual = JSON.parse(data);
    iniciarApp();
  }
}

// INICIAR APP
function iniciarApp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("bienvenida").innerText =
    `Bienvenido ${usuarioActual.emoji} ${usuarioActual.nombre}`;

  escucharDatos();
}

// AGREGAR LUGAR
async function agregarLugar() {
  const nombre = document.getElementById("lugar").value.trim();
  if (!nombre) return;

  await addDoc(collection(db, "lugares"), { nombre, comidas: [] });
  document.getElementById("lugar").value = "";
}

// AGREGAR COMIDA
async function agregarComida(id) {
  const nombre = document.getElementById(`comida-${id}`).value.trim();
  const puntuacion = document.getElementById(`puntuacion-${id}`).value.trim();

  if (!nombre || !puntuacion) return;

  const lugarRef = doc(db, "lugares", id);
  const lugarSnap = await getDoc(lugarRef);

  if (!lugarSnap.exists()) return;

  const data = lugarSnap.data();
  const comidas = data.comidas || [];

  comidas.push({
    nombre,
    puntuacion: parseInt(puntuacion),
    usuario: usuarioActual.nombre,
    emoji: usuarioActual.emoji
  });

  await updateDoc(lugarRef, { comidas });
}

// ESCUCHAR DATOS EN TIEMPO REAL
function escucharDatos() {
  const lugaresCol = collection(db, "lugares");

  onSnapshot(lugaresCol, (snapshot) => {
    const contenedor = document.getElementById("lugares");
    contenedor.innerHTML = "";

    snapshot.forEach(docSnap => {
      const lugar = docSnap.data();
      const id = docSnap.id;

      const div = document.createElement("div");
      div.className = "card";

      let promedio = 0;
      if (lugar.comidas.length > 0) {
        const total = lugar.comidas.reduce((sum, c) => sum + c.puntuacion, 0);
        promedio = (total / lugar.comidas.length).toFixed(1);
      }

      div.innerHTML = `
        <h2>📍 ${lugar.nombre} ⭐ ${promedio}</h2>

        <input id="comida-${id}" placeholder="Comida">
        <input id="puntuacion-${id}" type="number" placeholder="Puntuación">
        <button onclick="agregarComida('${id}')">Agregar</button>

        <ul>
          ${(lugar.comidas || []).map(c => `
            <li>${c.nombre} - ⭐ ${c.puntuacion} (${c.emoji} ${c.usuario})</li>
          `).join("")}
        </ul>
      `;

      contenedor.appendChild(div);
    });
  });
}

// INICIAR AUTO LOGIN
autoLogin();
