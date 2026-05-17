import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Copy, ShieldAlert } from "lucide-react"

import { encodeUnicodeMessage, decodeUnicodeMessage } from "../utils/unicodeStego.js"

function UnicodePage() {
  const [mode, setMode] = useState("encode")
  const [carrierType, setCarrierType] = useState("emoji")
  const [input, setInput] = useState("")
  const [carrier, setCarrier] = useState("🎁")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  function handleAction() {
    setError("")

    try {
      if (mode === "encode") {
        if (!input.trim()) {
          setError("Please enter a secret message first.")
          return
        }

        const visibleCarrier = carrier.trim() || (carrierType === "emoji" ? "🎁" : "Visible text")
        setOutput(encodeUnicodeMessage(input, visibleCarrier))
      } else {
        if (!input.trim()) {
          setError("Please paste encoded text first.")
          return
        }

        setOutput(decodeUnicodeMessage(input))
      }
    } catch (err) {
      setOutput("")
      setError(err.message || "Something went wrong.")
    }
  }

  async function copyOutput() {
    if (!output) return
    await navigator.clipboard.writeText(output)
  }

  const carrierLabel = carrierType === "emoji" ? "Carrier Emoji" : "Carrier Text"
  const carrierPlaceholder = carrierType === "emoji" ? "🎁" : "Write normal-looking text here"

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <span className="text-xs uppercase tracking-[0.3em] text-green-400">
            Unicode / Text Steganography
          </span>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-8">
          <h1 className="text-4xl font-bold text-green-400">
            Invisible Text Stego
          </h1>

          <p className="mt-3 text-zinc-400 max-w-2xl leading-relaxed">
            Hide a secret inside invisible Unicode characters. Use either a visible emoji carrier or a normal text carrier.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-2 border transition-colors ${
                mode === "encode"
                  ? "border-green-500 text-green-400"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              Encode
            </button>

            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-2 border transition-colors ${
                mode === "decode"
                  ? "border-green-500 text-green-400"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              Decode
            </button>
          </div>

          {mode === "encode" && (
            <div className="mt-6">
              <div className="inline-flex border border-zinc-800 overflow-hidden">
                <button
                  onClick={() => {
                    setCarrierType("emoji")
                    setCarrier("🎁")
                  }}
                  className={`px-4 py-2 text-sm transition-colors ${
                    carrierType === "emoji"
                      ? "bg-green-500 text-black"
                      : "bg-black text-zinc-400 hover:text-green-400"
                  }`}
                >
                  Emoji Carrier
                </button>

                <button
                  onClick={() => {
                    setCarrierType("text")
                    setCarrier("This looks normal")
                  }}
                  className={`px-4 py-2 text-sm transition-colors ${
                    carrierType === "text"
                      ? "bg-green-500 text-black"
                      : "bg-black text-zinc-400 hover:text-green-400"
                  }`}
                >
                  Text Carrier
                </button>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                The hidden part is the same either way. Only the visible carrier changes.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-5">
            {mode === "encode" && (
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  {carrierLabel}
                </label>

                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-black border border-zinc-800 px-4 py-3 outline-none focus:border-green-500"
                  placeholder={carrierPlaceholder}
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                {mode === "encode" ? "Secret Message" : "Encoded Text"}
              </label>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                className="w-full bg-black border border-zinc-800 px-4 py-3 outline-none focus:border-green-500 resize-none"
                placeholder={
                  mode === "encode"
                    ? "Type the message you want to hide"
                    : "Paste the encoded text here"
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAction}
                className="px-5 py-3 bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
              >
                {mode === "encode" ? "Generate Hidden Text" : "Reveal Message"}
              </button>

              <button
                onClick={copyOutput}
                disabled={!output}
                className="inline-flex items-center gap-2 px-5 py-3 border border-zinc-800 text-zinc-300 hover:border-green-500 hover:text-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy size={16} />
                Copy Output
              </button>
            </div>

            {output && (
              <div className="border border-zinc-800 bg-black p-4 text-green-400 break-words relative whitespace-pre-wrap">
                <button
                  onClick={copyOutput}
                  className="absolute top-3 right-3 text-zinc-400 hover:text-green-400"
                >
                  <Copy size={16} />
                </button>
                {output}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 border border-red-900 bg-red-950/20 text-red-400 p-4">
                <ShieldAlert size={16} className="mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnicodePage