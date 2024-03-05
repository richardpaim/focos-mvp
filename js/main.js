

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

// Criando um controle personalizado com a logo
var logoControl = L.control({position: 'bottomleft'});

logoControl.onAdd = function(map) {
    var logoDiv = L.DomUtil.create('div', 'leaflet-control-logo');
    logoDiv.innerHTML = '<img src="../assets/logoMaps.png" alt="Logo" width="100" height="100">';
    return logoDiv;
};

// Adicionando o controle ao mapa
logoControl.addTo(map);


fetch("https://raw.githubusercontent.com/richardpaim/focos-mvp/main/api/foco_calor.json").then(function(response) {
return response.json();
}).then(function(data) {
    var focosCalorLayer = L.geoJSON(data, {
        style: function(feature) {
            return {
                fillColor: 'black',  // Cor de preenchimento vermelha
                color: 'black',      // Cor da borda vermelha
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
  // Função para gerar uma cor com base no tamanho do buffer
function getColor(size) {
  // Defina os limites de tamanho do buffer e as cores correspondentes
  var colors = ['#FF0000','#FFA500','#FFFF00',  ]; // Vemelho, Laranja, Amarelo, 
  var thresholds = [1, 2, 6, 20]; // Limites de tamanho do buffer em quilômetros
  
  // Itere sobre os limites e encontre a cor correspondente
  for (var i = 0; i < thresholds.length; i++) {
      if (size <= thresholds[i]) {
          return colors[i];
      }
  }
  
  // Se o tamanho for maior que todos os limites, retorne a última cor
  return colors[colors.length - 1];
}
  // Definindo os tamanhos dos buffers
  var bufferSizes = [1, 2, 6, 20]; // Em quilômetros


  // Adiciona os buffers das refinarias ao mapa
  bufferSizes.forEach(function(size) {
    var buffer = turf.buffer(features, size, { units: 'kilometers' });
    var color = getColor(size); // Obtém a cor com base no tamanho do buffer
    var bufferLayer = L.geoJSON(buffer, {
      style: {
        fillColor: color,
        color: color,
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
  
