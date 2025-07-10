"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Packet = {
  source_ip: string
  destination_ip: string
  protocol: string
  time: string
}

interface PcapPacketTableProps {
  packets: Packet[]
}

const PcapPacketTable: React.FC<PcapPacketTableProps> = ({ packets }) => {
  return (
    <div className="w-full flex justify-center ">
      <Card className="w-[96%] shadow-lg max-h-[75vh]">
        <CardContent className="p-0 overflow-y-auto max-h-[75vh]">
          <table className="min-w-full text-sm text-left ">
            <thead className="bg-gray-100 sticky top-0 z-10 ">
              <tr>
                <th className="px-4 py-2 font-semibold">#</th>
                <th className="px-4 py-2 font-semibold">Source</th>
                <th className="px-4 py-2 font-semibold">Destination</th>
                <th className="px-4 py-2 font-semibold">Protocol</th>
                <th className="px-4 py-2 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {packets.map((packet, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{packet.source_ip}</td>
                  <td className="px-4 py-2">{packet.destination_ip}</td>
                  <td className="px-4 py-2">{packet.protocol}</td>
                  <td className="px-4 py-2">{packet.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default PcapPacketTable

