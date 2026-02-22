import React, { useEffect, useState } from 'react'
import api from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Analysis({ date, theme }){
  const [data, setData] = useState(null)
  const isDark = theme === 'dark'
  
  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/tasks/analysis/date', { params: { date } })
        setData(res.data)
      }catch(err){ console.error(err) }
    }
    load()
  }, [date])

  if(!data) return <div style={{padding:20}}>Loading analysis...</div>

  const pieData = [ { name: 'Done', value: data.done }, { name: 'Remaining', value: Math.max(0, data.total - data.done) } ]
  
  const boxStyle = {
    background: isDark ? '#1f2937' : 'white',
    color: isDark ? '#e6eef8' : '#0f172a',
    padding: 12,
    borderRadius: 8
  }
  
  const textStyle = {
    color: isDark ? '#e6eef8' : '#0f172a'
  }
  
  const chartTextColor = isDark ? '#e6eef8' : '#000'

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
      <div style={boxStyle}>
        <h3 style={textStyle}>Daily Growth — {data.date}</h3>
        <div style={{fontSize:32, fontWeight:700, ...textStyle}}>{data.percent}%</div>
        <div style={textStyle}>Total: {data.total} • Done: {data.done}</div>
      </div>
      <div style={boxStyle}>
        <h4 style={textStyle}>Charts</h4>
        <div style={{height:200}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{name:data.date, percent: data.percent}]}> 
              <XAxis dataKey="name" tick={{fill: chartTextColor}} />
              <YAxis tick={{fill: chartTextColor}} />
              <Tooltip contentStyle={{background: isDark ? '#1f2937' : 'white', border: `1px solid ${isDark ? '#4b5563' : '#ccc'}`, color: chartTextColor}} />
              <Bar dataKey="percent" fill={isDark ? '#06b6d4' : '#2563eb'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{height:200}}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={{fill: chartTextColor}}>
                {pieData.map((entry, idx) => <Cell key={idx} fill={idx===0? '#10b981':'#ef4444'} />)}
              </Pie>
              <Tooltip contentStyle={{background: isDark ? '#1f2937' : 'white', border: `1px solid ${isDark ? '#4b5563' : '#ccc'}`, color: chartTextColor}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
