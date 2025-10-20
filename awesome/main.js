// Utilities and state
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const state = {
  page: 1,
  perPage: 24,
  query: '',
  sort: 'best', // best | stars | updated
  lang: '',
  loading: false,
  items: [],
  favorites: new Set(JSON.parse(localStorage.getItem('favorites') || '[]')),
  token: localStorage.getItem('gh_token') || ''
};

const list = $('#list');
const loadingEl = $('#loading');
const loadMoreBtn = $('#load-more');
const categoriesEl = $('#categories');
const detailsDlg = $('#details');
const detailsBody = $('#details-body');
const detailsTitle = $('#details-title');

function setBusy(isBusy) {
  $('#results').setAttribute('aria-busy', String(isBusy));
  loadingEl.classList.toggle('hidden', !isBusy);
}

function saveFavs() {
  localStorage.setItem('favorites', JSON.stringify([...state.favorites]));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render cards
function renderItems(items, append = false) {
  if (!append) {
    list.innerHTML = '';
  }
  const frag = document.createDocumentFragment();
  for (const it of items) {
    const fullName = escapeHtml(it.full_name);
    const desc = escapeHtml(it.description || '');
    const language = escapeHtml(it.language || '');

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3><a target="_blank" rel="noopener" href="https://github.com/${fullName}">${fullName}</a></h3>
      <div class="muted">${desc}</div>
      <div class="row">
        <span class="pill">⭐ ${it.stargazers_count ?? ''}</span>
        ${language ? `<span class="pill">${language}</span>` : ''}
        <button class="button fav" data-repo="${fullName}">${state.favorites.has(it.full_name) ? '★' : '☆'}</button>
        <button class="button details" data-repo="${fullName}">Details</button>
      </div>`;
    frag.appendChild(card);
  }
  list.appendChild(frag);
}

// GitHub API
const GITHUB_SEARCH = 'https://api.github.com/search/repositories';

function buildQuery() {
  const base = ['topic:awesome'];
  if (state.query) base.push(state.query);
  if (state.lang) base.push(`language:${state.lang}`);
  return base.join(' ');
}

async function search(page = 1) {
  if (state.loading) return;
  state.loading = true;
  setBusy(true);
  loadMoreBtn.classList.add('hidden');
  try {
    const params = new URLSearchParams({
      q: buildQuery(),
      per_page: String(state.perPage),
      page: String(page),
      sort: state.sort === 'stars' ? 'stars' : state.sort === 'updated' ? 'updated' : '',
      order: 'desc'
    });
    if (!params.get('sort')) params.delete('sort');

    const headers = { 'Accept': 'application/vnd.github+json' };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

    const res = await fetch(`${GITHUB_SEARCH}?${params}`, { headers });
    const remaining = res.headers.get('X-RateLimit-Remaining');
    if (res.status === 403 || remaining === '0') {
      console.warn('Rate limited by GitHub API');
    }
    const data = await res.json();
    const items = (data.items || []).filter(r => /awesome/i.test(r.name) || (Array.isArray(r.topics) && r.topics.includes('awesome')));

    state.items = page === 1 ? items : [...state.items, ...items];
    renderItems(items, page !== 1);

    loadMoreBtn.classList.toggle('hidden', items.length < state.perPage);
  } catch (e) {
    console.error(e);
  } finally {
    state.loading = false;
    setBusy(false);
  }
}

// Details fetch
async function loadDetails(fullName) {
  try {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

    const repoRes = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
    const repo = await repoRes.json();

    const readmeRes = await fetch(`https://api.github.com/repos/${fullName}/readme`, { headers });
    let md = '';
    if (readmeRes.ok) {
      const readme = await readmeRes.json();
      if (readme?.content) {
        try {
          md = atob(readme.content.replace(/\n/g, ''));
          // Limit render size
          md = md.slice(0, 20000);
        } catch {}
      }
    }
    showDetails(repo, md);
  } catch (e) {
    console.error(e);
  }
}

function mdToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(?:<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
}

function showDetails(repo, md) {
  detailsTitle.textContent = repo.full_name || 'Details';
  const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 6) : [];
  const topicPills = topics.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join(' ');
  const language = repo.language ? `<span class=\"pill\">${escapeHtml(repo.language)}</span>` : '';

  detailsBody.innerHTML = `
    <div class="details-row">
      <span class="pill">⭐ ${repo.stargazers_count ?? ''}</span>
      <span class="pill">🍴 ${repo.forks_count ?? ''}</span>
      ${language}
      ${topicPills}
    </div>
    <p class="muted">${escapeHtml(repo.description || '')}</p>
    <p><a class="button" target="_blank" rel="noopener" href="${escapeHtml(repo.html_url)}">Open on GitHub</a></p>
    <h3>README</h3>
    <div class="readme">${mdToHtml(md)}</div>`;
  detailsDlg.showModal();
}

// Categories from sindresorhus/awesome
async function loadCategories() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md', {
      headers: { 'Accept': 'text/plain' }
    });
    const md = await res.text();
    // First 30 categories under Contents
    const cats = Array.from(md.matchAll(/^\* \[(.+?)\]\((#.+?)\)/gm))
      .slice(0, 30)
      .map((m) => ({ name: m[1], anchor: m[2] }));
    categoriesEl.innerHTML = cats
      .map((c) => `<a class="pill" href="https://github.com/sindresorhus/awesome${c.anchor}" target="_blank" rel="noopener">${escapeHtml(c.name)}</a>`) 
      .join(' ');
  } catch (e) {
    console.error(e);
  }
}

// Events
$('#search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  state.page = 1;
  state.query = $('#q').value.trim();
  state.sort = $('#sort').value;
  state.lang = $('#lang').value;
  search(1);
});

loadMoreBtn.addEventListener('click', () => {
  state.page += 1;
  search(state.page);
});

list.addEventListener('click', (e) => {
  const favBtn = e.target.closest('.fav');
  const detBtn = e.target.closest('.details');
  if (favBtn) {
    const repo = favBtn.dataset.repo;
    if (state.favorites.has(repo)) {
      state.favorites.delete(repo);
      favBtn.textContent = '☆';
    } else {
      state.favorites.add(repo);
      favBtn.textContent = '★';
    }
    saveFavs();
  }
  if (detBtn) {
    loadDetails(detBtn.dataset.repo);
  }
});

$('#close-details').addEventListener('click', () => detailsDlg.close());

$('#btn-favs').addEventListener('click', () => {
  const favs = [...state.favorites];
  const favItems = state.items.filter((i) => favs.includes(i.full_name));
  if (favItems.length === 0) {
    alert('No favorites yet. Click ☆ on a card to add.');
    return;
  }
  renderItems(favItems, false);
  loadMoreBtn.classList.add('hidden');
});

// Persist optional GitHub token via prompt (simple settings)
document.addEventListener('keydown', (e) => {
  if (e.key === '.' && (e.ctrlKey || e.metaKey)) {
    const t = prompt('Optional GitHub token (for higher rate limits):', state.token || '');
    if (t !== null) {
      state.token = t.trim();
      if (state.token) localStorage.setItem('gh_token', state.token);
      else localStorage.removeItem('gh_token');
      alert('Token saved.');
    }
  }
});

// Infinite scroll (use Load More button sentinel)
const io = new IntersectionObserver(
  (entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting && !state.loading && !loadMoreBtn.classList.contains('hidden')) {
        loadMoreBtn.click();
      }
    }
  },
  { rootMargin: '400px' }
);
io.observe(loadMoreBtn);

// Boot
loadCategories();
search(1);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}
