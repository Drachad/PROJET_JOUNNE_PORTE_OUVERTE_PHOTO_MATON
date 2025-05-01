/**
 * Format a date object to French localized string
 * @param date The date to format
 * @returns Formatted date string (e.g., "30 avril 2025")
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  return date.toLocaleDateString("fr-FR", options)
}
