/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Interactive Global Partner University Map
 * Powered by Leaflet.js, OpenStreetMap & Free Non-Commercial Tile Services
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { University, Course } from '../../types/index.ts';
import { getUniversityLatLng } from '../../utils/universityCoordinates.ts';

interface UniversityMapProps {
  universities: University[];
  allCourses: Course[];
  onNavigateToUni?: (uniSlug: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

export type TileStyleKey = 'light' | 'dark' | 'satellite';

export interface TileProviderConfig {
  name: string;
  url: string;
  subdomains?: string[];
  attribution: string;
  maxZoom: number;
}

// Available Tile Providers with free, non-commercial HTTPS URLs
export const TILE_PROVIDERS: Record<TileStyleKey, TileProviderConfig> = {
  light: {
    name: 'Light',
    url: import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  dark: {
    name: 'Dark',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 18
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  }
};

export const UniversityMap: React.FC<UniversityMapProps> = ({
  universities,
  allCourses,
  onNavigateToUni,
  onResetFilters,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Default to Light (OpenStreetMap Standard)
  const [activeTileStyle, setActiveTileStyle] = useState<TileStyleKey>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasTileError, setHasTileError] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Compute course count per university
  const uniCourseCountMap = useMemo(() => {
    const map = new Map<string, number>();
    allCourses.forEach((c) => {
      const uId = c.universityId;
      const uName = c.universityName;
      if (uId) map.set(uId, (map.get(uId) || 0) + 1);
      if (uName) map.set(uName, (map.get(uName) || 0) + 1);
    });
    return map;
  }, [allCourses]);

  // Safe Invalidate Size helper to ensure map tiles render properly across resizes
  const invalidateMapSize = useCallback(() => {
    if (!mapInstanceRef.current) return;
    requestAnimationFrame(() => {
      mapInstanceRef.current?.invalidateSize();
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default global center
    const map = L.map(mapContainerRef.current, {
      center: [30, 10],
      zoom: 2,
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    mapInstanceRef.current = map;

    // Initial tile layer
    const currentProvider = TILE_PROVIDERS[activeTileStyle];
    const tileLayer = L.tileLayer(currentProvider.url, {
      attribution: currentProvider.attribution,
      subdomains: currentProvider.subdomains || ['a', 'b', 'c'],
      maxZoom: currentProvider.maxZoom,
      crossOrigin: true,
    });

    let errCount = 0;
    tileLayer.on('tileerror', () => {
      errCount++;
      if (errCount >= 6) {
        setHasTileError(true);
      }
    });

    tileLayer.on('load', () => {
      setHasTileError(false);
      setIsMapReady(true);
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom Marker Cluster Group with smooth zoom-and-center animation on click
    const clusterGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false, // Custom smooth flyToBounds animation below
      spiderfyOnMaxZoom: true,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: 'marker-cluster-gees',
          iconSize: L.point(40, 40)
        });
      }
    });

    // Smooth 'zoom-to-cluster' animation centering the view
    clusterGroup.on('clusterclick', (a: any) => {
      const cluster = a.layer;
      const bounds = cluster.getBounds();
      map.flyToBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        duration: 1.0,
        easeLinearity: 0.25
      });
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Invalidate map size after DOM layout renders
    const timer1 = setTimeout(() => invalidateMapSize(), 100);
    const timer2 = setTimeout(() => invalidateMapSize(), 300);

    // Fallback timer to ensure skeleton overlay fades out gracefully
    const readyTimer = setTimeout(() => setIsMapReady(true), 800);

    // ResizeObserver to automatically handle container resizes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        invalidateMapSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    // Cleanup on unmount
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(readyTimer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTileStyle, invalidateMapSize]);

  // Handle Fullscreen & Container Size Adjustments
  useEffect(() => {
    const timer = setTimeout(() => {
      invalidateMapSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen, invalidateMapSize]);

  // Update Tile Layer when style changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const provider = TILE_PROVIDERS[activeTileStyle];

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    setHasTileError(false);

    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      subdomains: provider.subdomains || ['a', 'b', 'c'],
      maxZoom: provider.maxZoom,
      crossOrigin: true,
    });

    let errCount = 0;
    newLayer.on('tileerror', () => {
      errCount++;
      if (errCount >= 6) {
        setHasTileError(true);
      }
    });

    newLayer.on('load', () => {
      setHasTileError(false);
      setIsMapReady(true);
    });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;

    // Force tile load after layer swap
    invalidateMapSize();
  }, [activeTileStyle, invalidateMapSize]);

  // Synchronize Markers & Viewport with Filtered Universities
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!map || !clusterGroup) return;

    clusterGroup.clearLayers();

    if (universities.length === 0) {
      setIsMapReady(true);
      return;
    }

    const bounds = L.latLngBounds([]);

    universities.forEach((uni) => {
      const latLng = getUniversityLatLng(uni);
      bounds.extend([latLng.lat, latLng.lng]);

      const courseCount = uniCourseCountMap.get(uni.id) || uniCourseCountMap.get(uni.name) || ((uni as any).customCourses?.length || 12);
      const flag = uni.flagEmoji || '🏛️';

      // Custom Leaflet DivIcon with GEES Branding
      const customIcon = L.divIcon({
        className: 'gees-custom-marker',
        html: `
          <div class="gees-marker-pin" title="${uni.name}">
            <span>${flag}</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([latLng.lat, latLng.lng], { icon: customIcon });

      // Rich Popup Card HTML
      const qsBadgeHtml = uni.qsRank2027
        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            🏆 QS #${uni.qsRank2027}
           </span>`
        : '';

      const popupContent = `
        <div class="p-4 space-y-3 font-sans text-slate-900 dark:text-slate-100">
          <!-- Header Bar -->
          <div class="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">${flag}</span>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">${uni.country}</span>
                <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">${uni.city}</span>
              </div>
            </div>
            ${qsBadgeHtml}
          </div>

          <!-- Title & Tagline -->
          <div>
            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug hover:text-amber-500 transition-colors cursor-pointer uni-popup-title">
              ${uni.name}
            </h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              ${uni.tagline || 'Leading partner university with top accredited global degrees.'}
            </p>
          </div>

          <!-- Course Count Badge & Action -->
          <div class="pt-1 flex items-center justify-between gap-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold border border-blue-200/60 dark:border-blue-800/60">
              <span class="material-symbols-outlined text-[14px]">school</span>
              <span>${courseCount} Courses</span>
            </div>

            <button
              type="button"
              class="uni-popup-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fbb034] hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>View Courses</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'gees-leaflet-popup'
      });

      // Attach click listener on popup view courses button
      marker.on('popupopen', () => {
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl) {
          const btn = popupEl.querySelector('.uni-popup-btn');
          const title = popupEl.querySelector('.uni-popup-title');

          const navigateHandler = () => {
            if (onNavigateToUni) {
              onNavigateToUni(uni.slug || uni.id);
            }
          };

          btn?.addEventListener('click', navigateHandler);
          title?.addEventListener('click', navigateHandler);
        }
      });

      clusterGroup.addLayer(marker);
    });

    // Auto-fit map viewport to visible university bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
        animate: true,
        duration: 0.8
      });
    }

    // Force size re-check after bounds fitting
    invalidateMapSize();
    setIsMapReady(true);
  }, [universities, uniCourseCountMap, onNavigateToUni, invalidateMapSize]);

  // Recenter map on all visible partners
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || universities.length === 0) return;

    const bounds = L.latLngBounds([]);
    universities.forEach((uni) => {
      const latLng = getUniversityLatLng(uni);
      bounds.extend([latLng.lat, latLng.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
        animate: true
      });
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Fallback tile switch handler
  const handleSwitchToFallbackTile = () => {
    if (activeTileStyle === 'light') {
      setActiveTileStyle('dark');
    } else if (activeTileStyle === 'dark') {
      setActiveTileStyle('satellite');
    } else {
      setActiveTileStyle('light');
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-[#e5e3df] dark:bg-slate-900 shadow-xl overflow-hidden transition-all animate-gees-map-entry ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[440px] sm:h-[560px]'
      } ${className}`}
    >
      {/* Polished GEES Skeleton Loading Overlay */}
      <div
        className={`absolute inset-0 z-[450] bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-500 ${
          isMapReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Shimmering GEES Globe Container */}
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#fbb034]/20 via-amber-400/10 to-blue-500/20 animate-pulse border border-[#fbb034]/30" />
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fbb034] to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-spin"
            style={{ animationDuration: '4s' }}
          >
            <span className="material-symbols-outlined text-2xl font-black">public</span>
          </div>
        </div>

        {/* Skeleton Text */}
        <div className="space-y-2 max-w-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Loading Global Map</span>
          </div>
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            Rendering verified partner university coordinates & map tile layers...
          </p>
        </div>

        {/* Shimmer Bar Skeleton Indicators */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-5 relative">
          <div className="h-full bg-gradient-to-r from-transparent via-[#fbb034] to-transparent animate-shimmer absolute inset-0 -translate-x-full" />
        </div>
      </div>

      {/* Top Map Header / Toolbar Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Partner Count */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-white text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="material-symbols-outlined text-[16px] text-amber-400">map</span>
            <span>{universities.length} Partner Universities on Map</span>
          </div>

          {/* Tile error fallback warning badge */}
          {hasTileError && (
            <button
              type="button"
              onClick={handleSwitchToFallbackTile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-lg cursor-pointer hover:bg-amber-400 transition-all active:scale-95 animate-bounce-subtle pointer-events-auto"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              <span>Switch Tile Layer</span>
            </button>
          )}
        </div>

        {/* Right Tools: Recenter + Style Switcher + Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 p-1 rounded-xl shadow-lg">
          {/* Recenter View Button */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Map on Filtered Partners"
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">filter_center_focus</span>
            <span className="hidden sm:inline">Fit Partners</span>
          </button>

          {/* Style Selector Dropdown */}
          <div className="relative border-l border-slate-700 pl-1">
            <select
              value={activeTileStyle}
              onChange={(e: any) => setActiveTileStyle(e.target.value as TileStyleKey)}
              className="bg-transparent text-slate-200 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg focus:outline-none cursor-pointer appearance-none pr-5"
            >
              <option value="light" className="bg-slate-900 text-white">Light</option>
              <option value="dark" className="bg-slate-900 text-white">Dark</option>
              <option value="satellite" className="bg-slate-900 text-white">Satellite</option>
            </select>
            <span className="material-symbols-outlined text-[14px] text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer border-l border-slate-700"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Zoom Controls (Bottom Right Floating) */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 text-white hover:bg-amber-500 hover:text-slate-950 font-black flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 text-white hover:bg-amber-500 hover:text-slate-950 font-black flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
      </div>

      {/* Leaflet Map Canvas Div */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[400px] z-1 relative"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Elegant Empty State Overlay when no universities match filter */}
      {universities.length === 0 && (
        <div className="absolute inset-0 z-[500] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">wrong_location</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No Universities Match Your Filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try expanding your search criteria or resetting filters to view partner universities worldwide on the map.
              </p>
            </div>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityMap;
