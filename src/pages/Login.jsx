import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { DEMO_USER } from '../data/estate'

export default function Login() {
  const [params] = useSearchParams()
  const demo = params.get('demo') === 'true'
  const [email, setEmail] = useState(demo ? DEMO_USER.email : '')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    // Демо-режим: пропускаем любого — как в оригинале
    localStorage.setItem('vinekrym_session', JSON.stringify({ ...DEMO_USER, email }))
    navigate('/app')
  }

  return (
    <div className="container">
      <header className="landing-nav" style={{ position: 'static', marginBottom: 20 }}>
        <div className="inner">
          <Link to="/" className="brand"><img src="/grape.svg" width={24} alt="" /> ВинКрым</Link>
        </div>
      </header>
      <div className="login-wrap">
        <div>
          <h1 style={{ marginTop: 0 }}>С возвращением в виноградник</h1>
          {demo && (
            <p className="muted">
              Демо-среда — данные хозяйства «Усадьба Качинская», Севастополь.
              Подойдёт любая почта и пароль.
            </p>
          )}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Почта</label>
              <input
                id="email"
                type="email"
                placeholder="you@vinogradnik.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder={demo ? "Любой — это демо" : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              Войти {demo ? 'в демо' : ''}
            </button>
          </form>
          <p className="small muted" style={{ marginTop: 14 }}>
            Без регистрации: сессия хранится локально в браузере, погода — живая,
            от Open-Meteo по координатам хозяйства.
          </p>
        </div>
        <div className="card">
          <blockquote className="quote" style={{ margin: '0 0 14px', fontSize: 17 }}>
            «Урожай собрали на три дня раньше среднего по региону — и это сделало вино».
          </blockquote>
          <div style={{ fontWeight: 600 }}>Ирина Соколова</div>
          <div className="small muted">Агроном · Усадьба Качинская, Севастополь</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <span className="badge badge-green">Живая погода</span>
            <span className="badge badge-green">Модели GDD</span>
            <span className="badge badge-green">Оповещения о заморозках</span>
          </div>
        </div>
      </div>
    </div>
  )
}
