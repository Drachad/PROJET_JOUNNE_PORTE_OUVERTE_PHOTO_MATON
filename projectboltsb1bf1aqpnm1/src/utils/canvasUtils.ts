/**
 * Generate a framed photo with IFNTI branding and user information
 * with background removal and stylized design
 */

// Import the rembg library for background removal
import * as rembg from "@imgly/background-removal"

export const generateFramedPhoto = async (
  canvas: HTMLCanvasElement,
  photoDataUrl: string,
  firstName: string,
  lastName: string,
  dateString: string,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas context not available"))
        return
      }

      // Set canvas dimensions (square format)
      const size = 1080 // HD size for social media
      canvas.width = size
      canvas.height = size

      // IFNTI Colors
      const ifntiBlue = "#0052CC"
      const ifntiOrange = "#F26A1B"
      const ifntiGrey = "#666666"
      const white = "#FFFFFF"

      // Load the photo
      const photo = new Image()
      photo.crossOrigin = "anonymous" // Prevent CORS issues

      photo.onload = async () => {
        try {
          // Step 1: Remove background from the photo
          const removedBgDataUrl = await removeBackground(photoDataUrl)
          const personImage = new Image()
          personImage.crossOrigin = "anonymous"

          personImage.onload = () => {
            try {
              // Step 2: Draw stylized background
              drawStylizedBackground(ctx, size, ifntiBlue, ifntiOrange, ifntiGrey)

              // Step 3: Draw the IFNTI logo
              drawLogo(ctx, size)

              // Step 4: Calculate person image placement (centered)
              const personWidth = Math.min(size * 0.8, personImage.width)
              const personHeight = (personImage.height / personImage.width) * personWidth
              const personX = (size - personWidth) / 2
              const personY = (size * 0.65 - personHeight) / 2

              // Draw the person with removed background
              ctx.drawImage(personImage, personX, personY, personWidth, personHeight)

              // Step 5: Add text overlay
              drawTextOverlay(ctx, size, firstName, lastName, dateString, ifntiBlue, white)

              // Return the final image
              resolve(canvas.toDataURL("image/png"))
            } catch (error) {
              reject(error)
            }
          }

          personImage.onerror = () => {
            reject(new Error("Failed to load processed image"))
          }

          personImage.src = removedBgDataUrl
        } catch (error) {
          reject(error)
        }
      }

      photo.onerror = () => {
        reject(new Error("Failed to load photo"))
      }

      photo.src = photoDataUrl
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Remove background from an image
 */
const removeBackground = async (imageDataUrl: string): Promise<string> => {
  try {
    // Use the rembg library to remove background
    const result = await rembg.remove(imageDataUrl)
    return result
  } catch (error) {
    console.error("Background removal failed:", error)
    // Fallback to original image if background removal fails
    return imageDataUrl
  }
}

/**
 * Draw stylized background with IFNTI colors
 */
const drawStylizedBackground = (
  ctx: CanvasRenderingContext2D,
  size: number,
  blue: string,
  orange: string,
  grey: string,
) => {
  // Fill background with light grey
  ctx.fillStyle = "#f5f5f5"
  ctx.fillRect(0, 0, size, size)

  // Draw diagonal stripes and curves

  // Orange section (top left)
  ctx.fillStyle = orange
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(size * 0.4, 0)
  ctx.quadraticCurveTo(size * 0.5, size * 0.3, size * 0.3, size * 0.6)
  ctx.quadraticCurveTo(size * 0.1, size * 0.8, 0, size * 0.7)
  ctx.closePath()
  ctx.fill()

  // Blue section (right side)
  ctx.fillStyle = blue
  ctx.beginPath()
  ctx.moveTo(size, 0)
  ctx.lineTo(size * 0.6, 0)
  ctx.quadraticCurveTo(size * 0.5, size * 0.2, size * 0.7, size * 0.5)
  ctx.quadraticCurveTo(size * 0.9, size * 0.8, size, size * 0.6)
  ctx.closePath()
  ctx.fill()

  // Blue diagonal stripe (bottom)
  ctx.fillStyle = blue
  ctx.beginPath()
  ctx.moveTo(0, size)
  ctx.lineTo(size, size * 0.7)
  ctx.lineTo(size, size)
  ctx.closePath()
  ctx.fill()

  // Orange diagonal stripe (middle)
  ctx.fillStyle = orange
  ctx.beginPath()
  ctx.moveTo(size, size * 0.9)
  ctx.lineTo(size * 0.3, size)
  ctx.lineTo(size, size)
  ctx.closePath()
  ctx.fill()

  // Add dots pattern to orange section
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
  const dotSpacing = 40
  for (let x = dotSpacing; x < size * 0.4; x += dotSpacing) {
    for (let y = dotSpacing; y < size * 0.4; y += dotSpacing) {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

/**
 * Draw IFNTI logo
 */
const drawLogo = (ctx: CanvasRenderingContext2D, size: number) => {
  // Create a placeholder for the logo (in a real implementation, you'd load the actual logo)
  const logoSize = size * 0.15
  const logoX = size - logoSize - 20
  const logoY = 20

  // Draw logo background
  ctx.fillStyle = "#0052CC"
  ctx.fillRect(logoX, logoY, logoSize, logoSize)

  // Draw "fnti" text
  ctx.fillStyle = "#FFFFFF"
  ctx.font = `bold ${logoSize * 0.5}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("fnti", logoX + logoSize / 2, logoY + logoSize / 2)
}

/**
 * Draw text overlay with names and event information
 */
const drawTextOverlay = (
  ctx: CanvasRenderingContext2D,
  size: number,
  firstName: string,
  lastName: string,
  dateString: string,
  blue: string,
  white: string,
) => {
  const textY = size * 0.75

  // Semi-transparent background for "JOURNÉE PORTES OUVERTES"
  ctx.fillStyle = "rgba(245, 245, 245, 0.9)"
  ctx.fillRect(0, textY, size, size * 0.15)

  // Draw "JOURNÉE PORTES OUVERTES"
  ctx.fillStyle = blue
  ctx.font = `bold ${size * 0.07}px Arial`
  ctx.textAlign = "center"
  ctx.fillText("JOURNÉE", size / 2, textY + size * 0.05)
  ctx.fillText("PORTES OUVERTES", size / 2, textY + size * 0.13)

  // Blue background for names
  ctx.fillStyle = blue
  ctx.fillRect(0, textY + size * 0.15, size, size * 0.1)

  // Draw names
  ctx.fillStyle = white
  ctx.font = `bold ${size * 0.05}px Arial`
  ctx.fillText(`${firstName} ${lastName}`, size / 2, textY + size * 0.22)
}
