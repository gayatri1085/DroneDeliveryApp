// Initialize the OpenStreetMap with Leaflet.js
const map = L.map('map').setView([28.6139, 77.2090], 14); // Default: New Delhi

// Add OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Initialize the drone marker with the default icon
const droneMarker = L.marker([28.6139, 77.2090]).addTo(map)
    .bindPopup("Drone is here!")
    .openPopup();

// Store the route polyline
let routeLine;

// Function to move the drone along a route
function moveDrone(route) {
    let index = 0;
    let interval = setInterval(() => {
        if (index >= route.length) {
            clearInterval(interval);
        } else {
            let point = route[index];
            droneMarker.setLatLng([point.lat, point.lng]);
            index++;
        }
    }, 100); // Move every 100ms
}

// Function to get coordinates from address using Nominatim API
async function getCoordinates(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
        alert(`Location not found: ${address}`);
        return null;
    }
}

// Handle order form submission
document.getElementById('orderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let pickupAddress = document.getElementById('pickup').value;
    let dropoffAddress = document.getElementById('dropoff').value;

    let pickup = await getCoordinates(pickupAddress);
    let dropoff = await getCoordinates(dropoffAddress);

    if (pickup && dropoff) {
        // Remove previous route if exists
        if (routeLine) {
            map.removeLayer(routeLine);
        }

        // Generate intermediate points for smooth movement
        let route = generateRoute(pickup, dropoff);

        // Draw the route on the map
        routeLine = L.polyline(route, { color: 'blue', weight: 4 }).addTo(map);

        // Move the drone along the route
        moveDrone(route);
    }
});

// Function to generate a smooth route between two points
function generateRoute(start, end) {
    let steps = 100;
    let route = [];

    let latStep = (end.lat - start.lat) / steps;
    let lngStep = (end.lng - start.lng) / steps;

    for (let i = 0; i <= steps; i++) {
        route.push({
            lat: start.lat + latStep * i,
            lng: start.lng + lngStep * i
        });
    }

    return route;
}
