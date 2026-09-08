// src/components/HeaderControls.tsx
import { useState, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CableSection, CableNode } from "../types/vols";
import "./HeaderControls.css";

interface HeaderControlsProps {
  sections: CableSection[];
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  onAddSection: (name: string) => void;
  onRenameSection: (id: string, newName: string) => void;
  onDeleteSection: (id: string) => void;
  nodes: CableNode[];
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  direction: "forward" | "backward";
  setDirection: (dir: "forward" | "backward") => void;
  reflectometerValue: number | "";
  setReflectometerValue: (val: number | "") => void;
  onCalculate: () => void;
  onReset: () => void;
  onLogout: () => void;
}

export function HeaderControls({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  onAddSection,
  onRenameSection,
  onDeleteSection,
  nodes,
  selectedNodeId,
  setSelectedNodeId,
  direction,
  setDirection,
  reflectometerValue,
  setReflectometerValue,
  onCalculate,
  onReset,
  onLogout,
}: HeaderControlsProps) {
  const [newSectionName, setNewSectionName] = useState("");

  const handleCreateSection = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!newSectionName.trim()) return;
      onAddSection(newSectionName.trim());
      setNewSectionName("");
    },
    [newSectionName, onAddSection],
  );

  const handleRenameClick = useCallback(() => {
    const currentSection = sections.find((s) => s.id === selectedSectionId);
    if (!currentSection) return;

    const newName = prompt(
      "Введите новое название для секции:",
      currentSection.name,
    );
    if (newName !== null && newName.trim()) {
      onRenameSection(selectedSectionId, newName.trim());
    }
  }, [sections, selectedSectionId, onRenameSection]);

  const handleDeleteClick = useCallback(() => {
    onDeleteSection(selectedSectionId);
  }, [onDeleteSection, selectedSectionId]);

  const handleReflectometerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setReflectometerValue(raw === "" ? "" : Number(raw));
    },
    [setReflectometerValue],
  );

  return (
    <header className="app-header">
      <div className="header-top-row">
        <h3 className="header-title">📦 ВОЛС-Локатор</h3>
      </div>

      <div className="controls-row">
        <div
          className="control-label label-section"
          style={{ display: "flex", flexDirection: "column", gap: "4px" }}
        >
          <span>📁 Кабельная секция:</span>
          <div style={{ display: "flex", gap: "4px", width: "100%" }}>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="control-select"
              style={{ flex: 1, minWidth: "0" }}
            >
              {sections.length === 0 && (
                <option value="">(Создайте первую секцию ниже)</option>
              )}
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>

            {selectedSectionId && (
              <>
                <button
                  type="button"
                  title="Переименовать текущую секцию"
                  onClick={handleRenameClick}
                  className="btn-add-section"
                  style={{ padding: "0 8px", fontSize: "12px" }}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  title="Удалить текущую секцию"
                  onClick={handleDeleteClick}
                  className="btn-add-section"
                  style={{
                    padding: "0 8px",
                    fontSize: "12px",
                    borderColor: "var(--accent-red)",
                    color: "var(--accent-red)",
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleCreateSection} className="add-section-form">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Новая секция/перегон..."
            className="control-input"
          />
          <button type="submit" className="btn-add-section">
            ➕
          </button>
        </form>

        <label className="control-label label-node">
          1. Точка замера:
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="control-select"
          >
            {nodes.length === 0 && <option value="">(Нет точек)</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </label>

        <label className="control-label label-dir">
          2. Направление:
          <select
            value={direction}
            onChange={(e) =>
              setDirection(e.target.value as "forward" | "backward")
            }
            className="control-select"
          >
            <option value="forward">По км (→)</option>
            <option value="backward">Против км (←)</option>
          </select>
        </label>

        <label className="control-label label-ref">
          3. Рефлектометр (м):
          <input
            type="number"
            value={reflectometerValue === "" ? "" : reflectometerValue}
            onChange={handleReflectometerChange}
            className="control-input"
          />
        </label>

        <div style={{ display: "flex", gap: "6px" }}>
          <button type="button" onClick={onCalculate} className="btn-calculate">
            Рассчитать
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn-calculate"
            style={{ backgroundColor: "#555" }}
          >
            Сбросить
          </button>
        </div>
      </div>

      <button type="button" onClick={onLogout} className="btn-logout">
        🔒 Выйти
      </button>
    </header>
  );
}
