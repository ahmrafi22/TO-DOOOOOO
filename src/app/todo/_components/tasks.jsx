"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Undo2, Edit3, Trash2 } from "lucide-react"

export default function Task({ task, onUpdate, onDelete, onToggle, isClickable = true }) {
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
      onUpdate(data.task)
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
      onToggle(data.task)
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

      onDelete(taskId)
    } catch (err) {
      setError("Failed to delete task")
    }
  }

  const handleTaskClick = () => {
    if (isClickable && !editingTask) {
      router.push(`/todo/${task.id}`)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6">
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

      {error && (
        <div className="mb-4 p-3 text-red-400 bg-red-900/20 rounded-lg border border-red-800 text-sm">
          {error}
        </div>
      )}

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
          <div 
            className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 ${
              isClickable ? 'cursor-pointer' : ''
            }`}
            onClick={handleTaskClick}
          >
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-medium break-words task-text ${
                task.completed ? "completed" : "text-white"
              }`}>
                {task.title}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
  )
}