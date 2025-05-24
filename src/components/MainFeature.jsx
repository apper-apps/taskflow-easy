import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  })

  const priorities = {
    low: { color: 'bg-green-100 text-green-700 border-green-200', icon: 'ArrowDown' },
    medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'Minus' },
    high: { color: 'bg-red-100 text-red-700 border-red-200', icon: 'ArrowUp' }
  }

  const categories = {
    general: { color: 'bg-blue-100 text-blue-700', icon: 'Circle' },
    work: { color: 'bg-purple-100 text-purple-700', icon: 'Briefcase' },
    personal: { color: 'bg-green-100 text-green-700', icon: 'User' },
    health: { color: 'bg-pink-100 text-pink-700', icon: 'Heart' },
    learning: { color: 'bg-orange-100 text-orange-700', icon: 'BookOpen' }
  }

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks(prev => [task, ...prev])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'general'
    })
    setIsAddingTask(false)
    toast.success('Task created successfully!')
  }

  const handleEditTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ))
    setEditingTask(null)
    toast.success('Task updated successfully!')
  }

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        toast.success(updated.completed ? 'Task completed! 🎉' : 'Task marked as incomplete')
        return updated
      }
      return task
    }))
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    // Apply status filter
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed)
    } else if (filter === 'overdue') {
      filtered = filtered.filter(task => 
        !task.completed && task.dueDate && isPast(new Date(task.dueDate))
      )
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      // Sort by completion status first, then by priority, then by due date
      if (a.completed !== b.completed) {
        return a.completed - b.completed
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }

      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  const getDateDisplay = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`
    return format(date, 'MMM d, yyyy')
  }

  const filteredTasks = getFilteredTasks()
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && isPast(new Date(t.dueDate))).length
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-8 lg:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Your Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Command Center</span>
        </h2>
        <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Create, organize, and track your tasks with intelligent prioritization and seamless workflow management
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { label: 'Total', value: stats.total, icon: 'List', color: 'from-blue-400 to-blue-600' },
          { label: 'Completed', value: stats.completed, icon: 'CheckCircle2', color: 'from-green-400 to-green-600' },
          { label: 'Pending', value: stats.pending, icon: 'Clock', color: 'from-yellow-400 to-yellow-600' },
          { label: 'Overdue', value: stats.overdue, icon: 'AlertCircle', color: 'from-red-400 to-red-600' }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Controls Section */}
      <motion.div 
        className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-w-[140px]"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Add Task Button */}
          <motion.button
            onClick={() => setIsAddingTask(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300 group min-w-[140px]"
          >
            <ApperIcon name="Plus" size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Task
          </motion.button>
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-600 dark:to-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="ClipboardList" size={32} className="text-surface-500 dark:text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
                {searchQuery || filter !== 'all' ? 'No matching tasks found' : 'No tasks yet'}
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first task to get started with TaskFlow'}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 ${
                  task.completed ? 'opacity-75' : ''
                } ${task.dueDate && isPast(new Date(task.dueDate)) && !task.completed ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleTaskComplete(task.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-surface-300 dark:border-surface-600 hover:border-green-500'
                    }`}
                  >
                    {task.completed && <ApperIcon name="Check" size={14} />}
                  </motion.button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className={`text-lg font-semibold ${
                        task.completed 
                          ? 'line-through text-surface-500 dark:text-surface-500' 
                          : 'text-surface-900 dark:text-surface-100'
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${priorities[task.priority].color}`}>
                          <ApperIcon name={priorities[task.priority].icon} size={12} />
                          {task.priority}
                        </span>
                        
                        {/* Category Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${categories[task.category].color}`}>
                          <ApperIcon name={categories[task.category].icon} size={12} />
                          {task.category}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className={`text-surface-600 dark:text-surface-400 mb-3 ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Due Date */}
                      {task.dueDate && (
                        <div className={`flex items-center gap-2 text-sm ${
                          isPast(new Date(task.dueDate)) && !task.completed 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-surface-500 dark:text-surface-400'
                        }`}>
                          <ApperIcon name="Calendar" size={14} />
                          {getDateDisplay(task.dueDate)}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => setEditingTask(task)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDeleteTask(task.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsAddingTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-soft max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                  Create New Task
                </h3>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-all duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add task description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                    >
                      <option value="general">General</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleAddTask}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                >
                  Create Task
                </motion.button>
                <motion.button
                  onClick={() => setIsAddingTask(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-soft max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                  Edit Task
                </h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-all duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={editingTask.category}
                      onChange={(e) => setEditingTask(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                    >
                      <option value="general">General</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => handleEditTask(editingTask.id, editingTask)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                >
                  Update Task
                </motion.button>
                <motion.button
                  onClick={() => setEditingTask(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature