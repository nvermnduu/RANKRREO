// 🔹 Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3vpdSZTU9reI6HEobEFD1MhykuhJy3-4",
  authDomain: "rankrreo.firebaseapp.com",
  projectId: "rankrreo",
  storageBucket: "rankrreo.appspot.com",
  messagingSenderId: "227814567248",
  appId: "1:227814567248:web:e915b5727298b5c9f81055",
  measurementId: "G-017P4MB7H4"
};

// Inicializar Firebase clásico
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let usuarioActual = null;

// LOGIN
function login() {
  let nombre = document.getElementById("nombreUsuario").value.trim();
  let emoji = document.getElementById("emojiUsuario").value.trim();

  if (!nombre || !emoji) return alert("Debes poner nombre y emoji");

  usuarioActual = { nombre, emoji };

  localStorage.setItem("usuario", JSON.stringify(usuarioActual));

  iniciarApp();
}

// AUTO LOGIN
function autoLogin() {
  let data = localStorage.getItem("usuario");
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
function agregarLugar() {
  let nombre = document.getElementById("lugar").value.trim();
  if (!nombre) return;

  db.collection("lugares").add({
    nombre,
    comidas: []
  });

  document.getElementById("lugar").value = "";
}

// AGREGAR COMIDA
function agregarComida(id) {
  let nombre = document.getElementById(`comida-${id}`).value.trim();
  let puntuacion = document.getElementById(`puntuacion-${id}`).value.trim();

  if (!nombre || !puntuacion) return;

  let ref = db.collection("lugares").doc(id);

  ref.get().then(doc => {
    let data = doc.data();
    let comidas = data.comidas || [];

    comidas.push({
      nombre,
      puntuacion: parseInt(puntuacion),
      usuario: usuarioActual.nombre,
      emoji: usuarioActual.emoji
    });

    ref.update({ comidas });
  });

  document.getElementById(`comida-${id}`).value = "";
  document.getElementById(`puntuacion-${id}`).value = "";
}

// ESCUCHAR CAMBIOS EN TIEMPO REAL
function escucharDatos() {
  db.collection("lugares").onSnapshot(snapshot => {
    let contenedor = document.getElementById("lugares");
    contenedor.innerHTML = "";

    snapshot.forEach(doc => {
      let lugar = doc.data();
      let id = doc.id;

      let div = document.createElement("div");
      div.className = "card";

      let promedio = 0;
      if (lugar.comidas.length > 0) {
        let total = lugar.comidas.reduce((sum, c) => sum + c.puntuacion, 0);
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
