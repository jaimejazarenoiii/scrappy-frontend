/**
 * Minimal ESC/POS command builder for thermal receipt printers.
 * Output is raw binary suitable for EOS Print / similar apps that open `.bin` files.
 */

const ESC = 0x1b
const GS = 0x1d
const LF = 0x0a

/** Typical printable width for 58mm paper with Font A. */
export const ESC_POS_WIDTH_58MM = 32
/** Typical printable width for 80mm paper with Font A. */
export const ESC_POS_WIDTH_80MM = 48

export type EscPosAlign = 'left' | 'center' | 'right'

export class EscPosBuilder {
  private readonly chunks: number[] = []
  readonly width: number

  constructor(width: number = ESC_POS_WIDTH_58MM) {
    this.width = width
  }

  init(): this {
    this.chunks.push(ESC, 0x40)
    return this
  }

  align(value: EscPosAlign): this {
    const code = value === 'center' ? 1 : value === 'right' ? 2 : 0
    this.chunks.push(ESC, 0x61, code)
    return this
  }

  /** n: bit0-3 height, bit4-7 width (0 = normal, 1 = double, …). */
  size(widthScale: 0 | 1 | 2, heightScale: 0 | 1 | 2 = widthScale): this {
    const n = ((widthScale & 0x07) << 4) | (heightScale & 0x07)
    this.chunks.push(GS, 0x21, n)
    return this
  }

  bold(on: boolean): this {
    this.chunks.push(ESC, 0x45, on ? 1 : 0)
    return this
  }

  text(value: string): this {
    const encoded = encodeEscPosText(value)
    for (const byte of encoded) this.chunks.push(byte)
    return this
  }

  line(value = ''): this {
    if (value) this.text(value)
    this.chunks.push(LF)
    return this
  }

  lines(values: string[]): this {
    for (const value of values) this.line(value)
    return this
  }

  feed(lines = 1): this {
    this.chunks.push(ESC, 0x64, Math.max(0, Math.min(255, lines)))
    return this
  }

  /** Full cut with feed (common TM-compatible sequence). */
  cut(): this {
    this.chunks.push(GS, 0x56, 0x41, 0x10)
    return this
  }

  divider(char = '-'): this {
    return this.line(char.repeat(this.width))
  }

  doubleDivider(): this {
    return this.line('='.repeat(this.width))
  }

  columns(left: string, right: string): this {
    return this.line(padColumns(left, right, this.width))
  }

  wrap(value: string, indent = 0): this {
    const max = Math.max(8, this.width - indent)
    const prefix = ' '.repeat(Math.max(0, indent))
    for (const part of wrapText(value, max)) {
      this.line(`${prefix}${part}`)
    }
    return this
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.chunks)
  }
}

/** Map text to bytes printers can usually render (CP437-ish ASCII + common latin). */
function encodeEscPosText(value: string): Uint8Array {
  const normalized = value
    .normalize('NFKD')
    .replace(/₱/g, 'PHP ')
    .replace(/[^\x20-\x7E\n\r\t]/g, (char) => {
      const map: Record<string, string> = {
        '—': '-',
        '–': '-',
        '‘': "'",
        '’': "'",
        '“': '"',
        '”': '"',
        '…': '...',
        '·': '-',
        '×': 'x',
      }
      return map[char] ?? ''
    })

  const bytes = new Uint8Array(normalized.length)
  for (let i = 0; i < normalized.length; i += 1) {
    bytes[i] = normalized.charCodeAt(i) & 0xff
  }
  return bytes
}

export function padColumns(left: string, right: string, width: number): string {
  const safeLeft = truncate(left, Math.max(1, width - right.length - 1))
  const spaces = Math.max(1, width - safeLeft.length - right.length)
  return `${safeLeft}${' '.repeat(spaces)}${right}`
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  if (max <= 1) return value.slice(0, max)
  return `${value.slice(0, max - 1)}.`
}

export function wrapText(value: string, max: number): string[] {
  const input = value.trim()
  if (!input) return ['']
  if (input.length <= max) return [input]

  const words = input.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  const pushLongWord = (word: string) => {
    for (let i = 0; i < word.length; i += max) {
      lines.push(word.slice(i, i + max))
    }
  }

  for (const word of words) {
    if (word.length > max) {
      if (current) {
        lines.push(current)
        current = ''
      }
      pushLongWord(word)
      continue
    }

    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= max) {
      current = candidate
    } else {
      if (current) lines.push(current)
      current = word
    }
  }

  if (current) lines.push(current)
  return lines
}

export function downloadBinaryFile(bytes: Uint8Array, filename: string): void {
  const copy = new Uint8Array(bytes)
  const blob = new Blob([copy], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
