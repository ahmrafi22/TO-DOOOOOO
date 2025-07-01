import { NextResponse } from "next/server"
import { authController } from "@/controllers/authController"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await authController.login({ email, password })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
