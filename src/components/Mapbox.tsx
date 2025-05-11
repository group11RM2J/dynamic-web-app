'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl';
import { useState } from 'react';

const MAPBOX_TOKEN = "your_mapbox_access_token_here"; // Replace with your actual token

type Props = {
  setAddress: (address: string) => void;
};

export default function Mapbox({ setAddress }: Props) {
  const [viewport, setViewport] = useState({
    latitude: 12.9716,
    longitude: 123.8854,
    zoom: 12,
  });

  const [marker, setMarker] = useState({
    latitude: 12.9716,
    longitude: 123.8854,
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    const place = data?.features?.[0]?.place_name || "";
    setAddress(place);
  };

  const handleMapClick = (e: any) => {
    const [lng, lat] = e.lngLat;
    setMarker({ latitude: lat, longitude: lng });
    setViewport((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    reverseGeocode(lat, lng);
  };

  return (
    <div className="h-64 mt-4 border rounded">
      <Map
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker latitude={marker.latitude} longitude={marker.longitude} />
        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <NavigationControl />
        </div>
      </Map>
    </div>
  );
}
