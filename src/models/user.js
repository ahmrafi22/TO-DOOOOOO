import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export const User = {
  async create(userData) {
    const { email, password, name } = userData
    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${password}, ${name})
      RETURNING id, email, name, created_at
    `
    return result[0]
  },

  async findByEmail(email) {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return result[0]
  },

  async findById(id) {
    const result = await sql`
      SELECT id, email, name, created_at FROM users WHERE id = ${id}
    `
    return result[0]
  },

  async getAll() {
    const result = await sql`
      SELECT id, email, name, created_at FROM users
      ORDER BY created_at DESC
    `
    return result
  },
}
