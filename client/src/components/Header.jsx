import React from 'react'

const buttons = ['home','+task','analysis','calendar','overview']

export default function Header({ onNavigate, theme, toggleTheme }){
  return (
    <header className="header">
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div className="brand">Growthledger</div>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <div className="nav-buttons">
          {buttons.map(b => (
            <button key={b} className={b==='+task'? 'primary':''} onClick={()=> onNavigate(b)}>{b}</button>
          ))}
        </div>
        <button onClick={toggleTheme} style={{marginLeft:8}}>{theme==='dark' ? '🌙' : '☀️'}</button>
      </div>
    </header>
  )
}
