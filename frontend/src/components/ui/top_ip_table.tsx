import { Packet } from "@/components/ui/packet-table"

import React from "react"

type IPTableProps = {
  title: string
  data: {
    ip: string
    count: number
  }[]
}


type IPCount = {
  ip: string
  count: number
}

export function getTopIPs(packets: Packet[], key: "source_ip" | "destination_ip" | "destination", counter: number): IPCount[] {
  const counts: Record<string, number> = {}

  for (const packet of packets) {
    const ip = packet[key]
    if (ip === '?') continue
    counts[ip] = (counts[ip] || 0) + 1
  }

  return Object.entries(counts)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, counter)
}

export function TopIPTable({ title, data }: IPTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">{title}</h2>
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-slate-500 dark:text-slate-300 text-sm border-b border-slate-300 dark:border-slate-700">
            <th className="py-2">IP Address</th>
            <th className="py-2 text-right">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ ip, count }) => (
            <tr key={ip} className="text-slate-800 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-700">
              <td className="py-2">{ip}</td>
              <td className="py-2 text-right">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
