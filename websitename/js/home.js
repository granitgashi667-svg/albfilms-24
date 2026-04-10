// ==================== TMDB CONFIG ====================
const API_KEY = 'YOUR_TMDB_API_KEY'; // <--- VENDOS API KEY TUAJ KETU
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// ==================== VARIABLES ====================
let currentBannerIndex = 0;
let bannerInterval;
let currentSearchTimeout;

// ==================== FETCH ====================
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { results: [] };
  }
}

// ==================== BANNER ====================
async function loadBanner() {
  const data = await fetchData('/trending/all/week');
  const slidesContainer = document.getElementById('banner-slides');
  const dotsContainer = document.getElementById('banner-dots');
  
  if (!slidesContainer || !dotsContainer) return;
  
  slidesContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  data.results.slice(0, 5).forEach((item, index) => {
    // Slide
    const slide = document.createElement('div');
    slide.className = 'banner-slide';
    slide.innerHTML = `
      <img src="${BACKDROP_URL + item.backdrop_path}" alt="${item.title || item.name}">
      <div class="banner-info">
        <h2>${item.title || item.name}</h2>
        <p>${item.overview?.substring(0, 140) || 'No description available'}...</p>
        <button class="watch-btn" onclick="openModalFromItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
          <i class="fas fa-play"></i> Watch Now
        </button>
      </div>
    `;
    slidesContainer.appendChild(slide);
    
    // Dot
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  updateDots();
  startAutoSlide();
}

function goToSlide(index) {
  currentBannerIndex = index;
  const slides = document.querySelector('.banner-slides');
  if (slides) slides.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentBannerIndex);
  });
}

function startAutoSlide() {
  if (bannerInterval) clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    const total = document.querySelectorAll('.banner-slide').length;
    if (total === 0) return;
    currentBannerIndex = (currentBannerIndex + 1) % total;
    const slides = document.querySelector('.banner-slides');
    if (slides) slides.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
    updateDots();
  }, 6000);
}

// ==================== ROWS ====================
async function loadRows() {
  const movies = await fetchData('/trending/movie/week');
  const tvShows = await fetchData('/trending/tv/week');
  const anime = await fetchData('/discover/tv?with_genres=16'); // Anime genre ID = 16
  
  renderRow('movies-list', movies.results.slice(0, 12));
  renderRow('tvshows-list', tvShows.results.slice(0, 12));
  renderRow('anime-list', anime.results.slice(0, 12));
}

function renderRow(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">
      <h4>${item.title || item.name}</h4>
    `;
    card.addEventListener('click', () => openModal(item));
    container.appendChild(card);
  });
}

// ==================== MODAL ====================
function openModal(item) {
  const isTV = item.first_air_date !== undefined;
  document.getElementById('modal-title').innerText = item.title || item.name;
  document.getElementById('modal-description').innerText = item.overview || 'No description available.';
  document.getElementById('modal-image').src = IMG_URL + item.poster_path;
  document.getElementById('modal-date').innerText = item.release_date || item.first_air_date || 'Unknown';
  document.getElementById('modal-genres').innerText = 'Loading...';
  document.getElementById('modal-rating').innerHTML = '⭐ ' + (item.vote_average ? item.vote_average.toFixed(1) : 'N/A') + '/10';
  
  const watchBtn = document.getElementById('watch-btn');
  watchBtn.href = `watch.html?id=${item.id}&type=${isTV ? 'tv' : 'movie'}`;
  
  // Fetch genres
  const type = isTV ? 'tv' : 'movie';
  fetchData(`/${type}/${item.id}`).then(detail => {
    if (detail.genres) {
      document.getElementById('modal-genres').innerText = detail.genres.map(g => g.name).join(', ');
    }
  });
  
  document.getElementById('modal').style.display = 'flex';
}

function openModalFromItem(item) {
  openModal(item);
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// ==================== SEARCH ====================
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value.trim();
  const resultsContainer = document.getElementById('search-results');
  
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  const data = await fetchData(`/search/multi?query=${encodeURIComponent(query)}`);
  resultsContainer.innerHTML = '';
  
  data.results.slice(0, 10).forEach(item => {
    if (!item.media_type) return;
    const resultItem = document.createElement('div');
    resultItem.className = 'search-item';
    resultItem.innerHTML = `
      <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">
      <div class="search-item-info">
        <h4>${item.title || item.name}</h4>
        <p>${item.media_type === 'movie' ? 'Movie' : 'TV Show'} • ${item.release_date || item.first_air_date || 'Unknown'}</p>
      </div>
    `;
    resultItem.addEventListener('click', () => {
      closeSearchModal();
      openModal(item);
    });
    resultsContainer.appendChild(resultItem);
  });
}

// ==================== SLIDER ====================
function setupSliderArrows() {
  document.querySelectorAll('.slider-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const rowId = btn.getAttribute('data-row');
      const container = document.getElementById(rowId);
      if (!container) return;
      const direction = btn.classList.contains('right') ? 300 : -300;
      container.scrollBy({ left: direction, behavior: 'smooth' });
    });
  });
  
  document.getElementById('banner-prev')?.addEventListener('click', () => {
    const total = document.querySelectorAll('.banner-slide').length;
    if (total === 0) return;
    currentBannerIndex = (currentBannerIndex - 1 + total) % total;
    goToSlide(currentBannerIndex);
  });
  
  document.getElementById('banner-next')?.addEventListener('click', () => {
    const total = document.querySelectorAll('.banner-slide').length;
    if (total === 0) return;
    currentBannerIndex = (currentBannerIndex + 1) % total;
    goToSlide(currentBannerIndex);
  });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadBanner();
  loadRows();
  setupSliderArrows();
  
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(currentSearchTimeout);
      currentSearchTimeout = setTimeout(searchTMDB, 500);
    });
  }
});

// Expose global functions
window.openModalFromItem = openModalFromItem;
window.closeModal = closeModal;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.searchTMDB = searchTMDB;
