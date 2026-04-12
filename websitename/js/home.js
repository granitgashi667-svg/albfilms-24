// ==================== TMDB CONFIG ====================
const API_KEY = '7a98db423d6e3a5ee922a3e51a09d135';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// ==================== LISTA E FILMAVE DHE SERIALEVE ====================
// Ti shton VETËM ID-të këtu! (ID-të i gjen në TMDB)
const MY_MOVIES = [27205, 155, 49026, 238, 680, 603, 13];
const MY_TV_SHOWS = [1396, 1399, 106459, 1402, 456];
const TRENDING_ITEMS = [27205, 155, 1396, 49026, 238, 1399];

// ==================== FUNKSIONET ====================
async function fetchMovieById(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return {
        id: data.id,
        title: data.title,
        year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
        rating: data.vote_average,
        poster: data.poster_path ? IMG_URL + data.poster_path : 'https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster',
        overview: data.overview || 'No description available.',
        type: 'movie'
    };
}

async function fetchTvById(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return {
        id: data.id,
        title: data.name,
        year: data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A',
        rating: data.vote_average,
        poster: data.poster_path ? IMG_URL + data.poster_path : 'https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster',
        overview: data.overview || 'No description available.',
        type: 'tv'
    };
}

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="alert('${item.title} (${item.year})\\nRating: ⭐ ${item.rating}/10\\n\\n${item.overview.substring(0, 100)}...')">
            <img src="${item.poster}" alt="${item.title}">
            <h4>${item.title} (${item.year})</h4>
            <p style="color:#e50914; font-size:0.8rem; margin-top:5px;">⭐ ${item.rating}/10</p>
        </div>
    `).join('');
}

// ==================== NGARKIMI ====================
async function loadAll() {
    // Trending
    const trendingMovies = await Promise.all(TRENDING_ITEMS.map(id => fetchMovieById(id).catch(e => null)));
    renderRow('trendingRow', trendingMovies.filter(m => m !== null));
    
    // Movies
    const movies = await Promise.all(MY_MOVIES.map(id => fetchMovieById(id).catch(e => null)));
    renderRow('moviesRow', movies.filter(m => m !== null));
    
    // TV Shows
    const tvShows = await Promise.all(MY_TV_SHOWS.map(id => fetchTvById(id).catch(e => null)));
    renderRow('tvRow', tvShows.filter(t => t !== null));
}

// ==================== KËRKIMI ====================
async function searchTMDB(query) {
    if (!query) return [];
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results.slice(0, 10).map(item => ({
        id: item.id,
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
        rating: item.vote_average,
        poster: item.poster_path ? IMG_URL + item.poster_path : null,
        overview: item.overview,
        type: item.media_type
    }));
}

// ==================== EVENTET ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAll();
    
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', async (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    const results = await searchTMDB(query);
                    renderRow('trendingRow', results);
                } else if (query.length === 0) {
                    loadAll();
                }
            }, 500);
        });
    }
});

// Dropdown për zhanret
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Genre filtering will be available soon!');
    });
});
