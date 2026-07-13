import { BRAND_LOGO_SRC } from '@/components/common/BrandLogo'

export interface EscPosRaster {
  dots: boolean[]
  width: number
  height: number
}

let logoRasterPromise: Promise<EscPosRaster | null> | null = null

/**
 * Load the Scrappy mark and convert to a high-contrast 1-bit raster for ESC/POS.
 * Green-on-black logo becomes black-on-white (printable) dots.
 */
export function loadScrappyLogoRaster(maxWidth = 144): Promise<EscPosRaster | null> {
  logoRasterPromise ??= decodeLogoRaster(maxWidth).catch(() => null)
  return logoRasterPromise
}

async function decodeLogoRaster(maxWidth: number): Promise<EscPosRaster | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const image = await loadImage(BRAND_LOGO_SRC)
  const scale = Math.min(1, maxWidth / image.naturalWidth)
  const width = Math.max(8, Math.floor(image.naturalWidth * scale))
  const height = Math.max(8, Math.floor(image.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(image, 0, 0, width, height)

  const { data } = ctx.getImageData(0, 0, width, height)
  const dots = new Array<boolean>(width * height)

  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4
    const r = data[offset] ?? 0
    const g = data[offset + 1] ?? 0
    const b = data[offset + 2] ?? 0
    const a = data[offset + 3] ?? 0
    // Print ink where the green S sits; leave near-black background blank.
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    dots[i] = a > 32 && (luminance > 40 || g > 50)
  }

  return { dots, width, height }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    image.src = src
  })
}
