const API_KEY = '7a98db423d6e3a5ee922a3e51a09d135';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// ==================== TMDB DATA ====================
const MOVIES = [27205, 238, 155, 680, 13, 603, 769, 98, 597, 278];
const TV_SHOWS = [1396, 1399, 106459, 1402, 456];

// ==================== FILMAT E TU ====================
const customMovies = [
    { 
        id: "c1",
        title: "14 Days (Girlfriend Intlo) 2025", 
        slug: "https://short.icu/YYmY8Qy-M", 
        type: "abyss",
        poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        year: "2025", 
        rating: "7.2" 
    },
    { 
        id: "c2",
        title: "https://short.icu/44qkCuGWS", 
        slug: "44qkCuGWS", 
        type: "abyss",
        poster: "https://image.tmdb.org/t/p/w500/5Eip60UDiPLASyKjmH9ruTcTfL.jpg",
        year: "2024", 
        rating: "6.8" 
    }
];

// ==================== FETCH ====================
async function fetchMovieById(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    return {
        id: data.id,
        title: data.title,
        year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        poster: data.poster_path ? IMG_URL + data.poster_path : '',
        backdrop: data.backdrop_path ? BACKDROP_URL + data.backdrop_path : ''
    };
}

async function fetchTvById(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    return {
        id: data.id,
        title: data.name,
        year: data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A',
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        poster: data.poster_path ? IMG_URL + data.poster_path : '',
        backdrop: data.backdrop_path ? BACKDROP_URL + data.backdrop_path : ''
    };
}

// ==================== RENDER ====================
function renderRow(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="movie-card"
            onclick="location.href='${type === 'tv' ? 'tv.html' : 'movie.html'}?id=${item.id}'">
            <img src="${item.poster}">
            <h4>${item.title} (${item.year})</h4>
            <div class="rating">⭐ ${item.rating}/10</div>
        </div>
    `).join('');
}

// ==================== CUSTOM (KRYESORJA) ====================
function renderCustomRow() {
    const container = document.getElementById('customRow');
    if (!container) return;

    container.innerHTML = customMovies.map(movie => `
        <div class="movie-card"
            onclick="window.location.href='watch.html?slug=${movie.slug}&type=${movie.type}&title=${encodeURIComponent(movie.title)}'">
            
            <img src="${movie.poster}">
            <h4>${movie.title} (${movie.year})</h4>
            <div class="rating">⭐ ${movie.rating}/10</div>
        </div>
    `).join('');
}

// ==================== LOAD ====================
async function loadMovies() {
    const trending = await Promise.all(MOVIES.slice(0,6).map(fetchMovieById));
    renderRow('trendingRow', trending, 'movie');

    const movies = await Promise.all(MOVIES.map(fetchMovieById));
    renderRow('moviesRow', movies, 'movie');

    const tv = await Promise.all(TV_SHOWS.map(fetchTvById));
    renderRow('tvRow', tv, 'tv');
}

// ==================== HERO ====================
async function loadHeroSlider() {
    const heroMovies = await Promise.all(MOVIES.slice(0,5).map(fetchMovieById));

    const slidesContainer = document.getElementById('heroSlides');
    const dotsContainer = document.getElementById('heroDots');

    if (!slidesContainer || !dotsContainer) return;

    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    heroMovies.forEach((movie, index) => {
        slidesContainer.innerHTML += `
            <div class="hero-slide">
                <img src="${movie.backdrop}">
            </div>
        `;

        dotsContainer.innerHTML += `<div class="dot" onclick="goToSlide(${index})"></div>`;
    });

    let current = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');

    function goToSlide(i) {
        slides[current]?.classList.remove('active');
        dots[current]?.classList.remove('active');

        current = i;

        slides[current]?.classList.add('active');
        dots[current]?.classList.add('active');

        slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    }

    window.goToSlide = goToSlide;

    if (slides[0]) slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');

    setInterval(() => {
        let next = (current + 1) % slides.length;
        goToSlide(next);
    }, 6000);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadHeroSlider();
    renderCustomRow();
});
