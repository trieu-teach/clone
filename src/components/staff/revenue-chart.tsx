"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Jan",
    subscriptions: 4000,
    oneTime: 2400,
  },
  {
    name: "Feb",
    subscriptions: 3000,
    oneTime: 1398,
  },
  {
    name: "Mar",
    subscriptions: 2000,
    oneTime: 9800,
  },
  {
    name: "Apr",
    subscriptions: 2780,
    oneTime: 3908,
  },
  {
    name: "May",
    subscriptions: 1890,
    oneTime: 4800,
  },
  {
    name: "Jun",
    subscriptions: 2390,
    oneTime: 3800,
  },
  {
    name: "Jul",
    subscriptions: 3490,
    oneTime: 4300,
  },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Legend />
        <Bar dataKey="subscriptions" name="Subscriptions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="oneTime" name="One-time Sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

