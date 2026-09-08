import { useState } from "react";
import './LoginScreen.css';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ЖЕСТКАЯ КОРПОРАТИВНАЯ ПРОВЕРКА (БЕЗ ВНЕШНИХ СЕРВЕРОВ)
    // Идеально для демонстрации руководству и безопасного пуша на GitHub
    if (username.trim().toLowerCase() === "admin" && password === "vols-2026") {
      setError("");
      onLoginSuccess();
    } else {
      setError("❌ Неверный логин или корпоративный пароль!");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-header">
          <span style={{ fontSize: "32px" }}>🔒</span>
          <h2 className="login-title">ВОЛС-Локатор</h2>
          <p className="login-subtitle">
            Вход в систему
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-msg">{error}</div>}

          <div className="form-group">
            <label className="modal-label">
              Имя пользователя (Табельный номер):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modal-input-field"
              placeholder="например, admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="modal-label">Корпоративный пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-modal-save"
            style={{ width: "100%", marginTop: "10px", padding: "12px" }}
          >
            🔑 Авторизоваться и открыть карту
          </button>
        </form>

        <div className="login-footer">
          <p>⚠️ Данные трассы ВОЛС являются конфиденциальными.</p>
          <p style={{ color: "#666", fontSize: "11px", marginTop: "5px" }}>
            Демо-доступ для GitHub: admin / vols-2026
          </p>
        </div>
      </div>
    </div>
  );
}
