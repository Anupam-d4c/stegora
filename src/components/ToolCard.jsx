import { Link } from "react-router-dom"

function ToolCard({ title, description, icon: Icon, path }) {
  return (
    <Link
      to={path}
      className="
        border border-zinc-800
        bg-zinc-950
        p-6
        hover:border-green-500
        transition-all
        duration-300
        hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]
        group
      "
    >
      <div className="flex items-center gap-4 mb-4">
        <Icon
          size={28}
          className="text-green-400 group-hover:scale-110 transition-transform"
        />

        <h2 className="text-xl font-bold text-green-400">
          {title}
        </h2>
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  )
}

export default ToolCard