import React from "react";
import "../css/About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Заголовок страницы */}
      <div className="about-header">
        <div className="container text-center">
          <h1 className="about-title">О компании KubukShop</h1>
          <p className="about-subtitle">Мы создаем качественные товары с любовью и заботой о наших клиентах</p>
        </div>
      </div>

      {/* Основная информация */}
      <div className="about-content">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <h2 className="section-title">Наша история</h2>
              <p className="section-text">
                KubukShop был основан в 2020 году с целью предоставить людям доступ к качественным товарам 
                по разумным ценам. Мы начали с небольшого магазина игрушек и выросли в полноценный 
                интернет-магазин с широким ассортиментом товаров для всей семьи.
              </p>
              <p className="section-text">
                За эти годы мы помогли тысячам семей найти именно то, что им нужно, и продолжаем 
                развиваться, следуя принципам качества, надежности и отличного сервиса.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="about-image">
                <span className="about-icon">🏪</span>
              </div>
            </div>
          </div>

          {/* Миссия и ценности */}
          <div className="row mb-5">
            <div className="col-lg-6 text-center">
              <div className="about-image">
                <span className="about-icon">🎯</span>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="section-title">Наша миссия</h2>
              <p className="section-text">
                Мы стремимся сделать качественные товары доступными для каждого, кто ценит 
                комфорт, надежность и стиль. Наша цель - стать вашим надежным партнером 
                в выборе товаров для дома, семьи и личного использования.
              </p>
              <div className="values-list">
                <h4>Наши ценности:</h4>
                <ul>
                  <li>✨ Качество превыше всего</li>
                  <li>🤝 Честность и прозрачность</li>
                  <li>👥 Забота о клиентах</li>
                  <li>🚀 Постоянное развитие</li>
                  <li>🌱 Ответственность перед обществом</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Команда */}
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title">Наша команда</h2>
              <p className="section-subtitle">Профессионалы, которые делают KubukShop лучше с каждым днем</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="team-card">
                <div className="team-avatar">👨‍💼</div>
                <h5 className="team-name">Александр Петров</h5>
                <p className="team-position">Генеральный директор</p>
                <p className="team-description">
                  Более 10 лет опыта в розничной торговле. 
                  Отвечает за стратегическое развитие компании.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="team-card">
                <div className="team-avatar">👩‍💻</div>
                <h5 className="team-name">Мария Сидорова</h5>
                <p className="team-position">Руководитель отдела продаж</p>
                <p className="team-description">
                  Эксперт в области клиентского сервиса. 
                  Обеспечивает высокий уровень обслуживания клиентов.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="team-card">
                <div className="team-avatar">👨‍🔧</div>
                <h5 className="team-name">Дмитрий Козлов</h5>
                <p className="team-position">Технический директор</p>
                <p className="team-description">
                  Отвечает за развитие IT-инфраструктуры и 
                  техническую поддержку платформы.
                </p>
              </div>
            </div>
          </div>

          {/* Достижения */}
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title">Наши достижения</h2>
              <p className="section-subtitle">Цифры, которые говорят сами за себя</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="achievement-card">
                <div className="achievement-number">10,000+</div>
                <div className="achievement-label">Довольных клиентов</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="achievement-card">
                <div className="achievement-number">50,000+</div>
                <div className="achievement-label">Успешных заказов</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="achievement-card">
                <div className="achievement-number">3+</div>
                <div className="achievement-label">Года на рынке</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="achievement-card">
                <div className="achievement-number">24/7</div>
                <div className="achievement-label">Поддержка клиентов</div>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="row text-center">
            <div className="col-12">
              <h2 className="section-title">Свяжитесь с нами</h2>
              <p className="section-subtitle">Мы всегда рады ответить на ваши вопросы</p>
              <div className="contact-info">
                <div className="row">
                  <div className="col-md-4">
                    <div className="contact-item">
                      <div className="contact-icon">📧</div>
                      <h5>Email</h5>
                      <p>info@kubukshop.ru</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="contact-item">
                      <div className="contact-icon">📱</div>
                      <h5>Телефон</h5>
                      <p>+7 (800) 555-35-35</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="contact-item">
                      <div className="contact-icon">📍</div>
                      <h5>Адрес</h5>
                      <p>г. Москва, ул. Примерная, д. 123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
