'use client';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { croc_points } from './filtered_data';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function Map(props: any) {
    const { position, zoom } = props;

    if (typeof window === "undefined") {
        return;
    }
    const iconCroc = new L.Icon({
        iconUrl: '/images/crocodile-svgrepo-com.svg',
        iconRetinaUrl: '/images/crocodile-svgrepo-com.svg',
        iconSize: [32, 32]
    });

    const [visibleMarkers, setVisibleMarkers] = useState([]);

    const MapController = (props: any) => {
        const { setVisibleMarkers } = props;
        const map = useMap();

        useEffect(() => {
            if (!map) return;
            // Updates markers after map initially renders
            updateVisibleMarkers();

            map.on('dragend', function() {
                // Updates markers after user drags the map to change position
                updateVisibleMarkers();
            });
            map.on('zoomend', function() {
                // Updates markers after user zooms in/out
                updateVisibleMarkers();
            });
        }, [map]);

        const updateVisibleMarkers = () => {
            const bounds = map.getBounds();
            const newMarkers = [];
            for (let point of croc_points) {
                if (bounds.contains(point)) {
                    newMarkers.push(point);
                }
            }
            setVisibleMarkers(newMarkers);
        };

        return <></>;
    };


    return <MapContainer className="h-screen" center={position} zoom={zoom} scrollWheelZoom={true} crs={L.CRS.EPSG3857}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visibleMarkers.map((point, index) => (
            <Marker position={[point[0], point[1]]} icon={iconCroc} key={index}>
                <Popup>
                    <p><strong>Time Spotted: </strong>8/9/2024 9:48PM</p>
                    <p><strong>Location: </strong>{point[0]}, {point[1]}</p>
                </Popup>
            </Marker>
        ))}
        <MapController setVisibleMarkers={setVisibleMarkers} />
    </MapContainer >
}
