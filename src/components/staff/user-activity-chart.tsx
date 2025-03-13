"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    day: "Mon",
    users: 2400,
  },
  {
    day: "Tue",
    users: 1398,
  },
  {
    day: "Wed",
    users: 3800,
  },
  {
    day: "Thu",
    users: 3908,
  },
  {
    day: "Fri",
    users: 4800,
  },
  {
    day: "Sat",
    users: 3800,
  },
  {
    day: "Sun",
    users: 4300,
  },
]

export function UserActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip formatter={(value) => [`${value}`, "Active Users"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Line
          type="monotone"
          dataKey="users"
          stroke="currentColor"
          className="stroke-primary"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

