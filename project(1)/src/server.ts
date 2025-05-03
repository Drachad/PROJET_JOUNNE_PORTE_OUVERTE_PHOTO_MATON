import express from "express"
import cors from "cors"
import { initDatabase, getVisitorsFromDB, saveVisitorToDB, clearVisitorsFromDB } from "./utils/db"
import type { Visitor } from "./types"

const app = express()
const PORT = process.env.PORT || 3001

// Initialize database
initDatabase()

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))

// Routes
app.get("/api/visitors", (req, res) => {
  try {
    const visitors = getVisitorsFromDB()
    res.json(visitors)
  } catch (error) {
    console.error("Error fetching visitors:", error)
    res.status(500).json({ error: "Failed to fetch visitors" })
  }
})

app.post("/api/visitors", (req, res) => {
  try {
    const visitor: Visitor = req.body
    saveVisitorToDB(visitor)
    res.status(201).json({ message: "Visitor saved successfully", visitor })
  } catch (error) {
    console.error("Error saving visitor:", error)
    res.status(500).json({ error: "Failed to save visitor" })
  }
})

app.delete("/api/visitors", (req, res) => {
  try {
    clearVisitorsFromDB()
    res.json({ message: "All visitors deleted successfully" })
  } catch (error) {
    console.error("Error clearing visitors:", error)
    res.status(500).json({ error: "Failed to clear visitors" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
