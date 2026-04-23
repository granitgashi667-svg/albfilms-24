const API_KEY = '7a98db423d6e3a5ee922a3e51a09d135';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Filmat nga TMDB
const MOVIES = [27205, 238, 155, 680, 13, 603, 769, 98, 597, 278];
const TV_SHOWS = [1396, 1399, 106459, 1402, 456];

// Filmat nga Abyss (me slug dhe poster placeholder)
const customMovies = [
    { id: "custom_1", title: "14 Days (Girlfriend Intlo) 2025", slug: "YYmY8Qy-M", poster: "https://placehold.co/300x450/1a1a1a/e50914?text=14+Days", year: "2025", rating: "N/A" },
    { id: "custom_2", title: "Believe: The Ultimate Battle", slug: "44qkCuGWS", poster: "https://placehold.co/300x450/1a1a1a/e50914?text=Believe", year: "2024", rating: "N/A" }
];

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

function renderRow(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="location.href='${type === 'tv' ? 'tv.html' : 'movie.html'}?id=${item.id}'">
            <img src="${item.poster}" alt="${item.title}">
            <h4>${item.title} (${item.year})</h4>
            <div class="rating">⭐ ${item.rating}/10</div>
        </div>
    `).join('');
}

function renderCustomRow() {
    const container = document.getElementById('customRow');
    if (!container) return;
    container.innerHTML = customMovies.map(movie => `
        <div class="movie-card" onclick="location.href='watch.html?id=${movie.slug}&title=${encodeURIComponent(movie.title)}'">
            <img src="${movie.poster}" alt="${movie.title}">
            <h4>${movie.title} (${movie.year})</h4>
            <div class="rating">⭐ ${movie.rating}/10</div>
        </div>
    `).join('');
}

async function loadMovies() {
    const trendingMovies = await Promise.all(MOVIES.slice(0,6).map(id => fetchMovieById(id)));
    renderRow('trendingRow', trendingMovies, 'movie');
    const movies = await Promise.all(MOVIES.map(id => fetchMovieById(id)));
    renderRow('moviesRow', movies, 'movie');
    const tvShows = await Promise.all(TV_SHOWS.map(id => fetchTvById(id)));
    renderRow('tvRow', tvShows, 'tv');
}

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
    if (slides[0]) slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
    setInterval(() => { let next = (currentSlide + 1) % slides.length; goToSlide(next); }, 6000);
    window.goToSlide = goToSlide;
}

async function loadMovieDetails(id) {
    const movie = await fetchMovieById(id);
    document.title = `${movie.title} - AlbFilms24`;
    document.getElementById('movieTitle').innerText = movie.title;
    document.getElementById('movieYear').innerHTML = `<i class="fas fa-calendar"></i> ${movie.year}`;
    document.getElementById('movieRating').innerHTML = `<i class="fas fa-star"></i> ${movie.rating}/10`;
    document.getElementById('movieRuntime').innerHTML = `<i class="fas fa-clock"></i> N/A`;
    document.getElementById('movieOverview').innerText = movie.overview || "Përshkrimi nuk është i disponueshëm për këtë film.";
    document.getElementById('movieGenres').innerHTML = `<span class="genre-tag">Aksion</span><span class="genre-tag">Dramë</span>`;
    document.getElementById('moviePoster').src = movie.poster;
    document.getElementById('movieBackdrop').style.backgroundImage = `linear-gradient(90deg, #0a0a0a 0%, transparent 70%), url(${movie.backdrop})`;
    document.getElementById('watchBtn').onclick = () => { window.location.href = `watch.html?id=${id}`; };
}
window.loadMovieDetails = loadMovieDetails;

document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadHeroSlider();
    renderCustomRow();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert('Kërkimi do të funksionojë në versionin e ardhshëm!');
            }
        });
    }
    document.getElementById('exploreBtn')?.addEventListener('click', () => {
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });
});
