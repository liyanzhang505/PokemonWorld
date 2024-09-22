import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Container, IconButton, Chip, Box, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, Male, Female } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { PokemonDetails } from '../types';

// Color mappings for types and weaknesses
const typeColors: { [key: string]: string } = {
    Grass: 'green',
    Poison: 'purple',
    Fire: 'red',
    Water: 'blue',
    Electric: 'orange',
    Psychic: 'darkviolet',
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
    Psychic: 'darkviolet',
    Flying: 'skyblue',
    Bug: 'limegreen',
    Poison: 'purple',
    Ground: 'brown',
    Rock: 'gray',
    Water: 'blue',
    Electric: 'orange',
    Dark: 'darkgray',
    Fairy: 'pink'
};

// Render the information in a card-like box with a blue background
const renderInfoCard = (pokemon: PokemonDetails) => {
    return (
        <Paper elevation={3} style={{ backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '10px', marginBottom: '16px', maxWidth: '450px' }}>
            <Typography variant="h6" gutterBottom style={{ color: '#1565c0' }}>
                {pokemon.category}
            </Typography>
            <Box>
                <Typography variant="body1">Height: {pokemon.height}m</Typography>
                <Typography variant="body1">Weight: {pokemon.weight}kg</Typography>
                <Typography variant="body1">Abilities: {pokemon.abilities.join(', ')}</Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="body1" style={{ marginRight: '8px' }}>Gender:</Typography>
                    {renderGenderIcons(pokemon.gender)}
                </Box>
            </Box>
        </Paper>
    );
};

// render male and female icons with a '|' separator
const renderGenderIcons = (gender: string[]) => {
    const hasMale = gender.includes('male');
    const hasFemale = gender.includes('female');

    return (
        <Box display="flex" alignItems="center">
            {hasMale && <><Male style={{ color: 'blue' }} /> </>}
            {hasMale && hasFemale && <span style={{ margin: '0 8px' }}>|</span>}
            {hasFemale && <><Female style={{ color: 'red' }} /></>}
            {!hasMale && !hasFemale && <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>Genderless</Typography>}
        </Box>
    );
};

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

    // Render evolution chain
    const renderEvolutions = () => {
        return (
            <Box display="flex" flexWrap="wrap" mt={2}>
                <Typography variant="h6" gutterBottom>Evolutions:</Typography>
                {pokemon.evolutions.map((evolution, index) => (
                    <Box key={evolution.id} display="flex" flexDirection="column" alignItems="center" style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => navigate(`/pokemon/${evolution.id}`)}>
                        <img src={evolution.image_url} alt={evolution.name} style={{ width: '80px', height: '80px' }} />
                        <Typography variant="body2">#{evolution.id.padStart(4, '0')} {evolution.name}</Typography>
                        {/*{index < pokemon.evolutions.length - 1 && <Typography variant="body2"> {'>>'} </Typography>}  /!* Display arrow for evolution *!/*/}
                    </Box>
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

                            {renderInfoCard(pokemon)}

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
