"use client"

interface StatsCardProps {
  label: string
  value: string | number
  icon: "file" | "trending-up" | "trending-down"
  color?: "default" | "green" | "red"
}

export function StatsCard({ label, value, icon, color = "default" }: StatsCardProps) {
  const iconColors = {
    default: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  }

  const bgColors = {
    default: "bg-blue-50",
    green: "bg-green-50",
    red: "bg-red-50",
  }

  const borderColors = {
    default: "border-blue-200",
    green: "border-green-200",
    red: "border-red-200",
  }

  const textColors = {
    default: "text-blue-900",
    green: "text-green-900",
    red: "text-red-900",
  }

  const getIcon = () => {
    switch (icon) {
      case "file":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        )
      case "trending-up":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case "trending-down":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        )
    }
  }

  return (
    <div className={`${bgColors[color]} border ${borderColors[color]} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColors[color]} text-sm font-medium`}>{label}</p>
          <p className="text-gray-900 text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${iconColors[color]} opacity-70`}>{getIcon()}</div>
      </div>
    </div>
  )
}
