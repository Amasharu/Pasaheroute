mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1hc2hhcnUiLCJhIjoiY204cmY4am1vMHV3ZjJqczhjcWpueGFhaSJ9.EpsIRkNxnpw4i8w1oSOQYw"; // Replace with your Mapbox token

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [120.873803, 14.82852], // Default: Guiguinto, Bulacan
  zoom: 12,
});

// Add a marker for the vehicle
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat([120.873803, 14.82852]) // Default: Guiguinto, Bulacan
  .addTo(map);

// Function to fetch real-time location from your backend
async function updateBusLocation() {
  const response = await fetch("http://yourserver.com/get-location");
  const data = await response.json();

  marker.setLngLat([data.lng, data.lat]); // Update marker position
  map.flyTo({ center: [data.lng, data.lat], speed: 0.5 });
}

// Refresh location every 5 seconds
setInterval(updateBusLocation, 5000);

async function getRoute(start, end) {
  const response = await fetch(
    `http://yourserver.com/get-route?start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`
  );
  const data = await response.json();

  if (!data.routes) return console.error("No routes found");

  const route = data.routes[0];
  console.log("Estimated time:", route.duration / 60, "minutes");

  const routeGeoJSON = {
    type: "Feature",
    properties: {},
    geometry: route.geometry,
  };
  if (map.getSource("route")) {
    map.getSource("route").setData(routeGeoJSON);
  } else {
    map.addLayer({
      id: "route",
      type: "line",
      source: { type: "geojson", data: routeGeoJSON },
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#ff0000", "line-width": 5 },
    });
  }
}

// Example usage
getRoute(
  { lng: 120.873803, lat: 14.82852 },
  { lng: 121.035283, lat: 14.653669 }
);
