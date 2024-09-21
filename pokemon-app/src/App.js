import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonData = response.data.results;

        const updatedPokemonData = await Promise.all(
          pokemonData.map(async (pokemon) => {
            const pokeDetails = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: pokeDetails.data.sprites.front_default,
            };
          })
        );
        setPokemonList(updatedPokemonData);
      } catch (error) {
        console.error('Error fetching Pokémon data', error);
      }
    };
    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Pokémon List</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <div className="pokemon-card" key={pokemon.name}>
            <img src={pokemon.image} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
