// Inicializar el mapa
const map = L.map('map').setView([0, 0], 2); // Vista global

// Añadir capa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Grupo para marcadores
let currentMarkers = L.featureGroup().addTo(map);

// Archivos JSON disponibles
const dataUrls = {
  finales: 'finales.json',
  estadios: 'estadios.json',
  curiosidades: 'curiosidades.json'
};

// Función para cargar datos
async function cargarDatos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return [];
  }
}

// Agregar marcadores según el tipo
function addMarkers(data, type) {
  currentMarkers.clearLayers();

  data.forEach(item => {
    let popupContent = '';
    let markerIcon;

    if (type === 'finales') {
      popupContent = `
        <h3>${item.nombre}</h3>
        <p><strong>Fecha:</strong> ${item.fecha}</p>
        <p><strong>Tipo:</strong> ${item.tipo}</p>
        <p><strong>Descripción:</strong> ${item.descripcion}</p>
      `;
      markerIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1000/1000966.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    } else if (type === 'estadios') {
      const mundiales = item.mundiales_albergados ? item.mundiales_albergados.join(', ') : 'N/A';
      const notas = item.notas ? `<p><strong>Notas:</strong> ${item.notas}</p>` : '';
      popupContent = `
        <h3>${item.nombre}</h3>
        <p><strong>Ciudad:</strong> ${item.ciudad}, ${item.pais}</p>
        <p><strong>Mundiales:</strong> ${mundiales}</p>
        ${notas}
      `;
      markerIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854930.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    } else if (type === 'curiosidades') {
      popupContent = `
        <h3>${item.titulo}</h3>
        <p><strong>Ubicación:</strong> ${item.nombre}</p>
        <p><strong>Fecha:</strong> ${item.fecha}</p>
        <p><strong>Descripción:</strong> ${item.descripcion}</p>
      `;
      markerIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/91/91564.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    }

    if (item.lat && item.lng) {
      L.marker([item.lat, item.lng], { icon: markerIcon })
        .bindPopup(popupContent)
        .addTo(currentMarkers);
    }
  });

  if (data.length > 0) {
    map.fitBounds(currentMarkers.getBounds());
  } else {
    map.setView([0, 0], 2);
  }
}

// Listener para el selector
document.getElementById('dataTypeSelector').addEventListener('change', async (event) => {
  const selectedType = event.target.value;
  const url = dataUrls[selectedType];
  const data = await cargarDatos(url);
  addMarkers(data, selectedType);
});

// Cargar datos por defecto
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dataTypeSelector').dispatchEvent(new Event('change'));
});
