import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export const Task = {
  async create(taskData) {
    const { user_id, title, description } = taskData
    const result = await sql`
      INSERT INTO tasks (user_id, title, description)
      VALUES (${user_id}, ${title}, ${description})
      RETURNING *
    `
    return result[0]
  },

  async findByUserId(userId) {
    const result = await sql`
      SELECT * FROM tasks 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return result
  },

  async findById(id) {
    const result = await sql`
      SELECT * FROM tasks WHERE id = ${id}
    `
    return result[0]
  },

  async update(id, taskData) {
    const { title, description, completed } = taskData
    const result = await sql`
      UPDATE tasks 
      SET title = ${title}, description = ${description}, completed = ${completed}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },

  async delete(id) {
    const result = await sql`
      DELETE FROM tasks WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },

  async toggleComplete(id) {
    const result = await sql`
      UPDATE tasks 
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  },
}
