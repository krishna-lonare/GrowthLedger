import React, { useEffect, useState } from 'react'
import api from '../api'

function getMonthDays(year, month){
  const res = []
  const date = new Date(year, month, 1)
  while(date.getMonth()===month){
    res.push(new Date(date))
    date.setDate(date.getDate()+1)
  }
  return res
}

export default function CalendarView({ theme }){
  const now = new Date()
  const [map, setMap] = useState({})
  const year = now.getFullYear(), month = now.getMonth()
  const isDark = theme === 'dark'

  useEffect(()=>{
    async function load(){
      const monthStr = `${year}-${String(month+1).padStart(2,'0')}`
      try{
        const res = await api.get('/tasks/analysis/calendar', { params: { month: monthStr } })
        const m = {};
        res.data.forEach(d=> m[d.date] = d.percent)
        setMap(m)
      }catch(err){ console.error(err) }
    }
    load()
  }, [year, month])

  const days = getMonthDays(year, month)
  const todayStr = now.toISOString().slice(0,10)
  
  const headerStyle = {
    fontWeight: 700,
    padding: 6,
    background: isDark ? '#1f2937' : '#eef2ff',
    color: isDark ? '#06b6d4' : '#1e40af',
    borderRadius: 6
  }
  
  const cellStyle = {
    background: isDark ? '#0f1724' : 'white',
    color: isDark ? '#e6eef8' : '#0f172a',
    fontSize: 12
  }
  
  const percentStyle = {
    fontSize: 11,
    color: isDark ? '#06b6d4' : '#64748b',
    fontWeight: 700
  }

  return (
    <div>
      <h2 style={{color: isDark ? '#e6eef8' : '#0f172a'}}>Calendar — {now.toLocaleString('default', { month: 'long' })} {year}</h2>
      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} style={headerStyle}>{d}</div>)}
        {days.map(d=>{
          const s = d.toISOString().slice(0,10)
          const percent = map[s] ?? null
          return (
            <div key={s} className={`calendar-cell ${s===todayStr? 'today':''}`} style={{...cellStyle, minHeight:80, padding:8, borderRadius:6}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{color: isDark ? '#e6eef8' : '#334155'}}>{d.getDate()}</div>
                <div style={percentStyle}>{percent===null? '-': percent + '%'}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{marginTop:12, color: isDark ? '#e6eef8' : '#0f172a'}}>
        Remaining days in year: { Math.max(0, Math.ceil((new Date(year+1,0,1)-now)/(1000*60*60*24))) }
      </div>
    </div>
  )
}
