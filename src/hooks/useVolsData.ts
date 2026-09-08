// src/hooks/useVolsData.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  CableNode,
  CableSection,
  CableSectionId,
  CableNodeId,
} from "../types/vols";
import { initialNodes, initialSections } from "../utils/volsData";

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Повреждённые или устаревшие данные → возвращаем дефолт
    return fallback;
  }
}

export function useVolsData() {
  const [sections, setSections] = useState<CableSection[]>(() =>
    safeParseJson<CableSection[]>(
      localStorage.getItem("vols_sections"),
      initialSections,
    ),
  );

  const [nodes, setNodes] = useState<CableNode[]>(() =>
    safeParseJson<CableNode[]>(
      localStorage.getItem("vols_nodes"),
      initialNodes,
    ),
  );

  const [selectedSectionId, setSelectedSectionId] = useState<CableSectionId>(
    () => {
      // При первой инициализации берём первую секцию, если она есть
      const initial = safeParseJson<CableSection[]>(
        localStorage.getItem("vols_sections"),
        initialSections,
      );
      return initial.length > 0 ? initial[0].id : "";
    },
  );

  const [selectedNodeId, setSelectedNodeId] = useState<CableNodeId>("");

  const filteredNodes = useMemo<CableNode[]>(() => {
    if (!selectedSectionId) return [];
    return nodes
      .filter((n) => n.sectionId === selectedSectionId)
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart);
  }, [nodes, selectedSectionId]);

  const currentActiveId = useMemo<CableNodeId>(() => {
    if (filteredNodes.length === 0) return "";
    if (filteredNodes.some((n) => n.id === selectedNodeId)) {
      return selectedNodeId;
    }
    return filteredNodes[0].id;
  }, [filteredNodes, selectedNodeId]);

  const selectedNode = useMemo<CableNode | undefined>(() => {
    if (!currentActiveId) return undefined;
    return filteredNodes.find((n) => n.id === currentActiveId);
  }, [filteredNodes, currentActiveId]);

  // Сохранение в localStorage при изменении данных
  useEffect(() => {
    try {
      localStorage.setItem("vols_sections", JSON.stringify(sections));
      localStorage.setItem("vols_nodes", JSON.stringify(nodes));
    } catch {
      // Игнорируем ошибки записи (например, квота превышена)
    }
  }, [sections, nodes]);

  const handleAddSection = useCallback((name: string) => {
    const newSec: CableSection = { id: `sec-${Date.now()}`, name };
    setSections((prev) => [...prev, newSec]);
    setSelectedSectionId(newSec.id);
  }, []);

  const handleRenameSection = useCallback(
    (id: CableSectionId, newName: string) => {
      if (!newName.trim()) return;
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: newName } : s)),
      );
    },
    [],
  );

  const handleDeleteSection = useCallback(
    (id: CableSectionId) => {
      const sectionToDelete = sections.find((s) => s.id === id);
      if (!sectionToDelete) return;

      if (
        confirm(
          `Вы уверены, что хотите удалить секцию "${sectionToDelete.name}" и ВСЕ муфты на ней?`,
        )
      ) {
        setSections((prev) => prev.filter((s) => s.id !== id));
        setNodes((prev) => prev.filter((n) => n.sectionId !== id));

        // Переключаем активную секцию на первую оставшуюся
        const updatedSections = sections.filter((s) => s.id !== id);
        if (updatedSections.length > 0) {
          setSelectedSectionId(updatedSections[0].id);
        } else {
          setSelectedSectionId("");
        }
      }
    },
    [sections],
  );

  const handleSaveNewNode = useCallback(
    (
      modalData: Omit<CableNode, "id" | "lat" | "lng" | "sectionId">,
      pendingCoords: { lat: number; lng: number } | null,
      editingNode: CableNode | null,
    ) => {
      if (!pendingCoords || !selectedSectionId) return;

      if (editingNode) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === editingNode.id ? { ...n, ...modalData } : n,
          ),
        );
      } else {
        const newNode: CableNode = {
          id: `click-${Date.now()}`,
          sectionId: selectedSectionId,
          lat: pendingCoords.lat,
          lng: pendingCoords.lng,
          ...modalData,
        };
        setNodes((prev) => [...prev, newNode]);
      }
    },
    [selectedSectionId],
  );

  const handleDeleteNode = useCallback((id: CableNodeId, name: string) => {
    if (confirm(`Удалить точку "${name}"?`)) {
      setNodes((prev) => prev.filter((n) => n.id !== id));
    }
  }, []);

  const handleResetData = useCallback(() => {
    if (confirm("Очистить всю базу данных, включая все кабельные секции?")) {
      localStorage.removeItem("vols_nodes");
      localStorage.removeItem("vols_sections");
      setNodes([]);
      setSections([]);
      setSelectedSectionId("");
      setSelectedNodeId("");
    }
  }, []);

  return {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    filteredNodes,
    selectedNodeId: currentActiveId,
    setSelectedNodeId,
    selectedNode,
    handleAddSection,
    handleRenameSection,
    handleDeleteSection,
    handleSaveNewNode,
    handleDeleteNode,
    handleResetData,
  };
}
