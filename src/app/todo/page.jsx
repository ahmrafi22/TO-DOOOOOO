"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Undo2, Edit3, Trash2 } from "lucide-react"

export default function TodoPage() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchTasks()
  }, [router])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const data = await response.json()
      setTasks([data.task, ...tasks])
      setNewTask({ title: "", description: "" })
    } catch (err) {
      setError("Failed to create task")
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!editingTask || !editingTask.title.trim()) return

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editingTask),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const data = await response.json()
      setTasks(tasks.map((task) => (task.id === editingTask.id ? data.task : task)))
      setEditingTask(null)
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle task")
      }

      const data = await response.json()
      setTasks(tasks.map((task) => (task.id === taskId ? data.task : task)))
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (err) {
      setError("Failed to delete task")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <style jsx>{`
        .task-text {
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }
        
        .task-text.completed {
          color: rgb(107 114 128);
        }
        
        .task-text::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          height: 2px;
          background-color: rgb(107 114 128);
          transform: translateY(-50%);
          width: 0;
          transition: width 0.6s ease-in-out;
        }
        
        .task-text.completed::after {
          width: 100%;
        }
        
        .task-description {
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }
        
        .task-description.completed {
          color: rgb(107 114 128);
        }
        
        .task-description::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          height: 1px;
          background-color: rgb(107 114 128);
          transform: translateY(-50%);
          width: 0;
          transition: width 0.6s ease-in-out 0.2s;
        }
        
        .task-description.completed::after {
          width: 100%;
        }
      `}</style>

      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">My Tasks</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-300">
                Welcome, <span className="font-medium text-white">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 text-red-400 bg-red-900/20 rounded-lg border border-red-800">
            {error}
          </div>
        )}

        {/* Create New Task Card */}
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
            Create New Task
          </h2>
          <form onSubmit={handleCreateTask} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-gray-400"
                placeholder="Enter task description (optional)"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Your Tasks
            </h2>
            <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-8 sm:p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
                <p className="text-gray-400">Create your first task above to get started!</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6">
                  {editingTask && editingTask.id === task.id ? (
                    // Edit Mode
                    <form onSubmit={handleUpdateTask} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          value={editingTask.description}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base sm:text-lg font-medium break-words task-text ${
                            task.completed ? "completed" : "text-white"
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                              task.completed
                                ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-600/20"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                            } hover:shadow-lg transform hover:scale-105 active:scale-95`}
                          >
                            {task.completed ? (
                              <>
                                <Undo2 size={16} />
                                <span className="hidden sm:inline">Undo</span>
                              </>
                            ) : (
                              <>
                                <Check size={16} />
                                <span className="hidden sm:inline">Complete</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-lg transform hover:scale-105 active:scale-95"
                          >
                            <Edit3 size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm shadow-red-600/20 hover:shadow-lg transform hover:scale-105 active:scale-95"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className={`text-gray-300 mb-3 text-sm sm:text-base break-words task-description ${
                          task.completed ? "completed" : ""
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-400 pt-3 border-t border-gray-700">
                        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                        {task.completed && (
                          <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium w-fit border border-green-600/30">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}