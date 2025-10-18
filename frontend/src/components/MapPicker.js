import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Search, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

const MapPicker = ({ 
  initialLat = 20.5937, 
  initialLng = 78.9629, // Center of India
  onLocationSelect,
  selectedLocation,
  height = "400px",
  enablePicker = true,
  markers = []
}) => {
  const [center, setCenter] = useState([initialLat, initialLng]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasTriedGeolocation, setHasTriedGeolocation] = useState(false);

  // Update center when initial coordinates change
  useEffect(() => {
    if (selectedLocation) {
      setCenter([selectedLocation.lat, selectedLocation.lng]);
    } else if (initialLat !== 20.5937 || initialLng !== 78.9629) {
      setCenter([initialLat, initialLng]);
    }
  }, [selectedLocation, initialLat, initialLng]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCenter([latitude, longitude]);
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let message = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out.';
            break;
          default:
            message += 'An unknown error occurred.';
        }
        // Only show alert if user clicks the button, not on auto-load
        if (!hasTriedGeolocation) {
          alert(message);
        }
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [onLocationSelect]);

  // Try to get user's current location on mount
  useEffect(() => {
    if (!hasTriedGeolocation && !selectedLocation && enablePicker) {
      setHasTriedGeolocation(true);
      getCurrentLocation();
    }
  }, [hasTriedGeolocation, selectedLocation, enablePicker, getCurrentLocation]);

  // Search location using Nominatim (OpenStreetMap)
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setCenter([newLocation.lat, newLocation.lng]);
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      } else {
        alert('Location not found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      {enablePicker && (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search location (e.g., Mumbai, India or Wankhede Stadium)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 transition-colors"
              />
            </div>
            <button
              onClick={searchLocation}
              disabled={isSearching}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Use My Location Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Use my current location"
            >
              <Navigation className="h-4 w-4" />
              <span>{isLoadingLocation ? 'Getting Location...' : 'Use My Location'}</span>
            </button>
            {enablePicker && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Or click on the map to select a location</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md" style={{ height }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          key={`${center[0]}-${center[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Location picker marker */}
          {enablePicker && (
            <LocationMarker onLocationSelect={onLocationSelect} />
          )}
          
          {/* Selected location marker */}
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]} 
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Selected Location</strong><br />
                  Lat: {selectedLocation.lat.toFixed(6)}<br />
                  Lng: {selectedLocation.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Display multiple markers (for event list view) */}
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={[marker.lat, marker.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-base">{marker.name}</strong><br />
                  {marker.description && <span className="text-gray-600">{marker.description}</span>}
                  {marker.address && (
                    <>
                      <br /><br />
                      <strong>Address:</strong><br />
                      {marker.address}
                    </>
                  )}
                  {marker.date && (
                    <>
                      <br /><br />
                      <strong>Date:</strong> {new Date(marker.date).toLocaleDateString()}
                    </>
                  )}
                  {marker.link && (
                    <>
                      <br /><br />
                      <a 
                        href={marker.link} 
                        className="text-primary-500 hover:text-primary-600 font-semibold"
                      >
                        View Details →
                      </a>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Coordinates Display */}
      {selectedLocation && enablePicker && (
        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Selected Coordinates:</strong><br />
            Latitude: {selectedLocation.lat.toFixed(6)}<br />
            Longitude: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
