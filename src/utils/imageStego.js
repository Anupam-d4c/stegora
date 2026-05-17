const MAGIC = "STG1"

function textToBits(text) {
  const bytes = new TextEncoder().encode(text)
  let bits = ""

  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0")
  }

  return bits
}

function bitsToText(bits) {
  const bytes = bits.match(/.{1,8}/g) || []
  const values = bytes
    .filter((byte) => byte.length === 8)
    .map((byte) => parseInt(byte, 2))

  return new TextDecoder().decode(new Uint8Array(values))
}

function numberTo32BitBinary(number) {
  return number.toString(2).padStart(32, "0")
}

function readRedChannelBits(data) {
  let bits = ""

  for (let i = 0; i < data.length; i += 4) {
    bits += data[i] & 1
  }

  return bits
}

export function encodeImage(canvas, message) {
  if (!canvas) {
    throw new Error("Canvas is not ready.")
  }

  if (!message || !message.trim()) {
    throw new Error("Please enter a secret message.")
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Canvas context is unavailable.")
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const magicBits = textToBits(MAGIC)
  const messageBits = textToBits(message)
  const lengthBits = numberTo32BitBinary(messageBits.length)

  const payloadBits = magicBits + lengthBits + messageBits

  if (payloadBits.length > data.length / 4) {
    throw new Error("Message is too large for this image.")
  }

  for (let bitIndex = 0, pixelIndex = 0; bitIndex < payloadBits.length; bitIndex++, pixelIndex += 4) {
    data[pixelIndex] = (data[pixelIndex] & 254) | Number(payloadBits[bitIndex])
  }

  ctx.putImageData(imageData, 0, 0)
}

export function decodeImage(canvas) {
  if (!canvas) {
    throw new Error("Canvas is not ready.")
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Canvas context is unavailable.")
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const allBits = readRedChannelBits(data)

  const magicBits = allBits.slice(0, 32)
  const magic = bitsToText(magicBits)

  if (magic !== MAGIC) {
    throw new Error("No hidden message found in this image.")
  }

  const lengthBits = allBits.slice(32, 64)
  const messageBitLength = parseInt(lengthBits, 2)

  if (!Number.isFinite(messageBitLength) || messageBitLength <= 0) {
    throw new Error("Corrupted hidden data.")
  }

  const messageBits = allBits.slice(64, 64 + messageBitLength)

  if (messageBits.length < messageBitLength) {
    throw new Error("Corrupted hidden data.")
  }

  return bitsToText(messageBits)
}