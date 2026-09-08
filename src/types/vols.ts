// src/types/vols.ts

/**
 * Идентификаторы сущностей.
 * Используем строки, но выделяем в отдельные типы для лучшей типобезопасности.
 */
export type CableSectionId = string;
export type CableNodeId = string;

/**
 * Типы узлов кабельной линии (муфты, опоры, запас и т.д.).
 */
export type CableNodeType =
  | "station"
  | "closure"
  | "slack"
  | "burn"
  | "bullet"
  | "partial"
  | "thermal";

/**
 * Кабельная секция (участок ВОЛС между ключевыми точками).
 */
export interface CableSection {
  id: CableSectionId;
  name: string;
}

/**
 * Узел кабельной линии (муфта, опора, точка измерения и т.п.).
 *
 * distanceFromStart — расстояние от начала секции в метрах (или в тех единицах,
 * которые используются в расчётах; важно, чтобы было единообразно во всём приложении).
 * railwayKm / railwayPk — километр и пикет железной дороги (если применимо).
 */
export interface CableNode {
  id: CableNodeId;
  sectionId: CableSectionId;
  name: string;
  type: CableNodeType;

  /** Координаты для отображения на карте (Leaflet). */
  lat: number;
  lng: number;

  /** Расстояние от начала секции до узла. */
  distanceFromStart: number;

  /** Позиция на железной дороге (км/пикет). */
  railwayKm: number;
  railwayPk: number;

  /** Номер опоры (если узел привязан к опоре). */
  supportNumber?: string;
}
