import { Link } from 'react-router-dom';

const SPORTS = [
  {
    name: "Badminton",
    icon: "🏸",
    color: "from-blue-500 to-blue-600",
    href: "/venues?sport=Badminton",
  },
  {
    name: "Tennis",
    icon: "🎾",
    color: "from-green-500 to-green-600",
    href: "/venues?sport=Tennis",
  },
  {
    name: "Football",
    icon: "⚽",
    color: "from-purple-500 to-purple-600",
    href: "/venues?sport=Football",
  },
  {
    name: "Cricket",
    icon: "🏏",
    color: "from-orange-500 to-orange-600",
    href: "/venues?sport=Cricket",
  },
  {
    name: "Basketball",
    icon: "🏀",
    color: "from-red-500 to-red-600",
    href: "/venues?sport=Basketball",
  },
  {
    name: "Swimming",
    icon: "🏊",
    color: "from-cyan-500 to-cyan-600",
    href: "/venues?sport=Swimming",
  },
];

export default function PopularSportsRail() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {SPORTS.map((sport) => (
        <Link
          key={sport.name}
          to={sport.href}
          className="group flex min-w-[120px] flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div
            className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${sport.color} text-2xl transition-transform group-hover:scale-110`}
          >
            {sport.icon}
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">{sport.name}</div>
            <div className="text-xs text-gray-500">Find venues</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
