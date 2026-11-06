"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

const defaultCenter: [number, number] = [28.6139, 77.209];

function MapSelection({
  value,
  onChange,
}: {
  value: MapCoordinates | null;
  onChange: (coordinates: MapCoordinates) => void;
}) {
  const map = useMap();
  const latitude = value?.latitude;
  const longitude = value?.longitude;

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 16));
    }
  }, [map, latitude, longitude]);

  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });

  return value ? (
    <CircleMarker
      center={[value.latitude, value.longitude]}
      radius={10}
      pathOptions={{ color: "#fff", fillColor: "#1769df", fillOpacity: 1, weight: 3 }}
    />
  ) : null;
}

export default function InteractiveMap({
  value,
  onChange,
}: {
  value: MapCoordinates | null;
  onChange: (coordinates: MapCoordinates) => void;
}) {
  const center: [number, number] = value
    ? [value.latitude, value.longitude]
    : defaultCenter;

  return (
    <MapContainer center={center} zoom={value ? 16 : 11} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSelection value={value} onChange={onChange} />
    </MapContainer>
  );
}
