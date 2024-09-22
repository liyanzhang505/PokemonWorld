import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Container, IconButton, Chip, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Male, Female } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Color mappings for types and weaknesses
const typeColors: { [key: string]: string } = {
    Grass: 'green',
    Poison: 'purple',
    Fire: 'red',
    Water: 'blue',
    Electric: 'yellow',
    Psychic: 'cyan',
    Ice: 'lightblue',
    Flying: 'skyblue',
    Bug: 'limegreen',
    Rock: 'gray',
    Ground: 'brown',
    Fairy: 'pink',
    Dragon: 'orange',
    Dark: 'darkgray',
    Steel: 'silver',
    Ghost: 'indigo'
};

const weaknessColors: { [key: string]: string } = {
    Fire: 'red',
    Ice: 'blue',
    Psychic: 'cyan',
    Flying: 'skyblue',
    Bug: 'limegreen',
    Poison: 'purple',
    Ground: 'brown',
    Rock: 'gray',
    Water: 'blue',
    Electric: 'yellow',
    Dark: 'darkgray',
    Fairy: 'pink'
};

interface PokemonDetails {
    id: number;
    name: string;
    category: string;
    weight: number;
    height: number;
    abilities: string[];
    gender: string[];
    types: string[];
    weaknesses: string[];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        'special-attack': number;
        'special-defense': number;
        speed: number;
    };
    image_url: string;
    evolutions: string[];  // Contains evolution chain
}

function PokemonDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Pokemon data on component mount or when `id` changes
    useEffect(() => {
        if (id) {
            axios.get<PokemonDetails>(`http://127.0.0.1:8080/pokemon/details/${id}`)
                .then(response => {
                    setPokemon(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching Pokémon details:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleNext = () => {
        if (id) {
            const nextId = parseInt(id) + 1;
            navigate(`/pokemon/${nextId}`);
        }
    };

    const handlePrevious = () => {
        if (id) {
            const previousId = parseInt(id) - 1;
            if (previousId > 0) {
                navigate(`/pokemon/${previousId}`);
            }
        }
    };

    // Display loading spinner while fetching data
    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (!pokemon) {
        return <p>Pokémon details not found.</p>;
    }

    // Data for rendering stats as a bar chart
    const statsData = {
        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [{
            label: 'Stats',
            data: [pokemon.stats.hp, pokemon.stats.attack, pokemon.stats.defense, pokemon.stats['special-attack'], pokemon.stats['special-defense'], pokemon.stats.speed],
            backgroundColor: ['#4caf50', '#ff7043', '#29b6f6', '#d4e157', '#9c27b0', '#ffeb3b'],
            barThickness: 20
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    // Helper to render male/female icons or 'Genderless'
    const renderGenderIcons = (gender: string[]) => {
        const hasMale = gender.includes('Male');
        const hasFemale = gender.includes('Female');

        return (
            <>
                {hasMale && <><Male style={{ color: 'blue' }} /> </>}
                {hasFemale && <><Female style={{ color: 'red' }} /></>}
                {!hasMale && !hasFemale && <Typography variant="body1">Genderless</Typography>}
            </>
        );
    };

    // Render evolution chain
    const renderEvolutions = () => {
        return (
            <Box display="flex" flexWrap="wrap" mt={2}>
                <Typography variant="h6" gutterBottom>Evolutions:</Typography>
                {pokemon.evolutions.map((evolution) => (
                    <Chip
                        key={evolution}
                        label={evolution}
                        clickable
                        onClick={() => navigate(`/pokemon/${evolution}`)}  // Navigate to the clicked evolution's details page
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                    />
                ))}
            </Box>
        );
    };

    return (
        <Container>
            <Card>
                <Grid container>
                    {/* Left side: Image + navigation arrows */}
                    <Grid item xs={12} md={4} style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton
                            onClick={handlePrevious}
                            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', animation: 'blinker 1.5s infinite' }}
                        >
                            <ChevronLeft fontSize="large" />
                        </IconButton>

                        <CardMedia
                            component="img"
                            image={pokemon.image_url}
                            alt={pokemon.name}
                            style={{ padding: '20px', maxWidth: '100%' }}
                        />

                        <IconButton
                            onClick={handleNext}
                            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', animation: 'blinker 1.5s infinite' }}
                        >
                            <ChevronRight fontSize="large" />
                        </IconButton>
                    </Grid>

                    {/* Right side: Information */}
                    <Grid item xs={12} md={8}>
                        <CardContent>
                            <Typography variant="h4" component="h1" gutterBottom>
                                #{pokemon.id.toString().padStart(4, '0')} {pokemon.name}
                            </Typography>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                {pokemon.category}
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                Height: {pokemon.height}m | Weight: {pokemon.weight}kg
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                Abilities: {pokemon.abilities.join(', ')}
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                Gender: {renderGenderIcons(pokemon.gender)}
                            </Typography>

                            {/* Types */}
                            <Box display="flex" flexWrap="wrap" mb={2}>
                                <Typography variant="h6">Types:</Typography>
                                {pokemon.types.map(type => (
                                    <Chip
                                        key={type}
                                        label={type}
                                        style={{
                                            marginLeft: '8px',
                                            backgroundColor: typeColors[type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()] || 'gray',
                                            color: 'white'
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Weaknesses */}
                            <Box display="flex" flexWrap="wrap" mb={2}>
                                <Typography variant="h6">Weaknesses:</Typography>
                                {pokemon.weaknesses.map(weakness => (
                                    <Chip
                                        key={weakness}
                                        label={weakness}
                                        style={{
                                            marginLeft: '8px',
                                            backgroundColor: weaknessColors[weakness.charAt(0).toUpperCase() + weakness.slice(1).toLowerCase()] || 'gray',
                                            color: 'white'
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Evolutions */}
                            {renderEvolutions()}

                            {/* Stats */}
                            <Typography variant="h6" gutterBottom>Stats</Typography>
                            <Box style={{ width: '100%', maxWidth: '400px', margin: '0', paddingTop: '20px' }}>
                                <Bar data={statsData} options={chartOptions} />
                            </Box>

                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
}

export default PokemonDetailsPage;
