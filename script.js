// Cargar datos
let lugares = JSON.parse(localStorage.getItem("lugares")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// ENTER para agregar lugar
document.getElementById("lugar").addEventListener("keypress", function(e) {
  if (e.key === "Enter") agregarLugar();
});

// Crear usuario
function agregarUsuario() {
  let nombre = prompt("Tu nombre:");
  let emoji = prompt("Elige un emoji (😎🔥🍕):");

  if (!nombre || !emoji) return;

  usuarios.push({ nombre, emoji });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Usuario creado!");
  mostrarLugares();
}

// Agregar lugar
function agregarLugar() {
  let input = document.getElementById("lugar");
  let nombre = input.value.trim();

  if (nombre === "") return;

  lugares.push({
    nombre,
    comidas: []
  });

  input.value = "";
  guardar();
  mostrarLugares();
}

// Borrar lugar
function borrarLugar(index) {
  lugares.splice(index, 1);
  guardar();
  mostrarLugares();
}

// Agregar comida
function agregarComida(index) {
  let nombre = document.getElementById(`comida-${index}`).value.trim();
  let puntuacion = document.getElementById(`puntuacion-${index}`).value;
  let usuarioNombre = document.getElementById(`usuario-${index}`).value;

  if (!nombre || !puntuacion || !usuarioNombre) return;

  let usuarioObj = usuarios.find(u => u.nombre === usuarioNombre);

  lugares[index].comidas.push({
    nombre,
    puntuacion: parseInt(puntuacion),
    usuario: usuarioObj.nombre,
    emoji: usuarioObj.emoji
  });

  guardar();
  mostrarLugares();
}

// Borrar comida
function borrarComida(lugarIndex, comidaIndex) {
  lugares[lugarIndex].comidas.splice(comidaIndex, 1);
  guardar();
  mostrarLugares();
}

// Promedio
function calcularPromedio(comidas) {
  if (comidas.length === 0) return 0;
  let total = comidas.reduce((sum, c) => sum + c.puntuacion, 0);
  return (total / comidas.length).toFixed(1);
}

// Mostrar/ocultar
function toggle(index) {
  let el = document.getElementById(`comidas-${index}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

// Mostrar todo
function mostrarLugares() {
  let contenedor = document.getElementById("lugares");
  contenedor.innerHTML = "";

  lugares.forEach((lugar, i) => {
    let div = document.createElement("div");
    div.className = "card";

    let promedio = calcularPromedio(lugar.comidas);

    div.innerHTML = `
      <h2 onclick="toggle(${i})">📍 ${lugar.nombre} ⭐ ${promedio}</h2>
      <button onclick="borrarLugar(${i})">🗑️ Borrar</button>

      <div id="comidas-${i}" style="display:none;">
        <select id="usuario-${i}">
          <option value="">Selecciona usuario</option>
          ${usuarios.map(u => `<option value="${u.nombre}">${u.emoji} ${u.nombre}</option>`).join("")}
        </select>

        <input type="text" placeholder="Comida" id="comida-${i}">
        <input type="number" placeholder="Puntuación" id="puntuacion-${i}">
        <button onclick="agregarComida(${i})">Agregar</button>

        <ul>
          ${lugar.comidas.map((c, j) => `
            <li>
              ${c.nombre} - ⭐ ${c.puntuacion} (${c.emoji} ${c.usuario})
              <button onclick="borrarComida(${i}, ${j})">❌</button>
            </li>
          `).join("")}
        </ul>
      </div>
    `;

    contenedor.appendChild(div);

    // ENTER para comida
    setTimeout(() => {
      let comidaInput = document.getElementById(`comida-${i}`);
      if (comidaInput) {
        comidaInput.addEventListener("keypress", function(e) {
          if (e.key === "Enter") agregarComida(i);
        });
      }
    }, 0);
  });
}

// Guardar
function guardar() {
  localStorage.setItem("lugares", JSON.stringify(lugares));
}

// Iniciar
mostrarLugares();
