import React, { useState } from 'react'
import api from '../api'

export default function AddTaskModal({ open, onClose, theme }){
  const [title, setTitle] = useState('')
  const [subtasks, setSubtasks] = useState([''])
  const today = new Date().toISOString().slice(0,10)
  const isDark = theme === 'dark'

  if(!open) return null

  function setSubtaskText(i, text){
    const copy = [...subtasks]; copy[i]=text; setSubtasks(copy)
  }

  function addMore(){ setSubtasks([...subtasks, '']) }

  async function save(){
    const cleaned = subtasks.filter(s=>s && s.trim()).map(s=>({ text: s.trim(), done:false }))
    await api.post('/tasks', { title: title || 'Untitled', subtasks: cleaned, date: today })
    setTitle(''); setSubtasks(['']); 
    onClose()
  }

  const modalStyle = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.4)',
    zIndex: 1000
  }
  
  const contentStyle = {
    width: 600,
    background: isDark ? '#0f1724' : 'white',
    color: isDark ? '#e6eef8' : '#0f172a',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
  
  const labelStyle = {
    display: 'block',
    color: isDark ? '#e6eef8' : '#0f172a',
    marginBottom: 4,
    fontWeight: 500
  }
  
  const inputStyle = {
    width: '100%',
    padding: 10,
    marginBottom: 8,
    background: isDark ? '#1f2937' : '#f5f7fb',
    color: isDark ? '#e6eef8' : '#0f172a',
    border: `1px solid ${isDark ? '#4b5563' : '#cbd5e1'}`,
    borderRadius: 6,
    fontSize: 14
  }
  
  const buttonAddMoreStyle = {
    marginTop: 8,
    background: isDark ? '#1f2937' : '#f5f7fb',
    color: isDark ? '#e6eef8' : '#0f172a',
    border: `1px solid ${isDark ? '#4b5563' : '#cbd5e1'}`,
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14
  }
  
  const cancelButtonStyle = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: isDark ? '#4b5563' : '#e6eef8',
    color: isDark ? '#e6eef8' : '#0f172a',
    cursor: 'pointer',
    fontSize: 14
  }
  
  const doneButtonStyle = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#0ea5a0',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600
  }

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3 style={{marginTop: 0, marginBottom: 16, color: isDark ? '#e6eef8' : '#0f172a'}}>Add To-Do List</h3>
        <div style={{marginBottom: 16}}>
          <label style={labelStyle}>Title</label>
          <input 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            style={inputStyle}
            placeholder="Enter list title"
          />
        </div>
        <div style={{marginBottom: 16}}>
          <label style={labelStyle}>Tasks</label>
          {subtasks.map((s,i)=> (
            <div key={i} style={{marginBottom: 8}}>
              <input 
                value={s} 
                onChange={e=>setSubtaskText(i, e.target.value)} 
                style={inputStyle}
                placeholder={`Task ${i+1}`}
              />
            </div>
          ))}
          <button onClick={addMore} style={buttonAddMoreStyle}>+ Add more task</button>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={save} style={doneButtonStyle}>Done</button>
        </div>
      </div>
    </div>
  )
}
