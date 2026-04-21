const API_KEY = '7a98db423d6e3a5ee922a3e51a09d135';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Lista e filmave dhe serialeve për slider dhe rreshta
const MOVIES = [27205, 238, 155, 680, 13, 603, 769, 98, 597, 278];
const TV_SHOWS = [1396, 1399, 106459, 1402, 456];

async function fetchMovieById(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const data = await res.json();
    return {
        id: data.id, title: data.title, year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        poster: data.poster_path ? IMG_URL + data.poster_path : 'https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster',
        backdrop: data.backdrop_path ? BACKDROP_URL + data.backdrop_path : ''
    };
}

async function fetchTvById(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
    const data = await res.json();
    return {
        id: data.id, title: data.name, year: data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A',
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        poster: data.poster_path ? IMG_URL + data.poster_path : 'https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster',
        backdrop: data.backdrop_path ? BACKDROP_URL + data.backdrop_path : ''
    };
}

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="location.href='${item.type === 'tv' ? 'tv.html' : 'movie.html'}?id=${item.id}'">
            <img src="${item.poster}" alt="${item.title}">
            <h4>${item.title} (${item.year})</h4>
            <div class="rating">⭐ ${item.rating}/10</div>
        </div>
    `).join('');
}

async function loadMovies() {
    const trendingMovies = await Promise.all(MOVIES.slice(0,6).map(id => fetchMovieById(id)));
    trendingMovies.forEach(m => m.type = 'movie');
    renderRow('trendingRow', trendingMovies);
    
    const movies = await Promise.all(MOVIES.map(id => fetchMovieById(id)));
    movies.forEach(m => m.type = 'movie');
    renderRow('moviesRow', movies);
    
    const tvShows = await Promise.all(TV_SHOWS.map(id => fetchTvById(id)));
    tvShows.forEach(t => t.type = 'tv');
    renderRow('tvRow', tvShows);
}

// HERO SLIDER
async function loadHeroSlider() {
    const heroMovies = await Promise.all(MOVIES.slice(0,5).map(id => fetchMovieById(id)));
    const slidesContainer = document.getElementById('heroSlides');
    const dotsContainer = document.getElementById('heroDots');
    
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    heroMovies.forEach((movie, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.innerHTML = `<img src="${movie.backdrop}" alt="${movie.title}">`;
        slidesContainer.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    setInterval(() => { let next = (currentSlide + 1) % slides.length; goToSlide(next); }, 6000);
    
    window.goToSlide = goToSlide;
}

// KËRKIMI
async function searchTMDB(query) {
    if (!query || query.length < 2) { loadMovies(); return; }
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results.slice(0, 10).filter(item => item.media_type === 'movie' || item.media_type === 'tv').map(item => ({
        id: item.id, title: item.title || item.name, year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
        rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
        poster: item.poster_path ? IMG_URL + item.poster_path : 'https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster',
        type: item.media_type === 'tv' ? 'tv' : 'movie'
    }));
    renderRow('trendingRow', results);
    document.getElementById('moviesRow').innerHTML = '';
    document.getElementById('tvRow').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadHeroSlider();
    
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => searchTMDB(e.target.value.trim()), 500);
        });
    }
});

window.scrollToContent = () => {
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
};
