import { useState } from "react";
import type { CableNode } from "../types/vols";
import { typeLabels } from "../utils/volsData";
import "./AddNodeModal.css";

interface AddNodeModalProps {
  onClose: () => void;
  onSave: (
    nodeData: Omit<CableNode, "id" | "lat" | "lng" | "sectionId">,
  ) => void;
  currentNode?: CableNode | null;
  onDelete?: () => void;
}

export function AddNodeModal({
  onClose,
  onSave,
  currentNode,
  onDelete,
}: AddNodeModalProps) {
  const [pointType, setPointType] = useState<CableNode["type"]>(
    currentNode ? currentNode.type : "closure",
  );
  const [pointName, setPointName] = useState<string>(
    currentNode ? currentNode.name : "Муфта на опоре №",
  );
  const [distance, setDistance] = useState<string>(
    currentNode ? String(currentNode.distanceFromStart) : "",
  );
  const [railKm, setRailKm] = useState<string>(
    currentNode ? String(currentNode.railwayKm || "") : "",
  );
  const [railPk, setRailPk] = useState<string>(
    currentNode ? String(currentNode.railwayPk || "") : "",
  );
  const [supportNum, setSupportNum] = useState<string>(
    currentNode ? currentNode.supportNumber || "" : "",
  );

  const handleTypeChange = (typeKey: CableNode["type"]) => {
    setPointType(typeKey);
    if (!currentNode) {
      if (typeKey === "closure") setPointName("Муфта на опоре №");
      else if (typeKey === "station") setPointName("Станция ");
      else if (typeKey === "slack") setPointName("Технологический запас ");
      else if (typeKey === "burn") setPointName("Оплавление кабеля ");
      else if (typeKey === "bullet") setPointName("Прострел кабеля ");
      else if (typeKey === "partial") setPointName("Частичный обрыв ");
      else if (typeKey === "thermal") setPointName("Деградация ");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName || !distance) return;

    onSave({
      name: pointName,
      type: pointType,
      distanceFromStart: Number(distance),
      railwayKm: Number(railKm) || 0,
      railwayPk: Number(railPk) || 0,
      supportNumber: supportNum,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">
            {currentNode
              ? "✏️ Редактирование точки ВОЛС"
              : "📍 Новая точка ВОЛС"}
          </h3>
          <button type="button" className="modal-close-x" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Форма теперь содержит ТОЛЬКО поля ввода */}
        <form
          id="vols-modal-form"
          onSubmit={handleSubmit}
          className="modal-form"
        >
          <div className="form-group">
            <label className="modal-label">Выберите тип объекта:</label>
            <div className="type-grid">
              {Object.keys(typeLabels).map((key) => {
                const typeKey = key as CableNode["type"];
                return (
                  <button
                    key={typeKey}
                    type="button"
                    className={`type-card ${pointType === typeKey ? "type-card-active" : ""}`}
                    onClick={() => handleTypeChange(typeKey)}
                  >
                    {typeLabels[typeKey]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-row-two-columns">
            <div className="form-group">
              <label className="modal-label">Название / Примечание:</label>
              <input
                type="text"
                value={pointName}
                onChange={(e) => setPointName(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="modal-input-field"
                required
              />
            </div>

            <div className="form-group">
              <label className="modal-label">Рефлектометр (метры):</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="modal-input-field"
                required
              />
            </div>
          </div>

          <div className="form-row-three-columns">
            <div className="form-group">
              <label className="modal-label">ЖД Километр:</label>
              <input
                type="number"
                value={railKm}
                onChange={(e) => setRailKm(e.target.value)}
                className="modal-input-field"
              />
            </div>
            <div className="form-group">
              <label className="modal-label">ЖД Пикет (0-10):</label>
              <input
                type="number"
                value={railPk}
                onChange={(e) => setRailPk(e.target.value)}
                className="modal-input-field"
                min="0"
                max="10"
              />
            </div>
            <div className="form-group">
              <label className="modal-label">Номер опоры:</label>
              <input
                type="text"
                value={supportNum}
                onChange={(e) => setSupportNum(e.target.value)}
                className="modal-input-field"
              />
            </div>
          </div>
        </form>

        {/* КНОПКИ ДЕЙСТВИЙ ВЫНЕСЕНЫ ИЗ ФОРМЫ НАРУЖУ */}
        <div className="modal-actions">
          {currentNode && onDelete ? (
            <button
              type="button"
              className="btn-reset"
              style={{
                borderColor: "#ff4d4d",
                color: "#ff4d4d",
                background: "none",
              }}
              onClick={onDelete}
            >
              🗑 Удалить
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            {/* Атрибут form связывает кнопку отправки с формой выше */}
            <button
              type="submit"
              form="vols-modal-form"
              className="btn-modal-save"
            >
              💾 Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
