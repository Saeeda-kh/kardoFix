"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { MapCoordinates } from "./InteractiveMap";
import styles from "./MapLocationPicker.module.scss";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>,
});

type MapLocationPickerProps = {
  value: MapCoordinates | null;
  onChange: (coordinates: MapCoordinates) => void;
  label: string;
};

export default function MapLocationPicker({ value, onChange, label }: MapLocationPickerProps) {
  const [locationError, setLocationError] = useState("");

  function selectLocation(coordinates: MapCoordinates) {
    setLocationError("");
    onChange(coordinates);
  }

  function useCurrentLocation() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access. Select the location on the map.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => selectLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      () => setLocationError("Could not access your current location. Select the location on the map."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>{label} <span aria-hidden="true">*</span></legend>
      <p className={styles.instructions}>Click the map to place the pin, or use your current location. No address entry is needed.</p>
      <button className={styles.locateButton} type="button" onClick={useCurrentLocation}>
        Use my current location
      </button>
      <div className={styles.mapFrame}>
        <InteractiveMap value={value} onChange={selectLocation} />
      </div>
      {value ? (
        <p className={styles.coordinates} aria-live="polite">
          Selected coordinates: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </p>
      ) : (
        <p className={styles.coordinates}>No location selected yet.</p>
      )}
      {locationError && <p className={styles.error} role="alert">{locationError}</p>}
    </fieldset>
  );
}
