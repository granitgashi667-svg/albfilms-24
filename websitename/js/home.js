// TË DHËNA DEMO
const movies = [
    { id: 1, title: "Inception", year: "2010", rating: 8.8, poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", type: "movie" },
    { id: 2, title: "The Dark Knight", year: "2008", rating: 9.0, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", type: "movie" },
    { id: 3, title: "Interstellar", year: "2014", rating: 8.6, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", type: "movie" },
    { id: 4, title: "The Godfather", year: "1972", rating: 9.2, poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", type: "movie" },
    { id: 5, title: "Breaking Bad", year: "2008", rating: 9.5, poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", type: "tv" },
    { id: 6, title: "Stranger Things", year: "2016", rating: 8.7, poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg", type: "tv" },
    { id: 7, title: "Narcos", year: "2015", rating: 8.8, poster: "https://image.tmdb.org/t/p/w500/8WrWjJkzP6ZvK7j8QnL9mKxYz5V.jpg", type: "tv" }
];

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="alert('${item.title} - Watch now (Demo)')">
            <img src="${item.poster}" alt="${item.title}">
            <h4>${item.title} (${item.year})</h4>
        </div>
    `).join('');
}

// Inicializimi
document.addEventListener('DOMContentLoaded', () => {
    renderRow('trendingRow', movies.slice(0, 6));
    renderRow('moviesRow', movies.filter(m => m.type === 'movie').slice(0, 4));
    renderRow('tvRow', movies.filter(m => m.type === 'tv').slice(0, 3));
});

// Kërkimi
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = movies.filter(m => m.title.toLowerCase().includes(query));
        renderRow('trendingRow', filtered.slice(0, 6));
    });
}

// Filtrimi sipas zhanrit (Demo)
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const genre = link.getAttribute('data-genre');
        alert(`Filtering by ${genre} (Demo) - Will work with real API later`);
    });
});
