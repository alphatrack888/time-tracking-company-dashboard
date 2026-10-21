import { CircularProgress } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

export default function Map({ center }) {
  // console.log(center);

  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (center && center[0]) {
      // Assuming center is an array of coordinates [[lat, lng]]
      setMapCenter({
        lat: center[0][1],
        lng: center[0][0],
      });
    }
  }, [center]);

  const [marker, setMarker] = useState([]);

  const handleMapClick = (e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    setMarker((prevMarker) => [...prevMarker, newMarker]);
  };

  // console.log("marker", marker);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GMAP_API_KEY,
    libraries: [],
  });

  if (!isLoaded || !mapCenter) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter} 
        zoom={10}
        onClick={handleMapClick}
      >
        {marker.map((mark, index) => (
          <Marker key={index} position={{ lat: mark.lat, lng: mark.lng }} />
        ))}

        {/* Optionally, render initial markers passed from the 'center' prop */}
        {center.map((coord, index) => (
          <Marker key={index} position={{ lat: coord[1], lng: coord[0] }} />
        ))}
      </GoogleMap>
    </div>
  );
}
