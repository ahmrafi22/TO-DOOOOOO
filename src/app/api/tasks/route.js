import { NextResponse } from "next/server"
import { taskController } from "@/controllers/taskController"
import jwt from "jsonwebtoken"

function getUserIdFromToken(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.decode(token)
    // @ts-ignore
    return decoded?.userId
  } catch {
    return null
  }
}

export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const result = await taskController.getUserTasks(userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await taskController.createTask({
      user_id: userId,
      title,
      description: description || "",
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
