let map;
let markers = [];
let novels = [];

// Load novels.json with proper error handling (no alert!)
fetch('novels.json')
  .then(r => {
    if (!r.ok) {
      throw new Error(`HTTP ${r.status} – novels.json not found or inaccessible`);
    }
    return r.json();
  })
  .then(data => {
    novels = data;
    console.log('novels.json loaded successfully –', novels.length, 'novels');
    initMap();
    addMarkers();
  })
  .catch(err => {
    // Instead of alert(), we show a nice message on the page
    console.error(err);
    document.getElementById('map').innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #fff; color: #a00;">
        <h3>Could not load the novel data</h3>
        <p>Make sure <code>novels.json</code> is in the same folder as index.html<br>
        and that the file name is exactly <strong>novels.json</strong> (with the .json extension)</p>
        <p><em>Check the browser console (F12) for details.</em></p>
      </div>`;
  });

// Initialise map
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

// Add markers
function addMarkers() {
  novels.forEach(novel => {
    const m = L.marker([novel.lat, novel.lng])
      .addTo(map)
      .bindPopup(`<b>${novel.title}</b><br>${novel.author}`)
      .on('click', () => showPanel(novel));
    markers.push({ marker: m, novel });
  });
}

// Search
document.getElementById('searchBtn').onclick = search;
document.getElementById('searchInput').onkeypress = e => e.key === 'Enter' && search();

function search() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) return;

  const match = novels.find(n =>
    n.title.toLowerCase().includes(q) ||
    n.author.toLowerCase().includes(q) ||
    n.location.toLowerCase().includes(q) ||
    String(n.year).includes(q)
  );

  if (!match) {
    document.getElementById('map').innerHTML = `<div style="padding:2rem;background:#fff;text-align:center;">
      No match for "<b>${q}</b>". Try: huck, grapes, mockingbird, handmaid, country, eden, etc.
    </div>`;
    return;
  }

  map.flyTo([match.lat, match.lng], 11);
  const m = markers.find(x => x.novel === match).marker;
  m.openPopup();
  showPanel(match);
}

// Show info panel
function showPanel(n) {
  document.getElementById('novel-title').textContent = n.title;
  document.getElementById('novel-author').textContent = `${n.author} (${n.year})`;
  document.getElementById('novel-location').textContent = n.location;
  document.getElementById('novel-description').textContent = n.description;
  document.getElementById('novel-image').src = n.image || 'https://via.placeholder.com/600x400?text=No+Image';
  document.getElementById('info-panel').classList.remove('hidden');
}

// Close panel
document.getElementById('closePanel').onclick = () => {
  document.getElementById('info-panel').classList.add('hidden');
};