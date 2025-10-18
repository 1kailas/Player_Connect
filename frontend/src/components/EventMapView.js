import React from 'react';
import MapPicker from './MapPicker';

const EventMapView = ({ event, height = "400px" }) => {
  // Check if event has valid location data
  const hasLocation = event?.latitude && event?.longitude;

  if (!hasLocation) {
    return (
      <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-400">
          No location information available for this event.
        </p>
      </div>
    );
  }

  // Create marker data for the event
  const eventMarker = {
    lat: event.latitude,
    lng: event.longitude,
    name: event.name,
    description: event.description,
    address: event.address 
      ? `${event.address}${event.city ? ', ' + event.city : ''}${event.state ? ', ' + event.state : ''}${event.country ? ', ' + event.country : ''}`
      : event.venueName || 'No address provided',
    date: event.startDate,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Event Location
          </h3>
          {event.venueName && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>Venue:</strong> {event.venueName}
            </p>
          )}
          {event.address && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Address:</strong> {event.address}
              {event.city && `, ${event.city}`}
              {event.state && `, ${event.state}`}
              {event.postalCode && ` ${event.postalCode}`}
              {event.country && `, ${event.country}`}
            </p>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors text-sm whitespace-nowrap"
        >
          Open in Google Maps
        </a>
      </div>

      <MapPicker
        initialLat={event.latitude}
        initialLng={event.longitude}
        selectedLocation={{
          lat: event.latitude,
          lng: event.longitude,
        }}
        markers={[eventMarker]}
        enablePicker={false}
        height={height}
      />
    </div>
  );
};

export default EventMapView;
