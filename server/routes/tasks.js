const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create a new task list for a date
router.post('/', async (req, res) => {
  try {
    const { title, subtasks, date } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
    const task = new Task({ title, subtasks: subtasks || [], date });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a date (sorted newest first)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query required (YYYY-MM-DD)' });
    const tasks = await Task.find({ date }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task (e.g., toggle subtask done states)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const task = await Task.findByIdAndUpdate(id, update, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analysis endpoint: percentage for a specific date
router.get('/analysis/date', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });
    const tasks = await Task.find({ date });
    let total = 0, done = 0;
    tasks.forEach(t => {
      total += t.subtasks.length;
      done += t.subtasks.filter(s => s.done).length;
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    res.json({ date, total, done, percent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Calendar summary for a month: returns per-day percent map
router.get('/analysis/calendar', async (req, res) => {
  try {
    const { month } = req.query; // expected YYYY-MM
    if (!month) return res.status(400).json({ error: 'month required (YYYY-MM)' });
    const regex = new RegExp('^' + month);
    const tasks = await Task.find({ date: { $regex: regex } });
    const map = {};
    tasks.forEach(t => {
      if (!map[t.date]) map[t.date] = { total: 0, done: 0 };
      map[t.date].total += t.subtasks.length;
      map[t.date].done += t.subtasks.filter(s => s.done).length;
    });
    const result = Object.keys(map).map(d => ({ date: d, total: map[d].total, done: map[d].done, percent: map[d].total ? Math.round((map[d].done / map[d].total) * 100) : 0 }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
