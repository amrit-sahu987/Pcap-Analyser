"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"

export type Netflow = {
  SrcAddr: string
  Sport: number
  DstAddr: string
  Dport: number
  Proto: string
  Dur: number
  TotPkts: number
  TotBytes: number
}

interface NetflowTableProps {
  flows: Netflow[];
  searchQuery: string;
}

function highlightMatch(text: string | number | null | undefined, query: string) {
  if (text === null || text === undefined) return null;
  const str = String(text);
  if (!query) return str;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = str.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-purple-300 text-black rounded-sm px-0.5">{part}</span>
    ) : (
      part
    )
  );
}

const NetflowTable: React.FC<NetflowTableProps> = ({ flows, searchQuery }) => {
  const [selectedFlow, setSelectedFlow] = useState<Netflow | null>(null)

  return (
    <div className="w-full flex justify-center">
      <Card className="w-[96%] shadow-lg max-h">
        <CardContent className="p-0 overflow-y-auto max-h-[75vh]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-semibold">#</th>
                <th className="px-4 py-2 font-semibold">Protocol</th>
                <th className="px-4 py-2 font-semibold">Source IP</th>
                <th className="px-4 py-2 font-semibold">Src Port</th>
                <th className="px-4 py-2 font-semibold">Destination IP</th>
                <th className="px-4 py-2 font-semibold">Dst Port</th>
                <th className="px-4 py-2 font-semibold">Duration</th>
                <th className="px-4 py-2 font-semibold">Total Pkts</th>
                <th className="px-4 py-2 font-semibold">Total Bytes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flows.map((flow, index) => (
                <tr key={index} className="hover:bg-gray-50" onClick={() => setSelectedFlow(flow)}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.Proto, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.SrcAddr, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.Sport, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.DstAddr, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.Dport, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.Dur, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.TotPkts, searchQuery)}</td>
                  <td className="px-4 py-2">{highlightMatch(flow.TotBytes, searchQuery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedFlow} onOpenChange={() => setSelectedFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Netflow Details</DialogTitle>
          </DialogHeader>
          {selectedFlow && (
            <div className="text-sm space-y-2">
              <p><strong>Protocol:</strong> {highlightMatch(selectedFlow.Proto, searchQuery)}</p>
              <p><strong>Source IP:</strong> {highlightMatch(selectedFlow.SrcAddr, searchQuery)}</p>
              <p><strong>Source Port:</strong> {highlightMatch(selectedFlow.Sport, searchQuery)}</p>
              <p><strong>Destination IP:</strong> {highlightMatch(selectedFlow.DstAddr, searchQuery)}</p>
              <p><strong>Destination Port:</strong> {highlightMatch(selectedFlow.Dport, searchQuery)}</p>
              <p><strong>Duration:</strong> {highlightMatch(selectedFlow.Dur, searchQuery)}</p>
              <p><strong>Total Packets:</strong> {highlightMatch(selectedFlow.TotPkts, searchQuery)}</p>
              <p><strong>Total Bytes:</strong> {highlightMatch(selectedFlow.TotBytes, searchQuery)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetflowTable;
