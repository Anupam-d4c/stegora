import QRCode from "qrcode"

import jsQR from "jsqr"

export async function generateQRCode(text) {

  if (!text.trim()) {
    throw new Error(
      "Please enter text."
    )
  }

  return await QRCode.toDataURL(
    text,
    {

      margin: 2,

      width: 400,

      color: {

        dark: "#000000",

        light: "#FFFFFF"

      }

    }
  )
}

export function decodeQRCode(canvas) {

  const ctx =
    canvas.getContext("2d")

  const imageData =
    ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )

  const code =
    jsQR(
      imageData.data,
      canvas.width,
      canvas.height
    )

  if (!code) {

    throw new Error(
      "No QR code detected."
    )
  }

  return code.data
}