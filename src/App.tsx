import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";

import type { CableNode } from "./types/vols";
import { useVolsData } from "./hooks/useVolsData";
import { useVolsCalculations } from "./hooks/useVolsCalculations";

import { HeaderControls } from "./components/HeaderControls";
import { VolsMap } from "./components/VolsMap";
import { AddNodeModal } from "./components/AddNodeModal";
import { LoginScreen } from "./components/LoginScreen";

export default function App() {
  // Простая авторизация
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("vols_auth") === "true";
  });

  // Подключаем наши кастомные слайсы логики
  const volsData = useVolsData();
  const volsCalc = useVolsCalculations(
    volsData.filteredNodes,
    volsData.selectedNode,
  );

  // Стейт отображения карты и модалок
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    42.0678, 48.2891,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [editingNode, setEditingNode] = useState<CableNode | null>(null);

  // GPS-центрирование, если секция пустая
  useEffect(() => {
    if (
      isAuthenticated &&
      volsData.filteredNodes.length === 0 &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(15);
        },
        null,
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, [isAuthenticated, volsData.filteredNodes.length]);

  const handleLoginSuccess = () => {
    localStorage.setItem("vols_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("vols_auth");
    setIsAuthenticated(false);
    volsCalc.resetAccident();
  };

  const handleMapClickTrigger = (
    lat: number,
    lng: number,
    editNode?: CableNode,
  ) => {
    if (!volsData.selectedSectionId && !editNode) {
      alert("Сначала создайте и выберите кабельную секцию в меню справа!");
      return;
    }

    if (editNode) {
      setEditingNode(editNode);
      setPendingCoords({ lat: editNode.lat, lng: editNode.lng });
    } else {
      setEditingNode(null);
      setPendingCoords({ lat, lng });
    }
    volsOpenModal();
  };

  const volsOpenModal = () => setModalOpen(true);
  const volsCloseModal = () => {
    setModalOpen(false);
    setEditingNode(null);
    setPendingCoords(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <VolsMap
          nodes={volsData.filteredNodes}
          onMapClick={handleMapClickTrigger}
          accidentResult={volsCalc.accidentResult}
          selectedNodeName={volsData.selectedNode?.name || ""}
          reflectometerValue={volsCalc.reflectometerValue}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <HeaderControls
        sections={volsData.sections}
        selectedSectionId={volsData.selectedSectionId}
        setSelectedSectionId={volsData.setSelectedSectionId}
        onAddSection={volsData.handleAddSection}
        onRenameSection={volsData.handleRenameSection} // 🆕 ДОБАВИЛИ ТУТ
        onDeleteSection={volsData.handleDeleteSection} // 🆕 ДОБАВИЛИ ТУТ
        nodes={volsData.filteredNodes}
        selectedNodeId={volsData.selectedNodeId}
        setSelectedNodeId={volsData.setSelectedNodeId}
        direction={volsCalc.direction}
        setDirection={volsCalc.setDirection}
        reflectometerValue={volsCalc.reflectometerValue}
        setReflectometerValue={volsCalc.setReflectometerValue}
        onCalculate={volsCalc.handleCalculate}
        onReset={() => {
          volsData.handleResetData();
          volsCalc.resetAccident();
          setMapZoom(5);
        }}
        onLogout={handleLogout}
      />

      {modalOpen && (
        <AddNodeModal
          onClose={volsCloseModal}
          onSave={(modalData) => {
            volsData.handleSaveNewNode(modalData, pendingCoords, editingNode);
            volsCloseModal();
          }}
          currentNode={editingNode}
          onDelete={() => {
            if (editingNode) {
              volsData.handleDeleteNode(editingNode.id, editingNode.name);
              volsCloseModal();
            }
          }}
        />
      )}
    </div>
  );
}
