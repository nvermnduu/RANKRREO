let usuarioActual = null;
let lugares = JSON.parse(localStorage.getItem("lugares")) || [];

// LOGIN
function login() {
  const nombre = document.getElementById("nombreUsuario").value.trim();
  const emoji = document.getElementById("emojiUsuario").value.trim();

  if (!nombre || !emoji) return alert("Pon nombre y emoji!");

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

  renderLugares();
}

// AGREGAR LUGAR
function agregarLugar() {
  const nombre = document.getElementById("lugar").value.trim();
  if (!nombre) return;

  lugares.push({ nombre, comidas: [] });
  document.getElementById("lugar").value = "";

  guardarYRender();
}

// AGREGAR COMIDA
function agregarComida(lugarIndex) {
  const nombre = document.getElementById(`comida-${lugarIndex}`).value.trim();
  const puntuacion = parseInt(document.getElementById(`puntuacion-${lugarIndex}`).value);

  if (!nombre || !puntuacion) return;

  lugares[lugarIndex].comidas.push({
    nombre,
    puntuacion,
    usuario: usuarioActual.nombre,
    emoji: usuarioActual.emoji
  });

  document.getElementById(`comida-${lugarIndex}`).value = "";
  document.getElementById(`puntuacion-${lugarIndex}`).value = "";

  guardarYRender();
}

// ELIMINAR LUGAR
function eliminarLugar(index) {
  lugares.splice(index, 1);
  guardarYRender();
}

// ELIMINAR COMIDA
function eliminarComida(lugarIndex, comidaIndex) {
  lugares[lugarIndex].comidas.splice(comidaIndex, 1);
  guardarYRender();
}

// GUARDAR EN LOCAL Y RENDERIZAR
function guardarYRender() {
  localStorage.setItem("lugares", JSON.stringify(lugares));
  renderLugares();
}

// RENDERIZAR
function renderLugares() {
  const contenedor = document.getElementById("lugares");
  contenedor.innerHTML = "";

  lugares.forEach((lugar, i) => {
    const div = document.createElement("div");
    div.className = "card";

    let promedio = 0;
    if (lugar.comidas.length > 0) {
      const total = lugar.comidas.reduce((sum, c) => sum + c.puntuacion, 0);
      promedio = (total / lugar.comidas.length).toFixed(1);
    }

    div.innerHTML = `
      <h2>📍 ${lugar.nombre} ⭐ ${promedio} 
      <button onclick="eliminarLugar(${i})">🗑️</button></h2>

      <input id="comida-${i}" placeholder="Comida">
      <input id="puntuacion-${i}" type="number" placeholder="Puntuación">
      <button onclick="agregarComida(${i})">Agregar</button>

      <ul>
        ${lugar.comidas.map((c, ci) => `
          <li>
            ${c.nombre} - ⭐ ${c.puntuacion} (${c.emoji} ${c.usuario}) 
            <button onclick="eliminarComida(${i}, ${ci})">🗑️</button>
          </li>
        `).join("")}
      </ul>
    `;

    contenedor.appendChild(div);
  });
}

// AGREGAR LUGAR O COMIDA CON ENTER
document.getElementById("lugar").addEventListener("keypress", function(e) {
  if (e.key === "Enter") agregarLugar();
});

// AUTO LOGIN AL CARGAR
autoLogin();
