import { NextResponse } from "next/server"
import { taskController } from "@/controllers/taskController"

export async function PATCH(request, { params }) {
  const awaitedParams = await params
  try {
    const { id } = awaitedParams

    const result = await taskController.toggleTaskComplete(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
