'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

type UserMapProps = {
    lat: number;
    lng: number;
};

mapboxgl.accessToken = 'pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRmZDA2eGQzYmxqZTlnd21qY3EifQ.Q7DM5HqE5QJzDEnCx8BGFw';

const UserMap = ({ lat, lng }: UserMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null)
    
    useEffect(() => {
        if (!mapContainerRef.current) return
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 12,
          })
      
          new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current)
      
          return () => map.current?.remove()
        }, [lat, lng])
      
        return <div className="w-full h-64 rounded-lg" ref={mapContainerRef} />
      }
      
      export default UserMap