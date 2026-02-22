import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import TaskList from './components/TaskList'
import AddTaskModal from './components/AddTaskModal'
import Analysis from './components/Analysis'
import CalendarView from './components/CalendarView'
import api from './api'

export default function App(){
  const [view, setView] = useState('home')
  const [todayTasks, setTodayTasks] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  const today = new Date().toISOString().slice(0,10)

  async function loadToday(){
    try{
      const res = await api.get('/tasks', { params: { date: today } })
      setTodayTasks(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{ loadToday() }, [])

  function toggleTheme(){ setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <div className={`app ${theme==='dark' ? 'dark' : ''}`}>
      <Header onNavigate={name => { if(name === '+task') setModalOpen(true); else setView(name) }} theme={theme} toggleTheme={toggleTheme} />
      <main>
        {view === 'home' && <TaskList tasks={todayTasks} onUpdated={loadToday} />}
        {view === 'analysis' && <Analysis date={today} theme={theme} />}
        {view === 'calendar' && <CalendarView theme={theme} />}
        {view === 'overview' && <div style={{padding:20}}>Overview: quick stats will appear here.</div>}
      </main>
      <AddTaskModal open={modalOpen} onClose={() => { setModalOpen(false); setTimeout(loadToday, 100); }} theme={theme} />
    </div>
  )
}
