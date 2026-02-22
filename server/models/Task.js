const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtasks: { type: [SubtaskSchema], default: [] },
  date: { type: String, required: true }, // store YYYY-MM-DD for easy queries
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
