import { useRef, useState } from "react"

import { Link } from "react-router-dom"

import {
  ArrowLeft,
  Upload,
  Download
} from "lucide-react"

import toast from "react-hot-toast"

import {
  encodeImage,
  decodeImage
} from "../utils/imageStego.js"

function ImagePage() {

  const canvasRef = useRef(null)

  const [imageLoaded, setImageLoaded] =
    useState(false)

  const [isEncoded, setIsEncoded] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [decoded, setDecoded] =
    useState("")

  const [error, setError] =
    useState("")

  const [dragging, setDragging] =
    useState(false)

  function processFile(file) {

    if (!file) return

    const isPng =
      file.type === "image/png" ||
      file.name
        .toLowerCase()
        .endsWith(".png")

    if (!isPng) {

      setError(
        "Only .PNG files are supported."
      )

      setImageLoaded(false)

      setIsEncoded(false)

      return
    }

    setError("")
    setDecoded("")
    setIsEncoded(false)

    const reader =
      new FileReader()

    reader.onload = (e) => {

      const img = new Image()

      img.onload = () => {

        const canvas =
          canvasRef.current

        if (!canvas) {

          setError(
            "Canvas failed to initialize."
          )

          setImageLoaded(false)

          return
        }

        const ctx =
          canvas.getContext("2d")

        if (!ctx) {

          setError(
            "Canvas context failed."
          )

          return
        }

        canvas.width = img.width
        canvas.height = img.height

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        )

        ctx.drawImage(img, 0, 0)

        setImageLoaded(true)

        toast.success(
          "PNG loaded"
        )
      }

      img.onerror = () => {

        setError(
          "Could not load image."
        )

        setImageLoaded(false)
      }

      img.src = e.target.result
    }

    reader.onerror = () => {

      setError(
        "Failed to read file."
      )
    }

    reader.readAsDataURL(file)
  }

  function handleImageUpload(event) {

    const file =
      event.target.files[0]

    processFile(file)

    event.target.value = ""
  }

  function handleDrop(event) {

    event.preventDefault()

    setDragging(false)

    const file =
      event.dataTransfer.files[0]

    processFile(file)
  }

  function handleDragOver(event) {

    event.preventDefault()

    setDragging(true)
  }

  function handleDragLeave() {

    setDragging(false)
  }

  function handleEncode() {

    setError("")

    try {

      const canvas =
        canvasRef.current

      encodeImage(canvas, message)

      setDecoded(
        "Message hidden successfully."
      )

      setIsEncoded(true)

      toast.success(
        "Image encoded"
      )
    }

    catch (err) {

      setIsEncoded(false)

      setError(err.message)
    }
  }

  function handleDecode() {

    setError("")

    try {

      const canvas =
        canvasRef.current

      const result =
        decodeImage(canvas)

      setDecoded(result)

      toast.success(
        "Hidden message extracted"
      )
    }

    catch (err) {

      setError(err.message)
    }
  }

  function downloadImage() {

    if (!isEncoded) return

    const canvas =
      canvasRef.current

    const link =
      document.createElement("a")

    link.download =
      "stegora-image.png"

    link.href =
      canvas.toDataURL("image/png")

    link.click()

    toast.success(
      "PNG downloaded"
    )
  }

  return (
    <div className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-8
    ">

      <div className="max-w-5xl mx-auto">

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
            Image Steganography
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
            Image Stego
          </h1>

          <p className="
            mt-3
            text-zinc-400
            max-w-2xl
          ">
            Hide messages inside PNG
            image pixels using LSB encoding.
          </p>

          <div className="mt-8">

            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border
                border-dashed
                transition-colors
                p-10
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer

                ${
                  dragging
                    ? "border-green-500 bg-green-500/5"
                    : "border-zinc-700 hover:border-green-500"
                }
              `}
            >

              <Upload
                size={30}
                className="mb-4"
              />

              <span className="text-zinc-400">
                Drag & drop PNG
                or click to upload
              </span>

              <input
                type="file"
                accept=".png,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />

            </label>

            <p className="
              mt-3
              text-sm
              text-red-400
            ">
              Note:
              only
              <span className="font-bold">
                {" "} .PNG
              </span>
              {" "}files are supported.
            </p>

          </div>

          <div className={`
            mt-8
            space-y-6
            ${
              imageLoaded
                ? ""
                : "hidden"
            }
          `}>

            <p className="
              text-green-400
              text-sm
            ">
              PNG loaded successfully.
            </p>

            <canvas
              ref={canvasRef}
              className="
                max-w-full
                border
                border-zinc-800
              "
            />

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              rows={5}
              placeholder="
Secret message...
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
                onClick={handleEncode}
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
                Encode Into Image
              </button>

              <button
                onClick={handleDecode}
                className="
                  px-5
                  py-3
                  border
                  border-zinc-700
                  hover:border-green-500
                  text-zinc-300
                  hover:text-green-400
                  transition-colors
                "
              >
                Decode Image
              </button>

              <button
                onClick={downloadImage}
                disabled={!isEncoded}
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
                Download PNG
              </button>

            </div>

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

          </div>

          {error && (

            <div className="
              mt-6
              border
              border-red-900
              bg-red-950/20
              text-red-400
              p-4
            ">
              {error}
            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default ImagePage