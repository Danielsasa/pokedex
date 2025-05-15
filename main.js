// Selección de elementos del DOM
const listaPokemon = document.querySelector("#listaPokemon");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

// Crear botones dinámicos
const cargarMasBtn = crearBoton("Cargar más", "btnCargarMas");
const regresarBtn = crearBoton("Regresar", "btnRegresar", true); // Oculto inicialmente

// Variables para la API y control de paginación
const URL = "https://pokeapi.co/api/v2/pokemon/";
let offset = 0; // Controla el inicio de los Pokémon a cargar
const limit = 52; // Cantidad de Pokémon por página

// Función para crear botones dinámicamente
function crearBoton(texto, clase, oculto = false) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.classList.add(clase);
    if (oculto) boton.style.display = "none";
    document.body.appendChild(boton);
    return boton;
}

// Función para cargar Pokémon desde la API
async function cargarPokemon(offset, limit) {
    for (let i = offset + 1; i <= offset + limit && i <= 1025; i++) {
        try {
            const response = await fetch(`${URL}${i}`);
            const data = await response.json();
            mostrarPokemon(data);
        } catch (error) {
            console.error(`Error al cargar el Pokémon con ID ${i}:`, error);
        }
    }
}

// Función para mostrar un Pokémon en el DOM
function mostrarPokemon(pokemon) {
    // Genera el HTML para los tipos del Pokémon, cada tipo será un <p> con su clase correspondiente
    const tipos = pokemon.types
        .map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`)
        .join("");

    // Formatea el ID del Pokémon a 3 dígitos (por ejemplo, 001, 025, 150)
    const pokeId = pokemon.id.toString().padStart(3, "0");

    // Convierte la altura de decímetros a metros y la deja con un decimal
    const tamaño = (pokemon.height / 10).toFixed(1);

    // Convierte el peso de hectogramos a kilogramos y la deja con un decimal
    const peso = (pokemon.weight / 10).toFixed(1);

    // Crea el elemento div que será la tarjeta del Pokémon
    const div = document.createElement("div");
    div.classList.add("pokemon"); // Clase base para el estilo de la tarjeta

    // Obtiene el tipo principal del Pokémon y lo agrega como clase para el color de fondo
    const primaryType = pokemon.types[0].type.name;
    div.classList.add(primaryType); // Así el fondo cambia según el tipo

    // Define el contenido HTML de la tarjeta con la información del Pokémon
    div.innerHTML = `
        <div class="pokemon-imagen">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${pokemon.name}</h2>
            </div>
            <div class="pokemon-tipos">${tipos}</div>
            <div class="pokemon-habilidades">
                <p class="habilidad">${pokemon.abilities[0]?.ability.name || ""}</p>
                <p class="habilidad">${pokemon.abilities[1]?.ability.name || ""}</p>
            </div>
            <div class="pokemon-stats">
                <p class="stat">${tamaño}m</p>
                <p class="stat">${peso}kg</p>
            </div>
        </div>
    `;

    // Agrega la tarjeta creada al contenedor principal de la lista de Pokémon
    listaPokemon.appendChild(div);
}

// Evento para el botón "Cargar más"
cargarMasBtn.addEventListener("click", () => {
    offset += limit; // Incrementa el offset
    cargarPokemon(offset, limit); // Carga los siguientes Pokémon
});

// Evento para el botón "Regresar"
regresarBtn.addEventListener("click", () => {
    listaPokemon.innerHTML = ""; // Limpia la lista de Pokémon
    offset = 0; // Reinicia el offset
    cargarPokemon(offset, limit); // Carga los primeros Pokémon
    regresarBtn.style.display = "none"; // Oculta el botón "Regresar"
    cargarMasBtn.style.display = "block"; // Muestra el botón "Cargar más"
});

// Evento para el botón de búsqueda
searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim().toLowerCase(); // Obtiene el valor del input y lo normaliza
    if (!query) {
        alert("Por favor, ingresa un nombre o número de Pokémon.");
        return;
    }

    try {
        const response = await fetch(`${URL}${query}`); // Busca por nombre o número
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();
        listaPokemon.innerHTML = ""; // Limpia la lista
        mostrarPokemon(data); // Muestra el Pokémon encontrado

        // Oculta el botón "Cargar más" y muestra el botón "Regresar"
        cargarMasBtn.style.display = "none";
        regresarBtn.style.display = "block";
    } catch (error) {
        alert("No se encontró ningún Pokémon con ese nombre o número.");
    }
});

// Cargar los primeros Pokémon al inicio
cargarPokemon(offset, limit);