import { fetchVisitors, saveVisitorToAPI } from "../api"
import type { Visitor } from "../types"

/**
 * Generate a unique certificate ID
 */
export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `IFNTI-${timestamp}-${randomChars}`
}

/**
 * Format date to localized string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Save visitor data to database via API
 */
export const saveVisitor = async (visitor: Visitor): Promise<void> => {
  try {
    await saveVisitorToAPI(visitor)
  } catch (error) {
    console.error("Failed to save visitor:", error)
    // Fallback to localStorage if API fails
    const visitors = JSON.parse(localStorage.getItem("visitors") || "[]")
    visitors.push(visitor)
    localStorage.setItem("visitors", JSON.stringify(visitors))
  }
}

/**
 * Get all visitors from database via API
 */
export const getVisitors = async (): Promise<Visitor[]> => {
  try {
    return await fetchVisitors()
  } catch (error) {
    console.error("Failed to fetch visitors:", error)
    // Fallback to localStorage if API fails
    const visitors = localStorage.getItem("visitors")
    return visitors ? JSON.parse(visitors) : []
  }
}

/**
 * Get a visitor by ID
 */
export const getVisitorById = async (id: string): Promise<Visitor | null> => {
  try {
    const visitors = await fetchVisitors()
    return visitors.find((visitor: Visitor) => visitor.id === id) || null
  } catch (error) {
    console.error("Failed to fetch visitor by ID:", error)
    // Fallback to localStorage if API fails
    const visitors = JSON.parse(localStorage.getItem("visitors") || "[]")
    return visitors.find((visitor: Visitor) => visitor.id === id) || null
  }
}

/**
 * Export data as CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
