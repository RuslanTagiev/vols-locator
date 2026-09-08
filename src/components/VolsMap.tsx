import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { CableNode } from "../types/vols";
import { iconsMap } from "../utils/mapIcons";
import { typeLabels } from "../utils/volsData";

const yandexCRS = L.CRS.EPSG3395;
const yandexTileUrl =
  "https:" +
  "//" +
  "core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU";

interface VolsMapProps {
  nodes: CableNode[];
  onMapClick: (lat: number, lng: number, editNode?: CableNode) => void;
  accidentResult: {
    coords: [number, number];
    railwayKm: number;
    railwayPk: number;
  } | null;
  selectedNodeName: string;
  reflectometerValue: number | "";
  center: [number, number];
  zoom: number;
}

function ChangeMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export function VolsMap({
  nodes,
  onMapClick,
  accidentResult,
  selectedNodeName,
  reflectometerValue,
  center,
  zoom,
}: VolsMapProps) {
  // Сначала копируем массив, сортируем его по метражу кабеля, а затем берем координаты
  const polylineRoute = [...nodes]
    .sort((a, b) => a.distanceFromStart - b.distanceFromStart)
    .map((node) => [node.lat, node.lng] as [number, number]);

  // Функция для открытия Яндекс.Навигатора / Карт с готовым маршрутом
  const handleBuildRoute = (lat: number, lng: number) => {
    // ИСПРАВЛЕНО: Добавили знаки $ перед переменными координат для правильной склейки строки
    const url = `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=pd`;
    window.open(url.replace(/\s+/g, ""), "_blank");
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        crs={yandexCRS}
        className="map-container"
        attributionControl={false}
      >
        <TileLayer url={yandexTileUrl} />

        <Polyline
          positions={polylineRoute}
          color="blue"
          weight={4}
          dashArray="5, 10"
        />

        <MapEvents onMapClick={onMapClick} />
        <ChangeMapView center={center} zoom={zoom} />

        {/* 1. ЖИВОЙ МАРКЕР ПОЛЬЗОВАТЕЛЯ ("Я ЗДЕСЬ") */}
        {center[0] !== 55.7558 && (
          <Marker position={center} icon={iconsMap.station}>
            {" "}
            {/* Используем иконку станции как временный маркер твоего положения */}
            <Popup>
              <b style={{ color: "#00cc66" }}>🏃‍♂️ Вы находитесь здесь</b>
              <br />
              <span style={{ fontSize: "11px", color: "#666" }}>
                Координаты обновляются по GPS
              </span>
            </Popup>
          </Marker>
        )}

        {/* Маркеры ВОЛС */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={iconsMap[node.type] || iconsMap.closure}
          >
            <Popup>
              <div className="node-popup-content">
                <b className="popup-title">{node.name}</b>
                <br />
                <b>Тип:</b> {typeLabels[node.type]}
                <br />
                <b>ЖД Столб:</b> {node.railwayKm} км, ПК {node.railwayPk}
                <br />
                {node.supportNumber && (
                  <>
                    <b>Опора №:</b> {node.supportNumber}
                    <br />
                  </>
                )}
                <b>Метраж кабеля:</b> {node.distanceFromStart} м<br />
                <button
                  onClick={() => onMapClick(node.lat, node.lng, node)}
                  className="btn-delete-node"
                  style={{ color: "#00cc66", borderColor: "#00cc66" }}
                >
                  ✏️ Редактировать / Удалить
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 2. МАРКЕР АВАРИИ С КНОПКОЙ ПОСТРОЕНИЯ МАРШРУТА */}
        {accidentResult && (
          <Marker position={accidentResult.coords} icon={iconsMap.accident}>
            <Popup>
              <div className="node-popup-content">
                <b className="popup-accident-title">🚨 Место обрыва ВОЛС!</b>
                <br />
                <b>Ориентир:</b> {accidentResult.railwayKm} км, ПК{" "}
                {accidentResult.railwayPk}
                <br />
                <b>Замер от:</b> {selectedNodeName}
                <br />
                <b>Дистанция:</b> {reflectometerValue} м<br />
                {/* КРУТАЯ КНОПКА ДЛЯ НАВИГАЦИИ */}
                <button
                  onClick={() =>
                    handleBuildRoute(
                      accidentResult.coords[0],
                      accidentResult.coords[1],
                    )
                  }
                  className="btn-delete-node"
                  style={{
                    color: "#ff4d4d",
                    borderColor: "#ff4d4d",
                    marginTop: "10px",
                    padding: "6px",
                  }}
                >
                  🗺️ Навигатор: Построить маршрут
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick }: MapEventsProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
