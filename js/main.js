

var map = L.map('map').setView([-14.235, -51.925], 4);

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const googleSat = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: "&copy; OpenStreetMap contributors",
});




fetch("../api/foco_calor.json").then(function(response) {
return response.json();
}).then(function(data) {
    var focosCalorLayer = L.geoJSON(data, {
        style: function(feature) {
            return {
                fillColor: 'red',  // Cor de preenchimento vermelha
                color: 'red',      // Cor da borda vermelha
                weight: 2          // Largura da borda
            };
        }
    });
    focosCalorLayer.addTo(map);
});
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satélite": googleSat,

    
};
  var overlayMaps = {
   // "Focos de Calor": focosCalorLayer
  };

  L.control.layers(baseMaps,overlayMaps).addTo(map);


// Criando os pontos e adicionando-os ao mapa
var features = turf.featureCollection([
    turf.point([-34.9724, -8.3952], {"name": "Abreu e Lima - Ipojuca-PE" }),
    turf.point([-43.2699, -22.7199], {"name": "Duque de Caxias" }),
    turf.point([-44.0962, -19.9756], {"name": "Gabriel Passos - Betim-BH" }),
    turf.point([-49.3607, -25.5679], {"name": "Presidente Getúlio Vargas - Araucária-PR" }),
    turf.point([-38.5718, -12.7076], {"name": "Landulpho Alves - São Francisco do Conde-BH" }),
    turf.point([-59.9538, -3.1464],  {"name": "Isaac Sabbá - Manaus-AM" }),
    turf.point([-51.1627, -29.8716 ], {"name": "Alberto Pasqualini - Canoas-RS - Esteio-RS"}),
    turf.point([-45.8242, -23.1930 ], {"name": "Henrique Lage - São José dos Campos-SP"}),
    turf.point([-46.4802, -23.6394 ], {"name": "Capuava - Mauá-SP"}),
    turf.point([-46.4329, -23.8722 ], {"name": "Presidente Bernardes - Cubatão-SP"}),
    turf.point([-47.1315, -22.7282 ], {"name": "Planalto de Paulínia - Paulínia-SP"}),
  ]);
  
  // Definindo os tamanhos dos buffers
  var bufferSizes = [1, 2, 6, 20]; // Em quilômetros


  // Adiciona os buffers das refinarias ao mapa
  bufferSizes.forEach(function(size) {
    var buffer = turf.buffer(features, size, { units: 'kilometers' });
    var bufferLayer = L.geoJSON(buffer, {
      style: {
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.2
      }
    }).addTo(map);
    overlayMaps[`Refinaria Buffer (${size} km)`] = bufferLayer;
  });

  // Função para centrar o mapa na localização da refinaria
function centerMapOnRefinery(refineryName) {
    var refinery = features.features.find(function(feature) {
      return feature.properties.name === refineryName;
    });
  
    if (refinery) {
      map.flyTo([refinery.geometry.coordinates[1], refinery.geometry.coordinates[0]], 10);
      
    }
  }
  
  // Adicionando manipuladores de eventos aos links da lista
  document.querySelectorAll('.list-group-item').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var refineryName = link.textContent.trim();
      centerMapOnRefinery(refineryName);
    });
  });
  