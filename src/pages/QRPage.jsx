import { useRef, useState } from "react"

import { Link } from "react-router-dom"

import {
  ArrowLeft,
  Download,
  Upload
} from "lucide-react"

import {
  generateQRCode,
  decodeQRCode
} from "../utils/qrStego.js"

function QRPage() {

  const canvasRef = useRef(null)

  const [text, setText] = useState("")

  const [qrImage, setQrImage] = useState("")

  const [decoded, setDecoded] = useState("")

  const [error, setError] = useState("")

  async function handleGenerate() {

    setError("")

    try {

      const result =
        await generateQRCode(text)

      setQrImage(result)

      setDecoded("")

    }
    catch (err) {

      setError(err.message)
    }
  }

  function handleUpload(event) {

    const file =
      event.target.files[0]

    if (!file) return

    setError("")
    setDecoded("")

    const reader =
      new FileReader()

    reader.onload = (e) => {

      const img = new Image()

      img.onload = () => {

        const canvas =
          canvasRef.current

        const ctx =
          canvas.getContext("2d")

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        try {

          const result =
            decodeQRCode(canvas)

          setDecoded(result)

        }
        catch (err) {

          setError(err.message)
        }
      }

      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  }

  function downloadQR() {

    if (!qrImage) return

    const link =
      document.createElement("a")

    link.download = "stegora-qr.png"

    link.href = qrImage

    link.click()
  }

  return (
    <div className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-8
    ">

      <div className="max-w-4xl mx-auto">

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-zinc-400
              hover:text-green-400
              transition-colors
            "
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <span className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-green-400
          ">
            QR Steganography
          </span>

        </div>

        <div className="
          border
          border-zinc-800
          bg-zinc-950
          p-8
        ">

          <h1 className="
            text-4xl
            font-bold
            text-green-400
          ">
            QR Stego
          </h1>

          <p className="
            mt-3
            text-zinc-400
            max-w-2xl
          ">
            Generate and decode QR codes directly in your browser.
          </p>

          <div className="
            mt-8
            space-y-6
          ">

            <textarea
              rows={5}
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder="
Type text to generate QR...
              "
              className="
                w-full
                bg-black
                border
                border-zinc-800
                px-4
                py-3
                resize-none
                outline-none
                focus:border-green-500
              "
            />

            <div className="
              flex
              flex-wrap
              gap-4
            ">

              <button
                onClick={handleGenerate}
                className="
                  px-5
                  py-3
                  bg-green-500
                  text-black
                  font-semibold
                  hover:bg-green-400
                  transition-colors
                "
              >
                Generate QR
              </button>

              <button
                onClick={downloadQR}
                disabled={!qrImage}
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  border
                  border-zinc-700
                  text-zinc-300
                  transition-colors
                  hover:border-green-500
                  hover:text-green-400
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <Download size={16} />
                Download QR
              </button>

              <label className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                border
                border-zinc-700
                text-zinc-300
                hover:border-green-500
                hover:text-green-400
                cursor-pointer
                transition-colors
              ">

                <Upload size={16} />

                Upload QR

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />

              </label>

            </div>

            {qrImage && (

              <div className="
                border
                border-zinc-800
                bg-black
                p-6
                flex
                justify-center
              ">

                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-72 h-72"
                />

              </div>

            )}

            {decoded && (

              <div className="
                border
                border-zinc-800
                bg-black
                p-4
                text-green-400
                break-words
              ">
                {decoded}
              </div>

            )}

            {error && (

              <div className="
                border
                border-red-900
                bg-red-950/20
                text-red-400
                p-4
              ">
                {error}
              </div>

            )}

            <canvas
              ref={canvasRef}
              className="hidden"
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default QRPage