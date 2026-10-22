import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchForecast, describeCode, kmhToMs } from '../lib/openMeteo'
import { fmtTemp, numRu } from '../lib/format'
import { DEFAULT_REGION, BLOCKS, SEASON_STAGES, FEATURES, TESTIMONIALS } from '../data/estate'
import ThemeToggle from '../components/ThemeToggle'

// Заголовок с каскадным появлением букв (в оригинале — GSAP, здесь CSS)
function AnimatedTitle({ lines }) {
  return (
    <h1>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: `${li * 0.35 + i * 0.028}s` }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function LiveWeatherBadge() {
  const [w, setW] = useState(null)
  useEffect(() => {
    fetchForecast(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude)
      .then((f) => setW(f.current))
      .catch(() => setW(null))
  }, [])
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 30 }}>🌡️</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          {w ? `${fmtTemp(w.temperature_2m)} · ${describeCode(w.weather_code)}` : 'Загрузка живых данных…'}
        </div>
        <div className="small muted">
          {w
            ? `${DEFAULT_REGION.location} · ветер ${kmhToMs(w.wind_speed_10m)} м/с · влажность ${w.relative_humidity_2m}% · сейчас`
            : `Погода Open-Meteo для ${DEFAULT_REGION.location}`}
        </div>
      </div>
      <span className="badge badge-green" style={{ marginLeft: 'auto' }}>LIVE</span>
    </div>
  )
}

