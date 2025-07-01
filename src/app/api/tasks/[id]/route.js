import { NextResponse } from "next/server"
import { taskController } from "@/controllers/taskController"

export async function PUT(request, { params }) {
  const awaitedParams = await params
  try {
    const { id } = awaitedParams
    const body = await request.json()
    const { title, description, completed } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await taskController.updateTask(id, {
      title,
      description: description || "",
      completed: completed || false,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const awaitedParams = await params
  try {
    const { id } = awaitedParams

    const result = await taskController.deleteTask(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}