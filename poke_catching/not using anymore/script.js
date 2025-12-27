// DOM queries
const grass1 = document.getElementById('grass1');
const grass2 = document.getElementById('grass2');
const grass3 = document.getElementById('grass3');
const pokemon_caught_div = document.getElementById('pokemon_caught_div');
const pokeballs_left_div = document.getElementById('pokeballs_left_div');
const play_again_button = document.getElementById('play_again_button');
const start_over_button = document.getElementById('start_over_button');
const stats_button = document.getElementById('stats_button');
const status = document.getElementById('status');
const in_super_mode = document.getElementById('supermode');
const amtPokemon = document.getElementById('amtPokemon');

// Pokémon data
const pokemon_img = ['images/pikachu.png','images/bulbasaur.png','images/charmander.png','images/eevee.png','images/squirtle.png'];
const pokemon_name = ['Pikachu','Bulbasaur','Charmander','Eevee','Squirtle'];
const super_pokemon_img = ['images/lugia.png','images/ho-oh.png','images/charizard.png','images/blastoise.png','images/venasaur.png'];
const super_pokemon_name = ['Lugia','Ho-oh','Charizard','Blastoise','Venasaur'];

let pokeballsRemaining = 5;
let pokemonCaught = 0;
let collectedItems = [];
let gameState = 0;
let superMode = Math.random() < 0.2; // 20% chance to start in super mode

function pickGrass(grassElement) {
    if (gameState !== 0) return;

    if (superMode) {
        // Super Pokémon
        let idx = Math.floor(Math.random() * super_pokemon_img.length);
        grassElement.src = super_pokemon_img[idx];
        let name = super_pokemon_name[idx];
        status.innerHTML = `✨ Super Pokémon! You got a ${name}! ✨`;
        collectedItems.push(name + " (Super) found");
        pokemonCaught++;
        pokeballsRemaining--; // decrease Pokéballs for super Pokémon
        in_super_mode.innerHTML = "You're in Super Mode!";
        superMode = false;
    } else {
        pokeballsRemaining--; // decrease Pokéballs for normal turn

        let chance = Math.floor(Math.random() * 3);

        if (chance === 0) {
            grassElement.src = 'images/pokeballs.png';
            pokeballsRemaining += 2;
            status.innerHTML = "🎉 You found 2 Pokéballs!";
            collectedItems.push("Pokéballs found");
        } else if (chance === 1) {
            grassElement.src = '';
            status.innerHTML = "Nothing here...";
            collectedItems.push("Nothing found");
        } else {
            let idx = Math.floor(Math.random() * pokemon_img.length);
            grassElement.src = pokemon_img[idx];
            let name = pokemon_name[idx];
            status.innerHTML = `You caught a ${name}!`;
            collectedItems.push(name + " found");
            pokemonCaught++;
        }
    }

    // Update counters
    pokemon_caught_div.innerHTML = `Pokémon Caught: ${pokemonCaught}`;
    pokeballs_left_div.innerHTML = `Pokéballs: ${pokeballsRemaining}`;

    // Show buttons
    play_again_button.style.display = 'block';
    start_over_button.style.display = 'block';
    stats_button.style.display = 'block';

    gameState = 1;

    if (pokeballsRemaining < 1) {
        status.innerHTML = "💀 Game Over!";
        resetGame();
    }
}

function resetGame() {
    grass1.src = 'images/grass.png';
    grass2.src = 'images/grass.png';
    grass3.src = 'images/grass.png';
    pokeballsRemaining = 5;
    pokemonCaught = 0;
    collectedItems = [];
    pokemon_caught_div.innerHTML = "Pokémon Caught: 0";
    pokeballs_left_div.innerHTML = "Pokéballs: 5";
    in_super_mode.innerHTML = "";
    amtPokemon.innerHTML = "";
    superMode = Math.random() < 0.2;
}

// Event listeners
grass1.onclick = () => pickGrass(grass1);
grass2.onclick = () => pickGrass(grass2);
grass3.onclick = () => pickGrass(grass3);

play_again_button.onclick = () => {
    grass1.src = 'images/grass.png';
    grass2.src = 'images/grass.png';
    grass3.src = 'images/grass.png';
    amtPokemon.innerHTML = "";
    in_super_mode.innerHTML = "";
    gameState = 0;
    superMode = Math.random() < 0.2;
};

start_over_button.onclick = () => {
    resetGame();
    gameState = 0;
};

stats_button.onclick = () => {
    if (collectedItems.length === 0) {
        amtPokemon.innerHTML = "<em>No results yet.</em>";
        return;
    }

    let html = "<strong>Game Results:</strong><ol>";
    collectedItems.slice().reverse().forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += "</ol>";
    amtPokemon.innerHTML = html;
};