function DashboardMock() {
  return (
    <div className="mock">
      <div className="browser-bar">
        <i /><i /><i />
        <span className="url">vine-krym.local · Дашборд · {DEFAULT_REGION.name}</span>
        <span className="badge badge-green">LIVE</span>
      </div>
      <div className="small muted">
        {DEFAULT_REGION.name} — {DEFAULT_REGION.location} ·{' '}
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <div className="grid grid-4" style={{ marginTop: 12 }}>
        <div className="kpi"><span className="label">Площадь, га</span><span className="value">{numRu(DEFAULT_REGION.acres)}</span><span className="delta up">▲ 2,1%</span></div>
        <div className="kpi"><span className="label">Прогноз урожая, т/га</span><span className="value">4,2</span><span className="delta up">▲ 4,8%</span></div>
        <div className="kpi"><span className="label">Здоровье лоз</span><span className="value">94</span><span className="delta up">▲ 1,6%</span></div>
        <div className="kpi"><span className="label">GDD (база 10°C)</span><span className="value">1 842</span><span className="delta up">▲ 6,3%</span></div>
      </div>
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="small muted">NDVI — тренд 14 дней</div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>0,84</div>
          <div className="healthbar" style={{ marginTop: 8 }}><i style={{ width: '84%' }} /></div>
        </div>
        <div className="card">
          <div className="small muted">Контроль заморозков</div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>+4°C</div>
          <div className="small muted" style={{ marginTop: 6 }}>Ночь: минимум +4°C — риски низкие</div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div>
      <header className="landing-nav">
        <div className="container inner">
          <Link to="/" className="brand"><img src="/grape.svg" width={24} alt="" /> ВинКрым</Link>
          <nav>
            <Link to="/#features">Возможности</Link>
            <Link to="/#season">Сезон</Link>
            <Link to="/#testimonials">Отзывы</Link>
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <ThemeToggle />
            <Link to="/login" className="btn btn-ghost">Войти</Link>
            <Link to="/login?demo=true" className="btn btn-primary">Живое демо</Link>
          </div>
        </div>
      </header>

      <section className="hero container">
        <div className="kicker">Платформа точного виноградарства</div>
        <AnimatedTitle lines={['Аналитика для', 'каждого гектара.']} />
        <p className="lead">
          ВинКрым объединяет погоду, состояние лозы и урожайную аналитику в одном центре
          управления — решения о заморозках, поливе и датах сбора принимаются с уверенностью.
        </p>
        <div className="cta-row">
          <Link to="/login" className="btn btn-primary">Начать бесплатно</Link>
          <Link to="/login?demo=true" className="btn btn-ghost">Открыть демо</Link>
        </div>
        <div className="fineprint">
          <span>14 дней бесплатно</span>
          <span>Без банковской карты</span>
          <span>Настройка за вечер</span>
        </div>
        <DashboardMock />
      </section>

      <div className="container stat-strip" id="stats">
        <div><div className="num">250+</div><div className="cap">гектаров в демо-портфеле</div></div>
        <div><div className="num">1 842</div><div className="cap">GDD отслеживается за сезон</div></div>
        <div><div className="num">36 ч</div><div className="cap">заблаговременность оповещений</div></div>
        <div><div className="num">99,9%</div><div className="cap">доступность платформы</div></div>
      </div>

      <section className="section container" id="season">
        <div className="section-head">
          <div className="eyebrow">От лозы до бокала</div>
          <h2>Один сезон. Каждый сигнал. Без догадок.</h2>
          <p>ВинКрым ведёт виноградник от распускания почек до сбора урожая.</p>
        </div>
        <div className="grid grid-4">
          {SEASON_STAGES.map((s) => (
            <div className="card" key={s.key}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{s.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container" id="features">
        <div className="section-head">
          <div className="eyebrow">Платформа</div>
          <h2>Всё, что требует сезон, в одном месте</h2>
        </div>
        <div className="grid grid-3">
          {FEATURES.map((f) => (
            <div className="card" key={f.title}>
              <div style={{ fontSize: 24 }}>{f.icon}</div>
              <h3 style={{ margin: '10px 0 6px', fontSize: 16 }}>{f.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div className="eyebrow">Живые данные</div>
          <h2>Погода хозяйства — прямо сейчас</h2>
          <p>Демо показывает реальные данные Open-Meteo для хозяйства по умолчанию — {DEFAULT_REGION.name}, {DEFAULT_REGION.location}.</p>
        </div>
        <LiveWeatherBadge />
      </section>

      <section className="section container" id="testimonials">
        <div className="section-head">
          <div className="eyebrow">Люди</div>
          <h2>Тем, кто собирает урожай, доверяют цифры</h2>
        </div>
        <div className="grid grid-3">
          {TESTIMONIALS.map((t) => (
            <figure className="card" key={t.name} style={{ margin: 0 }}>
              <blockquote className="quote" style={{ margin: '0 0 12px' }}>{t.quote}</blockquote>
              <figcaption>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div className="small muted">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', margin: '0 0 10px' }}>
          Лучший урожай начинается с лучших данных.
        </h2>
        <p className="muted" style={{ margin: '0 auto 22px', maxWidth: 560 }}>
          Присоединяйтесь к хозяйствам Крыма. 14 дней бесплатно — первый виноградник
          наш, пока вы не убедитесь.
        </p>
        <Link to="/login" className="btn btn-primary">Начать бесплатно</Link>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="cols">
            <div style={{ maxWidth: 280 }}>
              <div className="brand" style={{ marginBottom: 10 }}><img src="/grape.svg" width={20} alt="" /> ВинКрым</div>
              <p className="small muted">Аналитика для каждого гектара. Операционная система для современных виноградарских команд.</p>
            </div>
            <div>
              <h4>Продукт</h4>
              <ul>
                <li><a href="#features">Возможности</a></li>
                <li><a href="#season">Сезонный цикл</a></li>
                <li><Link to="/login?demo=true">Живое демо</Link></li>
              </ul>
            </div>
            <div>
              <h4>Ресурсы</h4>
              <ul>
                <li><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo API</a></li>
                <li><a href="https://recharts.org/" target="_blank" rel="noreferrer">Recharts</a></li>
              </ul>
            </div>
            <div>
              <h4>Демо-хозяйства</h4>
              <ul>
                <li>Винодельня Акчурина · Терновка</li>
                <li>UPPA Winery · Родное</li>
                <li>Золотая Балка · Балаклава</li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <span>© 2026 ВинКрым · учебная clean-room копия интерфейса, данные — Open-Meteo</span>
            <span>Блоков в демо: {BLOCKS.length}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
