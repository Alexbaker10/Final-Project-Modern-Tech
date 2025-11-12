let map;
let markers = [];
let novels = [];

// Load JSON data
fetch('novels.json')
  .then(res => res.json())
  .then(data => {
    novels = data;
    initMap();
    addMarkers();
  });

// Initialize Leaflet Map
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4); // Center of USA

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

// Add all novel markers
function addMarkers() {
  novels.forEach(novel => {
    const marker = L.marker([novel.lat, novel.lng])
      .addTo(map)
      .bindPopup(`<b>${novel.title}</b><br>${novel.author}<br><i>${novel.location}</i>`)
      .on('click', () => showInfoPanel(novel));

    markers.push({ marker, novel });
  });
}

// Search functionality
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') performSearch();
});

function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) return;

  const match = novels.find(n =>
    n.title.toLowerCase().includes(query) ||
    n.author.toLowerCase().includes(query) ||
    n.location.toLowerCase().includes(query)
  );

  if (match) {
    map.setView([match.lat, match.lng], 10);
    const marker = markers.find(m => m.novel === match).marker;
    marker.openPopup();
    showInfoPanel(match);
  } else {
    alert("No novel found. Try: Grapes of Wrath, Blood Meridian, East of Eden");
  }
}

// Show detailed info panel
function showInfoPanel(novel) {
  document.getElementById('novel-title').textContent = novel.title;
  document.getElementById('novel-author').textContent = `${novel.author} (${novel.year})`;
  document.getElementById('novel-location').textContent = novel.location;
  document.getElementById('novel-description').textContent = novel.description;
  document.getElementById('novel-image').src = novel.image;

  document.getElementById('info-panel').classList.remove('hidden');
}

// Close panel
document.getElementById('closePanel').addEventListener('click', () => {
  document.getElementById('info-panel').classList.add('hidden');
});
