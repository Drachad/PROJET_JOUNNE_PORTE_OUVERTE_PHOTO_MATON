import type { Visitor } from "./types"

const API_URL = "http://localhost:3001/api"

// Get all visitors
export const fetchVisitors = async (): Promise<Visitor[]> => {
  try {
    const response = await fetch(`${API_URL}/visitors`)
    if (!response.ok) {
      throw new Error("Failed to fetch visitors")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching visitors:", error)
    return []
  }
}

// Save a visitor
export const saveVisitorToAPI = async (visitor: Visitor): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitor),
    })

    if (!response.ok) {
      throw new Error("Failed to save visitor")
    }
  } catch (error) {
    console.error("Error saving visitor:", error)
    throw error
  }
}

// Clear all visitors
export const clearVisitors = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/visitors`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to clear visitors")
    }
  } catch (error) {
    console.error("Error clearing visitors:", error)
    throw error
  }
}
