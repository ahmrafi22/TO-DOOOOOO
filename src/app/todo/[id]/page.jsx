"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Navbar from "../_components/navbar"
import Task from "../_components/tasks"

export default function TodoDetailPage() {
  const [user, setUser] = useState(null)
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  
  const id = params.id

  useEffect(() => {
    if (!id) {
      setError("Task ID is required")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchTask()
  }, [router, id])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("Task not found")
        } else {
          throw new Error("Failed to fetch task")
        }
        return
      }

      const data = await response.json()
      setTask(data.task)
    } catch (err) {
      setError("Failed to load task")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = (updatedTask) => {
    setTask(updatedTask)
  }

  const handleDeleteTask = () => {
    router.push("/todo")
  }

  const handleToggleTask = (updatedTask) => {
    setTask(updatedTask)
  }

  const handleBackToTasks = () => {
    router.push("/todo")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-8 sm:p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{error}</h3>
              <p className="text-gray-400 mb-4">
                {error === "Task ID is required" 
                  ? "Please provide a valid task ID in the URL parameters."
                  : "The task you're looking for doesn't exist or has been deleted."
                }
              </p>
              <button
                onClick={handleBackToTasks}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Tasks
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToTasks}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Tasks</span>
          </button>
        </div>

        {/* Task Details Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Task Details</h1>
          <p className="text-gray-400">View and manage your task</p>
        </div>

        {/* Task Component */}
        {task && (
          <Task
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
            isClickable={false}
          />
        )}

        {/* Additional Task Information */}
        {task && (
          <div className="mt-6 bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Task Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed 
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                    : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                }`}>
                  {task.completed ? '✓ Completed' : '⏳ In Progress'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task ID</label>
                <span className="text-gray-400 text-sm font-mono">{task.id}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <span className="text-gray-400 text-sm">
                  {new Date(task.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {task.updated_at && task.updated_at !== task.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                  <span className="text-gray-400 text-sm">
                    {new Date(task.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}