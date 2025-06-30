document.addEventListener("DOMContentLoaded", function () {
  var btns = document.querySelectorAll(".btn-book1");

  btns.forEach(function (btn, index) {
    btn.onclick = function () {
      let modal = document.querySelectorAll(".modal1")[index];
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

  document.querySelectorAll(".close1").forEach((closeBtn, index) => {
    closeBtn.onclick = function () {
      let modal = document.querySelectorAll(".modal1")[index];
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };
  });

  function initMap(container) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYW1hc2hhcnUiLCJhIjoiY204cmY4am1vMHV3ZjJqczhjcWpueGFhaSJ9.EpsIRkNxnpw4i8w1oSOQYw";

    var start = [120.87383, 14.828492]; // Example start point
    var end = [121.035315, 14.653648]; // Example end point

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
      .setLngLat(start) // Initial position
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

    // Function to fetch the latest GPS data
    function fetchLatestGPS() {
      fetch("http://localhost:8080/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "latest_gps" })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Latest GPS:", data);
        if (data.Latitude && data.Longitude) {
          // Convert fetched data to correct format (degrees and direction)
          const latitude = convertCoordinate(data.Latitude, data.LatDir);
          const longitude = convertCoordinate(data.Longitude, data.LongDir);
          const vehicleLocation = [longitude, latitude];

          // Update the vehicle marker position with the latest GPS coordinates
          vehicleMarker.setLngLat(vehicleLocation);

          // Optionally, update the road name and travel time using reverse geocode
          updateCurrentRoadName(map, vehicleLocation, start, end);
        }
      })
      .catch(err => console.error("Error fetching GPS data:", err));
    }

    // Convert coordinate based on direction (N/S for Latitude and E/W for Longitude)
    function convertCoordinate(coordinate, direction) {
      let degrees = parseFloat(coordinate);
      if (direction === 'S' || direction === 'W') {
        degrees = -degrees; // Negate for South or West
      }
      return degrees;
    }

    // Fetch immediately and then every 3 seconds
    fetchLatestGPS();
    setInterval(fetchLatestGPS, 3000);
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
                <p><strong>Current Road:</strong> <span id="current-road">Loading...</span></p>
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

  function updateCurrentRoadName(map, vehicleLocation, start, end) {
    const reverseGeocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${vehicleLocation[0]},${vehicleLocation[1]}.json?access_token=${mapboxgl.accessToken}`;

    fetch(reverseGeocodeURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const roadName = data.features[0].text; // Get the road name from the response
          
          // Ensure the element exists before updating its text content
          let roadElement = document.getElementById("current-road");

          if (!roadElement) {
            // If the element doesn't exist, create it dynamically
            roadElement = document.createElement("span");
            roadElement.id = "current-road"; // Set the ID for the new element
            roadElement.textContent = roadName; // Set the text content

            // Ensure #info-content exists before appending
            let infoContent = document.getElementById("info-content");
            if (!infoContent) {
              infoContent = document.createElement("div");
              infoContent.id = "info-content";
              infoContent.innerHTML = `<h3>Real-time Travel Info</h3><p><strong>Current Road:</strong> <span id="current-road">${roadName}</span></p>`;
              document.getElementById("map-info").appendChild(infoContent);
            }
            infoContent.appendChild(roadElement); // Append the road element
          } else {
            roadElement.textContent = roadName; // Update road name dynamically
          }
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
