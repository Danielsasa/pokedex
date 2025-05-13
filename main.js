const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const cargarMasBtn = document.createElement("button"); 
cargarMasBtn.textContent = "Cargar más";
cargarMasBtn.classList.add("btnCargarMas");
let URL = "https://pokeapi.co/api/v2/pokemon/";
let offset = 0; // Controla el inicio de los Pokémon a cargar
const limit = 52; // Cantidad de Pokémon por página

async function cargarPokemon(offset, limit) {
    for (let i = offset + 1; i <= offset + limit && i <= 1025; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();
        mostrarPokemon(data);
    }
}

function mostrarPokemon(pokemon) {
    let tipos = pokemon.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = pokemon.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${pokemon.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-habilidades">
                <p class="habilidad">${pokemon.abilities[0].ability.name}</p>
                <p class="habilidad">${pokemon.abilities[1] ? pokemon.abilities[1].ability.name : ''}</p>
            </div>
            <div class="pokemon-stats">
                <p class="stat">${pokemon.height}m</p>
                <p class="stat">${pokemon.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", async (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";
    offset = 0; // Reinicia el offset al cambiar de filtro

    for (let i = 1; i <= 1025; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();

        if (botonId === "ver-todos") {
            mostrarPokemon(data);
        } else {
            const tipos = data.types.map(type => type.type.name);
            if (tipos.some(tipo => tipo.includes(botonId))) {
                mostrarPokemon(data);
            }
        }
    }
}));



// Evento para el botón "Cargar más"
cargarMasBtn.addEventListener("click", () => {
    offset += limit; // Incrementa el offset
    cargarPokemon(offset, limit); // Carga los siguientes 50 Pokémon
});

// Cargar los primeros 50 Pokémon al inicio
cargarPokemon(offset, limit);

// Agregar el botón "Cargar más" al final de la lista
document.body.appendChild(cargarMasBtn);