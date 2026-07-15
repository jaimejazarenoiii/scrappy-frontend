/** Fetch an image URL as a blob and trigger a browser download. */
export async function downloadImageFile(src: string, fileName: string): Promise<void> {
  const response = await fetch(src)
  if (!response.ok) {
    throw new Error('Could not download image')
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName || 'photo.jpg'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}
