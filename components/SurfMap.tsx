'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GOLDEN_20_DESTINATIONS, DestinationMapping } from '@/lib/destinations';
import { SurfDesire } from '@/lib/surfLogic';
import { Plane } from 'lucide-react';

// Initialize Leaflet icon fix only on client side
if (typeof window !== 'undefined') {
  // Fix for default marker icons in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Custom marker icons for different surf types
const createCustomIcon = (isBarrel: boolean) => {
    return L.divIcon({
    className: 'custom-surf-marker',
    html: `
      <div style="
        background: ${isBarrel ? '#22d3ee' : '#34d399'};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">${isBarrel ? '🔥' : '🌊'}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface SurfMapProps {
  deals?: Array<{
    destination: string;
    airportCode: string;
    price: number;
    currency: string;
    swellHeight: number;
    swellPeriod: number;
    swellType: 'barrel' | 'log';
    valueScore: number;
  }>;
  filterType?: SurfDesire;
  onMarkerClick?: (destination: string) => void;
}

// Component to handle map view updates
function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export function SurfMap({ deals = [], filterType, onMarkerClick }: SurfMapProps) {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combine destinations with deal data
  // If deals include destinations without prices, use their swell data
  const destinationsWithDeals = useMemo(() => {
    return GOLDEN_20_DESTINATIONS.map(dest => {
      const deal = deals.find(d => 
        d.destination === dest.name || 
        d.airportCode === dest.airportCode
      );
      
      // If deal has no price but has swell data, create a display deal
      const displayDeal = deal && (deal as any).hasPrice === false && deal.swellHeight > 0
        ? {
            ...deal,
            price: 0,
            currency: 'USD',
            note: 'Swell data only - no flight price available',
          }
        : deal;
      
      return {
        ...dest,
        deal: displayDeal,
      };
    });
  }, [deals]);

  // Filter destinations based on surf type
  const filteredDestinations = useMemo(() => {
    if (!filterType) return destinationsWithDeals;
    
    return destinationsWithDeals.filter(item => {
      if (!item.deal) return false;
      return item.deal.swellType === filterType;
    });
  }, [destinationsWithDeals, filterType]);

  // Calculate map center (average of all visible destinations)
  const mapCenter: [number, number] = useMemo(() => {
    if (filteredDestinations.length === 0) {
      return [20, 0]; // Default center (equator, prime meridian)
    }
    const avgLat = filteredDestinations.reduce((sum, d) => sum + d.latitude, 0) / filteredDestinations.length;
    const avgLng = filteredDestinations.reduce((sum, d) => sum + d.longitude, 0) / filteredDestinations.length;
    return [avgLat, avgLng];
  }, [filteredDestinations]);

  // Calculate zoom level based on spread of destinations
  const mapZoom = useMemo(() => {
    if (filteredDestinations.length === 0) return 2;
    if (filteredDestinations.length === 1) return 6;
    if (filteredDestinations.length <= 5) return 4;
    if (filteredDestinations.length <= 15) return 3;
    return 2;
  }, [filteredDestinations.length]);

  const handleMarkerClick = (destination: DestinationMapping) => {
    setSelectedDestination(destination.name);
    if (onMarkerClick) {
      onMarkerClick(destination.name);
    }
  };

  // Don't render map until client-side
  if (!isClient) {
    return (
      <div className="h-full min-h-[400px] w-full flex items-center justify-center bg-surf-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-surf-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-surf-surface relative" style={{ minHeight: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', minHeight: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="surf-map-container"
      >
        <MapViewUpdater center={mapCenter} zoom={mapZoom} />
        
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />

        {/* Render markers for each destination */}
        {filteredDestinations.map((item) => {
          const isBarrel = item.deal?.swellType === 'barrel';
          const icon = createCustomIcon(isBarrel);

          return (
            <Marker
              key={`${item.name}-${item.airportCode}`}
              position={[item.latitude, item.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(item),
              }}
            >
              <Popup className="surf-map-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        {item.airportCode}
                      </p>
                    </div>
                    {item.deal && (
                      <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        isBarrel 
                          ? 'bg-surf-accent/20 text-surf-accent border border-surf-accent/30' 
                          : 'bg-surf-emerald/20 text-surf-emerald border border-surf-emerald/30'
                      }`}>
                        {isBarrel ? '🔥' : '🌊'}
                      </div>
                    )}
                  </div>
                  
                  {item.deal ? (
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-700">
                      {item.deal.price > 0 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Price</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {item.deal.currency} {item.deal.price}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Flight Price</span>
                          <span className="text-xs text-slate-500 italic">
                            Check availability
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Height</span>
                          <p className="text-white font-semibold">{item.deal.swellHeight.toFixed(1)}m</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Period</span>
                          <p className="text-white font-semibold">{item.deal.swellPeriod.toFixed(0)}s</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-400">Value Score</span>
                        <span className="text-sm font-mono font-bold text-cyan-400">
                          ${item.deal.valueScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500">No current deals</p>
                      <p className="text-xs text-slate-600 mt-1">{item.surfSpotName}</p>
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      Skill: <span className="text-slate-300 capitalize">{item.skillLevel}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-surf-surface/95 backdrop-blur-md border border-surf-border rounded-xl p-3 z-[1000]">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white mb-2">Surf Type</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white"></div>
              <span className="text-xs text-slate-300">Heaving Barrels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
              <span className="text-xs text-slate-300">Soft & Longboard</span>
            </div>
            {filterType && (
              <div className="mt-2 pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Showing: <span className="text-white capitalize">{filterType}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-4 right-4 bg-surf-surface/95 backdrop-blur-md border border-surf-border rounded-xl p-3 z-[1000]">
          <p className="text-xs text-slate-400">
            <span className="text-white font-bold">{filteredDestinations.length}</span> spots
            {filteredDestinations.filter(d => d.deal).length > 0 && (
              <span className="ml-2">
                • <span className="text-white font-bold">{filteredDestinations.filter(d => d.deal).length}</span> with deals
              </span>
            )}
          </p>
        </div>
      </div>
  );
}

// Leaflet map styles are in globals.css

