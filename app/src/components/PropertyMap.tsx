import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

interface PropertyMapProps {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
}

export default function PropertyMap({ lat, lng, address, city, state }: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 14,
      interactive: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    new mapboxgl.Marker({ color: '#FF6B47' })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${escapeHtml(address)}</strong><br/>${escapeHtml(city)}, ${escapeHtml(state)}`
        )
      )
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, address, city, state]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative flex h-[250px] items-center justify-center rounded-2xl border border-border bg-slate-100 text-sm text-slate-500">
        Map unavailable — set VITE_MAPBOX_TOKEN in .env
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
      <div ref={mapContainerRef} className="w-full h-[250px]" />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-text-primary shadow-sm flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        {city}, {state}
      </div>
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-text-muted shadow-sm">
        {address}
      </div>
    </div>
  );
}
