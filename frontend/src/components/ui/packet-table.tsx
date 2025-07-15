"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

export type Packet = {
  IP_version: string
  protocol: string
  source_ip: string
  destination_ip: string
  destination: string
  time: string
}

interface PcapPacketTableProps {
  packets: Packet[];
  searchQuery: string;
}

function highlightMatch(text: string | null | undefined, query: string) {
  if (!text) return null;
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi"); // case-insensitive match
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-purple-300 text-black rounded-sm px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  );
}


const PcapPacketTable: React.FC<PcapPacketTableProps> = ({ packets, searchQuery }) => {
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null)

  return (
    <div className="w-full flex justify-center ">
      <Card className="w-[96%] shadow-lg max-h">
        <CardContent className="p-0 overflow-y-auto max-h-[75vh]">
          <table className="min-w-full text-sm text-left ">
            <thead className="bg-gray-100 sticky top-0 z-10 ">
              <tr>
                <th className="px-4 py-2 font-semibold">#</th>
                <th className="px-4 py-2 font-semibold">IP Version</th>
                <th className="px-4 py-2 font-semibold">Protocol</th>
                <th className="px-4 py-2 font-semibold">Source IP</th>
                <th className="px-4 py-2 font-semibold">Destination IP</th>
                <th className="px-4 py-2 font-semibold">Destination</th>
                <th className="px-4 py-2 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {packets.map((packet, index) => (
                <tr key={index} className="hover:bg-gray-50" onClick={() => setSelectedPacket(packet)}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.IP_version, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.protocol, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.source_ip, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.destination_ip, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.destination, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(packet.time, searchQuery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPacket} onOpenChange={() => setSelectedPacket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Packet Details</DialogTitle>
          </DialogHeader>
          {selectedPacket && (
            <div className="text-sm space-y-2">
              <p><strong>IP Version:</strong> {highlightMatch(selectedPacket.IP_version, searchQuery)}</p>
              <p><strong>Protocol:</strong> {highlightMatch(selectedPacket.protocol, searchQuery)}</p>
              <p><strong>Source IP:</strong> {highlightMatch(selectedPacket.source_ip, searchQuery)}</p>
              <p><strong>Destination IP:</strong> {highlightMatch(selectedPacket.destination_ip, searchQuery)}</p>
              <p><strong>Destination:</strong> {highlightMatch(selectedPacket.destination, searchQuery)}</p>
              <p><strong>Timestamp:</strong> {highlightMatch(selectedPacket.time, searchQuery)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PcapPacketTable

