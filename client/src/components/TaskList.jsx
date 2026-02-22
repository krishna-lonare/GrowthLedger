import React from 'react'
import api from '../api'

export default function TaskList({ tasks, onUpdated }){
  if(!tasks) return null

  async function toggleSubtask(taskId, idx, current){
    try{
      const t = tasks.find(x => x._id === taskId)
      if(!t) return
      const updatedSubtasks = t.subtasks.map((s,i) => i===idx ? { ...s, done: !current } : s)
      await api.put('/tasks/' + taskId, { subtasks: updatedSubtasks })
      onUpdated()
    }catch(err){ console.error(err) }
  }

  return (
    <div>
      <h2>Today's Tasks</h2>
      {tasks.length===0 && <div>No tasks for today. Add one using +task.</div>}
      {tasks.map(t => (
        <div className="task" key={t._id}>
          <h4>{t.title}</h4>
          {t.subtasks.map((s,i)=> (
            <div className="subtask" key={i}>
              <input type="checkbox" checked={!!s.done} onChange={()=>toggleSubtask(t._id, i, s.done)} />
              <div>{s.text}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}


