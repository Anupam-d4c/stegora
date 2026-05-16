import ToolCard from "../components/ToolCard"

import {
  Ghost,
  Image,
  AudioLines,
  FileText,
  QrCode,
  FileSearch
} from "lucide-react"

function Home() {
  const tools = [
    {
      title: "Unicode",
      description: "Hide messages inside invisible Unicode characters.",
      icon: Ghost,
      path: "/unicode"
    },
    {
      title: "Image",
      description: "Embed hidden text inside image pixels.",
      icon: Image,
      path: "/image"
    },
    {
      title: "Audio",
      description: "Conceal data within audio files.",
      icon: AudioLines,
      path: "/audio"
    },
    {
      title: "Metadata",
      description: "Store hidden data in file metadata.",
      icon: FileSearch,
      path: "/metadata"
    },
    {
      title: "Text",
      description: "Use formatting and invisible spacing tricks.",
      icon: FileText,
      path: "/text"
    },
    {
      title: "QR",
      description: "Generate and decode hidden QR payloads.",
      icon: QrCode,
      path: "/qr"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">

        <header className="mb-12">
          <h1 className="text-6xl font-black text-green-400 tracking-wider">
            STEGORA
          </h1>

          <p className="text-zinc-500 mt-4 max-w-2xl leading-relaxed">
            Browser-based steganography toolkit for educational use.
            Explore hidden communication through Unicode, images,
            audio, metadata, QR systems, and more.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              path={tool.path}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Home