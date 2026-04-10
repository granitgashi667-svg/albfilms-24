// ==================== TË DHËNA DEMO (5 FILMA + 1 SERIAL NARCOS) ====================

const demoMovies = [
  { id: 1, title: "Inception", year: "2010", rating: 8.8, poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", overview: "A thief who steals corporate secrets through dream-sharing technology." },
  { id: 2, title: "The Dark Knight", year: "2008", rating: 9.0, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview: "Batman faces the Joker, a criminal mastermind." },
  { id: 3, title: "Interstellar", year: "2014", rating: 8.6, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", overview: "A team of explorers travel through a wormhole in space." },
  { id: 4, title: "The Godfather", year: "1972", rating: 9.2, poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", overview: "The aging patriarch of an organized crime dynasty transfers control to his son." },
  { id: 5, title: "Pulp Fiction", year: "1994", rating: 8.9, poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", overview: "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine." }
];

const demoTvShows = [
  { id: 6, title: "Breaking Bad", year: "2008", rating: 9.5, poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", overview: "A high school chemistry teacher turned methamphetamine producer." },
  { id: 7, title: "Stranger Things", year: "2016", rating: 8.7, poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg", overview: "A group of kids uncover supernatural mysteries in their town." }
];

const popularSeries = [
  { id: 8, title: "Narcos", year: "2015", rating: 8.8, poster: "https://image.tmdb.org/t/p/w500/8WrWjJkzP6ZvK7j8QnL9mKxYz5V.jpg", overview: "The story of Pablo Escobar, the notorious Colombian drug lord.", isSeries: true, seasons: 3 }
];

// Episodet per Narcos (Season 1 - 10 episodes)
const narcosEpisodes = [
  { episode: 1, title: "Descenso", duration: "49 min" },
  { episode: 2, title: "The Sword of Simón Bolívar", duration: "52 min" },
  { episode: 3, title: "The Men of Always", duration: "48 min" },
  { episode: 4, title: "The Palace in Flames", duration: "51 min" },
  { episode: 5, title: "There Will Be a Future", duration: "50 min" },
  { episode: 6, title: "Explosivos", duration: "47 min" },
  { episode: 7, title: "You Will Cry Tears of Blood", duration: "53 min" },
  { episode: 8, title: "La Gran Mentira", duration: "49 min" },
  { episode: 9, title: "La Catedral", duration: "52 min" },
  { episode: 10, title: "Despegue", duration: "55 min" }
];

// ==================== FUNKSIONET ====================

function renderRow(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${item.poster}" alt="${item.title}" onerror="this.src='https://placehold.co/500x750/1a1a1a/e50914?text=${item.title}'">
      <h4>${item.title} (${item.year})</h4>
    `;
    card.addEventListener('click', () => openModal(item));
    container.appendChild(card);
  });
}

function loadBanner() {
  const slidesContainer = document.getElementById('banner-slides');
  const dotsContainer = document.getElementById('banner-dots');
  if (!slidesContainer) return;
  
  const bannerItems = [...demoMovies.slice(0, 3), ...demoTvShows.slice(0, 2)];
  
  slidesContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  bannerItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'banner-slide';
    slide.innerHTML = `
      <img src="${item.poster}" alt="${item.title}">
      <div class="banner-info">
        <h2>${item.title}</h2>
        <p>${item.overview.substring(0, 120)}...</p>
        <button class="watch-btn" onclick="openModalFromId(${item.id})"><i class="fas fa-play"></i> Watch Now</button>
      </div>
    `;
    slidesContainer.appendChild(slide);
    
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  updateDots(0);
  startAutoSlide();
}

let currentBannerIndex = 0;
let bannerInterval;

function goToSlide(index) {
  currentBannerIndex = index;
  const slides = document.querySelector('.banner-slides');
  if (slides) slides.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
  updateDots(currentBannerIndex);
}

function updateDots(activeIndex) {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex);
  });
}

function startAutoSlide() {
  if (bannerInterval) clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    const total = document.querySelectorAll('.banner-slide').length;
    if (total === 0) return;
    currentBannerIndex = (currentBannerIndex + 1) % total;
    goToSlide(currentBannerIndex);
  }, 6000);
}

function openModal(item) {
  document.getElementById('modal-title').innerText = item.title;
  document.getElementById('modal-description').innerText = item.overview || 'No description available.';
  document.getElementById('modal-image').src = item.poster;
  document.getElementById('modal-rating').innerHTML = '⭐ ' + item.rating + '/10';
  
  const watchBtn = document.getElementById('watch-btn');
  
  if (item.isSeries) {
    // Per serialet, shfaq episodet ne console dhe alert
    watchBtn.onclick = (e) => {
      e.preventDefault();
      let episodeList = "Episodet:\n";
      narcosEpisodes.forEach(ep => {
        episodeList += `${ep.episode}. ${ep.title} (${ep.duration})\n`;
      });
      alert(item.title + "\n" + episodeList + "\n(Kliko Watch per episodin e pare ne versionin real)");
    };
  } else {
    watchBtn.onclick = (e) => {
      e.preventDefault();
      alert(`Demo: ${item.title}\nKetu do te luhet filmi ne versionin real.`);
    };
  }
  
  document.getElementById('modal').style.display = 'flex';
}

function openModalFromId(id) {
  const allItems = [...demoMovies, ...demoTvShows, ...popularSeries];
  const item = allItems.find(i => i.id === id);
  if (item) openModal(item);
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
}

function searchItems() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const resultsContainer = document.getElementById('search-results');
  const allItems = [...demoMovies, ...demoTvShows, ...popularSeries];
  
  const filtered = allItems.filter(item => item.title.toLowerCase().includes(query));
  
  resultsContainer.innerHTML = '';
  filtered.forEach(item => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-item';
    resultItem.innerHTML = `
      <img src="${item.poster}" alt="${item.title}">
      <div class="search-item-info">
        <h4>${item.title}</h4>
        <p>${item.year} • ⭐ ${item.rating}</p>
      </div>
    `;
    resultItem.addEventListener('click', () => {
      closeSearchModal();
      openModal(item);
    });
    resultsContainer.appendChild(resultItem);
  });
}

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

// Inicializimi
document.addEventListener('DOMContentLoaded', () => {
  renderRow('movies-list', demoMovies);
  renderRow('tvshows-list', demoTvShows);
  renderRow('popular-series', popularSeries);
  loadBanner();
  setupSliderArrows();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', searchItems);
  }
});

// Ekspozo funksionet globalisht
window.openModalFromId = openModalFromId;
window.closeModal = closeModal;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.searchItems = searchItems;
