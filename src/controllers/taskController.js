import { Task } from "@/models/task"

export const taskController = {
  async createTask(taskData) {
    try {
      const task = await Task.create(taskData)
      return {
        success: true,
        task,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async getUserTasks(userId) {
    try {
      const tasks = await Task.findByUserId(userId)
      return {
        success: true,
        tasks,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async updateTask(id, taskData) {
    try {
      const task = await Task.update(id, taskData)
      if (!task) {
        throw new Error("Task not found")
      }
      return {
        success: true,
        task,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async deleteTask(id) {
    try {
      const task = await Task.delete(id)
      if (!task) {
        throw new Error("Task not found")
      }
      return {
        success: true,
        message: "Task deleted successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async toggleTaskComplete(id) {
    try {
      const task = await Task.toggleComplete(id)
      if (!task) {
        throw new Error("Task not found")
      }
      return {
        success: true,
        task,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async getTask(id) {
    try {
      const task = await Task.findById(id)
      if (!task) {
        throw new Error("Task not found")
      }
      return {
        success: true,
        task,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },
}
