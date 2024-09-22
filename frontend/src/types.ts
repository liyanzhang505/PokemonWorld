export interface Pokemon {
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
    evolutions: string[];
}

export interface PokemonListResponse {
    page: number;
    page_size: number;
    total_pages: number;
    data: Pokemon[];
}
