/**
 * TaskPlanner Component
 * Full-featured task management with CRUD operations
 * Supports task creation, editing, deletion, and session linking
 */
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import '../styles/TaskPlanner.css';

export default function TaskPlanner() {
  const [tasks, setTasks] = useLocalStorage('studysmart_tasks', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'medium',
    dueDate: '',
    estimatedTime: 30,
    linkedSession: null
  });

  // Open modal for new task
  const openNewTaskModal = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      priority: 'medium',
      dueDate: '',
      estimatedTime: 30,
      linkedSession: null
    });
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (task) => {
    setFormData(task);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save task (create or update)
  const saveTask = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? { ...formData, id: task.id, updatedAt: new Date().toISOString() }
          : task
      ));
    } else {
      // Create new task
      const newTask = {
        ...formData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
    }

    setIsModalOpen(false);
  };

  // Delete task
  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // Toggle task completion
  const toggleComplete = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Sort by priority and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
  });

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="task-planner">
      <div className="task-planner-header">
        <h2>Task Planner</h2>
        <button onClick={openNewTaskModal} className="btn-primary">
          + New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="task-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter(t => !t.completed).length})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      {/* Task list */}
      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-card-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="task-checkbox"
                />
                <div className="task-title-section">
                  <h3>{task.title}</h3>
                  {task.subject && <span className="task-subject">{task.subject}</span>}
                </div>
                <div className="task-actions">
                  <button onClick={() => openEditModal(task)} className="btn-icon">
                    ✏️
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="btn-icon">
                    🗑️
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
                <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                <span className="estimated-time">⏱️ {task.estimatedTime} min</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for create/edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-close">
                ✕
              </button>
            </div>

            <form onSubmit={saveTask}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Study calculus chapter 5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add details about this task..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedTime">Estimated Time (min)</label>
                  <input
                    type="number"
                    id="estimatedTime"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    min="5"
                    step="5"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
