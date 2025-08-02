import React from "react";
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-4">
      <div className="container">
        {/* Подписка */}
        <div className="row mb-4 subscribe-section">
          <div className="col-md-6 mb-3">
            <h5 className="mb-3">Будьте в курсе</h5>
            <p>Подпишитесь на последние обновления и узнавайте о новинках и специальных предложениях первыми.</p>
          </div>
          <div className="col-md-6">
            <form className="d-flex subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="form-control me-2"
                placeholder="Введите ваш email"
                required
              />
              <button className="btn btn-primary" type="submit">Подписаться</button>
            </form>
          </div>
        </div>

        {/* Основной контент */}
        <div className="row footer-main">
          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="footer-title">Каталог</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="#">Акции</a></li>
              <li><a href="#">Новинки</a></li>
              <li><a href="#">Товары дня</a></li>
              <li><a href="#">Распродажа</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="footer-title">Компания</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="#">О нас</a></li>
              <li><a href="#">Контакты</a></li>
              <li><a href="#">Банковские реквизиты</a></li>
              <li><a href="#">Отзывы о магазине</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="footer-title">Покупателям</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="#">Как заказать</a></li>
              <li><a href="#">Оплата и доставка</a></li>
              <li><a href="#">Возврат</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="footer-title">Информация</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="#">Частые вопросы</a></li>
              <li><a href="#">Руководство по цветам</a></li>
              <li><a href="#">Сертификаты</a></li>
              <li><a href="#">Юридическая информация</a></li>
            </ul>
          </div>
        </div>

        {/* Контакты и юр. информация */}
        <div className="row footer-info mt-4 pt-3 border-top">
          <div className="col-md-6">
            <p><strong>ИП Буратино Папа Карлович</strong></p>
            <p>ИНН 502703144973 | ОГРНИП 315502700017484</p>
            <p>Бесплатные чаты: <a href="tel:+79150643247" className="text-light">+7 (915) 064-32-47</a></p>
            <p>Бесплатный звонок по РФ: <a href="tel:88002226190" className="text-light">8 (800) 222-61-90</a></p>
            <button className="btn btn-outline-light btn-sm mt-2">Заказать звонок</button>
            <p className="mt-3">E-mail: <a href="mailto:info@vyberi-kubik.ru" className="text-light">info@vyberi-kubik.ru</a></p>
          </div>

          <div className="col-md-6 legal text-muted small">
            <p>
              Логотипы LEGO, DUPLO, а также minifigure (минифигурка) являются торговыми марками корпорации The LEGO Group. Этот сайт не уполномочен и не спонсируется корпорацией The LEGO Group. Пользование данным сайтом означает ваше согласие с опубликованным договором офертой. Мы получаем и обрабатываем персональные данные посетителей нашего сайта в соответствии с официальной политикой обработки персональных данных.
            </p>
            <p>© 2025 Выбери-Кубик - интернет-магазин деталей LEGO</p>
            <p>Разработка и дизайн w</p>
            <p>
              <a href="#" className="text-light footer-link">Пользовательское соглашение</a> | <a href="#" className="text-light footer-link">Политика конфиденциальности</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
