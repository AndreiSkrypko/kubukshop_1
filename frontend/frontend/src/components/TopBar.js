import React from "react";
import "../css/TopBar.css"; // Не забудь подключить стили

export default function TopBar() {
  return (
    <div className="topbar py-1 small">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          При заказе от <strong>4 000 ₽</strong> — Бесплатная доставка
        </div>
        <div>
          Часы работы: <strong>10:00 - 17:00</strong>
        </div>
      </div>
    </div>
  );
}
