// "use client"

// import type React from "react"

// import { useState } from "react"
// import { ChevronDown, ChevronUp, Search, Filter, Clock, Globe, Zap } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface Packet {
//   id: number
//   timestamp: string
//   source_ip: string
//   destination_ip: string
//   protocol: string
//   length: number
//   info: string
//   source_port?: number
//   destination_port?: number
//   flags?: string
// }

// interface PacketTableProps {
//   packets: Packet[]
// }

// export function PacketTable({ packets }: PacketTableProps) {
//   const [sortField, setSortField] = useState<keyof Packet>("id")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [protocolFilter, setProtocolFilter] = useState<string>("all")

//   const protocols = Array.from(new Set(packets.map((p) => p.protocol)))

//   const filteredPackets = packets.filter((packet) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       Object.values(packet).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))

//     const matchesProtocol = protocolFilter === "all" || packet.protocol === protocolFilter

//     return matchesSearch && matchesProtocol
//   })

//   const sortedPackets = [...filteredPackets].sort((a, b) => {
//     const aValue = a[sortField]
//     const bValue = b[sortField]

//     if (aValue === undefined || bValue === undefined) return 0

//     if (sortDirection === "asc") {
//       return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
//     } else {
//       return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
//     }
//   })

//   const handleSort = (field: keyof Packet) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   const getProtocolColor = (protocol: string) => {
//     const colors: Record<string, string> = {
//       TCP: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 shadow-sm",
//       UDP: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 shadow-sm",
//       ICMP: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 shadow-sm",
//       HTTP: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 shadow-sm",
//       HTTPS:
//         "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700 shadow-sm",
//       DNS: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 shadow-sm",
//     }
//     return (
//       colors[protocol] ||
//       "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 shadow-sm"
//     )
//   }

//   const SortButton = ({ field, children }: { field: keyof Packet; children: React.ReactNode }) => (
//     <Button
//       variant="ghost"
//       size="sm"
//       className="h-auto p-0 font-medium hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
//       onClick={() => handleSort(field)}
//     >
//       {children}
//       {sortField === field &&
//         (sortDirection === "asc" ? (
//           <ChevronUp className="ml-1 h-3 w-3 text-indigo-600 dark:text-indigo-400" />
//         ) : (
//           <ChevronDown className="ml-1 h-3 w-3 text-indigo-600 dark:text-indigo-400" />
//         ))}
//     </Button>
//   )

//   return (
//     <div className="h-full flex flex-col">
//       {/* Search and Filter Bar */}
//       <div className="p-6 border-b-2 border-indigo-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
//             <Input
//               placeholder="Search packets by IP, protocol, or info..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-white dark:bg-slate-800 border-indigo-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//               <Select value={protocolFilter} onValueChange={setProtocolFilter}>
//                 <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-indigo-200 dark:border-slate-600 shadow-sm">
//                   <SelectValue placeholder="Protocol" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Protocols</SelectItem>
//                   {protocols.map((protocol) => (
//                     <SelectItem key={protocol} value={protocol}>
//                       {protocol}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-slate-600 shadow-sm">
//               {sortedPackets.length} of {packets.length} packets
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex-1 overflow-hidden bg-white dark:bg-slate-800">
//         <div className="h-full overflow-auto">
//           <Table>
//             <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b-2 border-indigo-200 dark:border-slate-600 shadow-sm">
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="w-16 font-semibold text-slate-700 dark:text-slate-300">
//                   <SortButton field="id">ID</SortButton>
//                 </TableHead>
//                 <TableHead className="w-40 font-semibold text-slate-700 dark:text-slate-300">
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
//                     <SortButton field="timestamp">Timestamp</SortButton>
//                   </div>
//                 </TableHead>
//                 <TableHead className="w-32 font-semibold text-slate-700 dark:text-slate-300">
//                   <div className="flex items-center gap-1">
//                     <Globe className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
//                     <SortButton field="source_ip">Source IP</SortButton>
//                   </div>
//                 </TableHead>
//                 <TableHead className="w-20 font-semibold text-slate-700 dark:text-slate-300">Port</TableHead>
//                 <TableHead className="w-32 font-semibold text-slate-700 dark:text-slate-300">
//                   <div className="flex items-center gap-1">
//                     <Globe className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
//                     <SortButton field="destination_ip">Dest IP</SortButton>
//                   </div>
//                 </TableHead>
//                 <TableHead className="w-20 font-semibold text-slate-700 dark:text-slate-300">Port</TableHead>
//                 <TableHead className="w-24 font-semibold text-slate-700 dark:text-slate-300">
//                   <div className="flex items-center gap-1">
//                     <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
//                     <SortButton field="protocol">Protocol</SortButton>
//                   </div>
//                 </TableHead>
//                 <TableHead className="w-20 font-semibold text-slate-700 dark:text-slate-300">
//                   <SortButton field="length">Length</SortButton>
//                 </TableHead>
//                 <TableHead className="w-20 font-semibold text-slate-700 dark:text-slate-300">Flags</TableHead>
//                 <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Info</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {sortedPackets.map((packet, index) => (
//                 <TableRow
//                   key={packet.id}
//                   className={`hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition-colors border-b border-indigo-100 dark:border-slate-700 ${
//                     index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/50"
//                   }`}
//                 >
//                   <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">{packet.id}</TableCell>
//                   <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
//                     {new Date(packet.timestamp).toLocaleTimeString()}.
//                     {packet.timestamp.split(".")[1]?.slice(0, 3) || "000"}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">
//                     {packet.source_ip}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">
//                     {packet.source_port || "-"}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">
//                     {packet.destination_ip}
//                   </TableCell>
//                   <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">
//                     {packet.destination_port || "-"}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className={`${getProtocolColor(packet.protocol)} font-medium`}>
//                       {packet.protocol}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">
//                     {packet.length.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
//                     {packet.flags || "-"}
//                   </TableCell>
//                   <TableCell
//                     className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate"
//                     title={packet.info}
//                   >
//                     {packet.info}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Packet = {
  source: string
  destination: string
  protocol: string
  timestamp: string
}

interface PcapPacketTableProps {
  packets: Packet[]
}

const PcapPacketTable: React.FC<PcapPacketTableProps> = ({ packets }) => {
  return (
    <div className="w-full flex justify-center ">
      <Card className="w-[96%] h-[80vh] overflow-hidden shadow-lg ">
        <CardContent className="p-0 ">
          <ScrollArea className="h-full ">
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
                    <td className="px-4 py-2">{packet.source}</td>
                    <td className="px-4 py-2">{packet.destination}</td>
                    <td className="px-4 py-2">{packet.protocol}</td>
                    <td className="px-4 py-2">{packet.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default PcapPacketTable

