import Database from "better-sqlite3"
import type { Visitor } from "../types"
import path from "path"
import fs from "fs"

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "visitors.db")
const db = new Database(dbPath)

// Initialize the database
export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      institution TEXT NOT NULL,
      photo TEXT NOT NULL,
      certificateId TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `)
}

// Save a visitor to the database
export const saveVisitorToDB = (visitor: Visitor): void => {
  const stmt = db.prepare(`
    INSERT INTO visitors (id, name, email, phone, institution, photo, certificateId, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    visitor.id,
    visitor.name,
    visitor.email,
    visitor.phone,
    visitor.institution,
    visitor.photo,
    visitor.certificateId,
    visitor.timestamp,
  )
}

// Get all visitors from the database
export const getVisitorsFromDB = (): Visitor[] => {
  const stmt = db.prepare("SELECT * FROM visitors ORDER BY timestamp DESC")
  return stmt.all() as Visitor[]
}

// Get a visitor by ID
export const getVisitorByIdFromDB = (id: string): Visitor | null => {
  const stmt = db.prepare("SELECT * FROM visitors WHERE id = ?")
  return (stmt.get(id) as Visitor) || null
}

// Clear all visitors
export const clearVisitorsFromDB = (): void => {
  const stmt = db.prepare("DELETE FROM visitors")
  stmt.run()
}

// Export all visitors as CSV
export const exportVisitorsAsCSV = (): string => {
  const visitors = getVisitorsFromDB()
  const headers = ["ID", "Name", "Email", "Phone", "Institution", "Certificate ID", "Date"]

  const csvRows = [
    headers.join(","),
    ...visitors.map((visitor) => {
      const date = new Date(visitor.timestamp).toLocaleDateString("fr-FR")
      return [
        visitor.id,
        `"${visitor.name.replace(/"/g, '""')}"`,
        `"${visitor.email.replace(/"/g, '""')}"`,
        `"${visitor.phone.replace(/"/g, '""')}"`,
        `"${visitor.institution.replace(/"/g, '""')}"`,
        visitor.certificateId,
        date,
      ].join(",")
    }),
  ]

  return csvRows.join("\n")
}

// Initialize the database on import
initDatabase()

export default db
