
grass3.onclick = function() {
    if (gameState == 0) {
        if (gameState == 0) {
            if (superMode == true) {
            in_super_mode.innerHTML = "You're in Super Mode!";
            let chance2 = parseInt( Math.random() * 5 ); // 0, 1, 2, 3, 4, or 5
            //super pokemon img will be in separate array as other img
            let chosen = super_pokemon_img[chance2];
            //names will also be in separate array
            let name = super_pokemon_name[chance2]
            console.log(name);
            console.log(chosen);
            grass3.src = chosen;
            numPokemon = pokemonCaught += 1;
            pokemon_caught_div.innerHTML = "Pokemon: " + numPokemon;
            status.innerHTML = "You got a " + name + "!";
            //add whatever selected pokemon is to the array, for Feature #1
            collectedItems.push(' ' + name + " found");
            superMode = false;
            gameState = 1;
        
        } else if (superMode == false) {

            // reduce the # of pokeballs
            pokeballsRemaining -= 1;

            // generate a chance variable
            let chance = parseInt( Math.random() * 3 ); // 0, 1 or 2

            // more pokeballs
            if (chance == 0) {
                grass3.src = 'images/pokeballs.png';
                pokeballsRemaining += 2;
                status.innerHTML = "You got 2 pokeballs!"
                //add to the number of collected pokeballs for Feature #1
                collectedItems.push(" Nothing found");
                gameState = 1;
            }
            // nothing happens
            else if (chance == 1) {
                grass3.src = '';
                status.innerHTML = "Nothing here!"    
                collectedItems.push(" Nothing found");
                gameState = 1;
            }
            // it's a pokemon
            else {
                let chance1 = parseInt( Math.random() * 5 ); // 0, 1, 2, 3, 4, or 5
                let chosen =  pokemon_img[chance1];
                let name = pokemon_name[chance1]
                grass3.src = chosen;
                numPokemon = pokemonCaught += 1;
                pokemon_caught_div.innerHTML = "Pokemon: " + numPokemon;
                status.innerHTML = "You got a " + name + "!";
                //add whatever selected pokemon is to the array, for Feature #1
                collectedItems.push(' ' + name + " found");
                gameState = 1;
            }
        }
        // round is over, update the pokeballs left indicator
        pokeballs_left_div.innerHTML = 'Pokeballs: ' + pokeballsRemaining;

        // make the play agian button visible
        play_again_button.style.display = 'block';
        // make the start over button visible
        start_over_button.style.display = 'block';
        stats_button.style.display = 'block';

        if (pokeballsRemaining < 1){
            status.innerHTML = "Game Over!";
            gameStatus = "stop";
            let pokeballsRemaining = 5;
            let pokemonCaught = 0;
            console.log('gameover')
               
            // make all the grass transition back to their original graphic
            grass1.src = 'images/grass.png';
            grass2.src = 'images/grass.png';
            grass3.src = 'images/grass.png';
            // hide the play agian button
            play_again_button.style.display = 'none';
            //reset game stats
            pokeballsRemaining = 5;
            pokeballs_left_div.innerHTML = "Pokeballs: 5"
            pokemonCaught = 0;
            pokemon_caught_div.innerHTML = "Pokemon: 0"
            gate = 0;
            collectedItems = []
            gameState = 1;  
        }
    }
}
