import type { CableSection, CableNode } from "../types/vols";

// База секций изначально абсолютно пуста для универсальности приложения
export const initialSections: CableSection[] = [];

export const initialNodes: CableNode[] = [];

export const typeLabels: Record<string, string> = {
  station: "🚉 Станция / Связевая",
  closure: "💼 Оптическая муфта",
  slack: "🔄 Технологический запас",
  burn: "🔥 Оплавление кабеля",
  bullet: "🎯 Прострел кабеля",
  partial: "⚡ Частичный обрыв волокон",
  thermal: "📉 Электротермическая деградация",
};
