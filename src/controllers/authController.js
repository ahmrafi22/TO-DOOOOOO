import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "@/models/user"

export const authController = {
  async register(userData) {
    try {
      const { email, password, name } = userData

      // Check if user already exists
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
      })

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },

  async login(credentials) {
    try {
      const { email, password } = credentials

      // Find user by email
      const user = await User.findByEmail(email)
      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error("Invalid email or password")
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  },
}
