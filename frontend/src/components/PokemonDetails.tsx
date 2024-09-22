import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Pokemon } from '../types';

function PokemonDetails() {
    const { id } = useParams<{ id: string }>();
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPokemonDetails();
    }, [id]);

    const fetchPokemonDetails = async () => {
        try {
            const response = await axios.get<Pokemon>(`http://127.0.0.1:8080/pokemon/details/${id}`);
            setPokemonDetails(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="card mb-4">
            <img src={pokemonDetails?.image_url} className="card-img-top" alt={pokemonDetails?.name} />
            <div className="card-body">
                <h5 className="card-title">{pokemonDetails?.name}</h5>
                <p className="card-text"><strong>Category:</strong> {pokemonDetails?.category}</p>
                <p className="card-text"><strong>Weight:</strong> {pokemonDetails?.weight} kg</p>
                <p className="card-text"><strong>Height:</strong> {pokemonDetails?.height} m</p>
                <p className="card-text"><strong>Abilities:</strong> {pokemonDetails?.abilities.join(', ')}</p>
                <p className="card-text"><strong>Gender:</strong> {pokemonDetails?.gender.join(', ')}</p>
                <p className="card-text"><strong>Types:</strong> {pokemonDetails?.types.join(', ')}</p>
                <p className="card-text"><strong>Weaknesses:</strong> {pokemonDetails?.weaknesses.join(', ')}</p>

                <h6>Stats</h6>
                <ul>
                    {pokemonDetails && Object.entries(pokemonDetails.stats).map(([stat, value]) => (
                        <li key={stat}><strong>{stat}:</strong> {value}</li>
                    ))}
                </ul>

                <h6>Evolutions</h6>
                <ul>
                    {pokemonDetails?.evolutions.map(evolution => (
                        <li key={evolution}>{evolution}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PokemonDetails;
