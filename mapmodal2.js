document.addEventListener("DOMContentLoaded", function () {
  var btns = document.querySelectorAll(".btn-book2");

  btns.forEach(function (btn, index) {
    btn.onclick = function () {
      let modal = document.querySelectorAll(".modal2")[index];
      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      setTimeout(function () {
        let mapContainer = modal.querySelector("#map");
        if (!mapContainer.dataset.loaded) {
          initMap(mapContainer);
          mapContainer.dataset.loaded = "true";
        }
      }, 500);
    };
  });

  document.querySelectorAll(".close2").forEach((closeBtn, index) => {
    closeBtn.onclick = function () {
      let modal = document.querySelectorAll(".modal2")[index];
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };
  });

  function initMap(container) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYW1hc2hhcnUiLCJhIjoiY204cmY4am1vMHV3ZjJqczhjcWpueGFhaSJ9.EpsIRkNxnpw4i8w1oSOQYw";

    const start = [121.035315, 14.653648]; // Example start point
    const end = [120.87383, 14.828492]; // Example end point

    let map = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: start,
      zoom: 12,
    });

    // Start and End Markers
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat(start)
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setText("Start Location"));

    new mapboxgl.Marker({ color: "red" })
      .setLngLat(end)
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setText("End Location"));

    // Vehicle Marker (Initial position set to Start)
    let vehicleMarker = new mapboxgl.Marker({ color: "green" })
      .setLngLat(start)
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setText("Vehicle Location"));

    // Add real-time traffic layer
    map.on("load", function () {
      map.addLayer(
        {
          id: "traffic",
          type: "line",
          source: {
            type: "vector",
            url: "mapbox://mapbox.mapbox-traffic-v1",
          },
          "source-layer": "traffic",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "congestion"], "moderate"],
              "#FFFF00",
              ["==", ["get", "congestion"], "heavy"],
              "#FF8000",
              ["==", ["get", "congestion"], "severe"],
              "#FF0000",
              "transparent",
            ],
            "line-width": 3,
          },
        },
        "waterway-label"
      );
    });

    // Fetch and display the route along with real-time travel info
    fetchRoute(map, start, end);

    // MQTT Client Setup
    const mqttClient = setupMQTTClient(vehicleMarker, map, start, end);
  }

  function fetchRoute(map, start, end) {
    const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

    fetch(directionsRequest)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes.length > 0) {
          const route = data.routes[0];
          const travelTime = Math.round(route.duration / 60); // Convert seconds to minutes
          const roadName = route.legs[0].steps[0]?.name || "Unknown Road"; // Get first road name

          // Create the side navigation for real-time info
          let infoPanel = document.createElement("div");
          infoPanel.id = "map-info";
          infoPanel.innerHTML = `        
              <div id="info-content">
                <h3>Real-time Travel Info</h3>
                <p><strong>Current Road:</strong> <span id="current-road">${roadName}</span></p>
                <p><strong>Estimated Travel Time:</strong> <span id="travel-time">${travelTime} mins</span></p>
              </div>
            `;
          document.getElementById("map").appendChild(infoPanel);

          // Style the map-info panel background
          let mapInfo = document.getElementById("map-info");
          mapInfo.style.backgroundColor = "white"; // Ensure the background is white

          // Add minimize button outside the side navigation
          let minimizeBtn = document.createElement("button");
          minimizeBtn.id = "minimize-btn";
          minimizeBtn.textContent = "-";
          minimizeBtn.style.position = "absolute"; // Fix button position
          minimizeBtn.style.top = "20px"; // Adjust top position
          minimizeBtn.style.right = "20px"; // Adjust right position
          document.getElementById("map").appendChild(minimizeBtn);

          // Handle minimizing the panel content
          let isMinimized = false;

          minimizeBtn.addEventListener("click", function () {
            if (isMinimized) {
              // Show the entire side panel (background and content)
              mapInfo.style.display = "block";
              minimizeBtn.textContent = "-"; // Change button to minimize
            } else {
              // Hide the entire side panel (background and content)
              mapInfo.style.display = "none";
              minimizeBtn.textContent = "+"; // Change button to maximize
            }
            isMinimized = !isMinimized;
          });

          // Add route line to the map
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#007bff",
              "line-width": 2.5,
              "line-opacity": 0.75,
            },
          });
        }
      })
      .catch((error) => console.error("Error fetching route:", error));
  }

  // Setup MQTT client
  function setupMQTTClient(vehicleMarker, map, start, end) {
    const mqttClient = mqtt.connect("wss://your-mqtt-broker-url", {
      clientId: "vehicle-tracking-client",
      clean: true,
      reconnectPeriod: 1000, // Reconnect interval on failure
    });

    // Topic to subscribe to
    const topic = "vehicle/location";

    mqttClient.on("connect", function () {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe(topic, function (err) {
        if (!err) {
          console.log("Subscribed to vehicle location topic");
        }
      });
    });

    // Handle incoming data (vehicle's location)
    mqttClient.on("message", function (topic, message) {
      const locationData = JSON.parse(message.toString());
      if (locationData && locationData.lat && locationData.lon) {
        const vehicleLocation = [locationData.lon, locationData.lat];

        // Update vehicle marker position
        vehicleMarker.setLngLat(vehicleLocation);

        // Update current road name and travel time using reverse geocode
        updateCurrentRoadName(map, vehicleLocation, start, end);
      }
    });

    // Handle connection errors and retries
    mqttClient.on("error", function (error) {
      console.error("MQTT Connection Error:", error);
      mqttClient.reconnect(); // Attempt to reconnect if connection fails
    });

    return mqttClient;
  }

  function updateCurrentRoadName(map, vehicleLocation, start, end) {
    const reverseGeocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${vehicleLocation[0]},${vehicleLocation[1]}.json?access_token=${mapboxgl.accessToken}`;

    fetch(reverseGeocodeURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const roadName = data.features[0].text; // Get the road name from the response
          document.getElementById("current-road").textContent = roadName; // Update road name dynamically
        }
      })
      .catch((error) => console.error("Error fetching road name:", error));

    // Estimate travel time based on current location (optional: refine with more accurate calculation based on route)
    const distance = turf.distance(vehicleLocation, end, {
      units: "kilometers",
    }); // Using Turf.js to calculate distance
    const estimatedTravelTime = Math.round(distance / 60); // Example: 60 km/h speed
    document.getElementById(
      "travel-time"
    ).textContent = `${estimatedTravelTime} mins`;
  }
});
