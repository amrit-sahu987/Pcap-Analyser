"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { usePacketData } from "@/app/PacketContext";
import { Packet } from "@/components/ui/packet-table"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ProtocolPieChart } from "@/components/ui/pie-chart";
import { ChartAreaInteractive } from "@/components/ui/interactive-area-chart";
import { getTopIPs, TopIPTable } from "@/components/ui/top_ip_table";

type ProtocolCount = {
  name: string;
  value: number;
};

function countPacketsByProtocol(packets: Packet[]): ProtocolCount[] {
  const commonProtocols = ["udp", "tcp", "arp", "ndp", "mld"];
  const counts: Record<string, number> = {};

  for (const packet of packets) {
    const proto = packet.protocol?.toLowerCase() || "unknown";
    const category = commonProtocols.includes(proto) ? proto : "other";
    counts[category] = (counts[category] || 0) + 1;
  }

  return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }));
}

export default function AnalyticsPage() {
    const { packets, message } = usePacketData();
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f", "#d0ed57"];
    const protocolData = countPacketsByProtocol(packets);

    const topSources = getTopIPs(packets, "source_ip", 7)
    const topDestinations = getTopIPs(packets, "destination_ip", 7)
    const topDestDomains = getTopIPs(packets, "destination", 4)

    return (
        <div className={`h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans`}>
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <SidebarTrigger />
                        </div>
                        {/* <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg ">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div> */}
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            PCAP Analyzer
                            </h1>
                            <p className="text-sm text-slate-400">Analytics</p>
                        </div>
                    </div>
                </div>
            </div>
            {/*body*/}
            <div className="flex justify-center px-5 py-5">
                <Card className="w-[100%] shadow-lg max-h">
                    <CardContent>
                        <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-100 mb-4">
                        Network Traffic
                        </h2>
                        <ChartAreaInteractive packets={packets}></ChartAreaInteractive>
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center gap-5 px-5 py-5 items-stretch">
                <Card className="w-[25%] shadow-lg max-h">
                    <CardContent>
                        {/* <TopIPTable title="Top Destinations" data={topDestDomains} /> */}
                        <p>{message}</p>
                    </CardContent>
                </Card>
                <Card className="w-[25%] shadow-lg max-h">
                    <CardContent className="p-3">
                        <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-100 mb-4">
                        Protocol Distribution
                        </h2>
                        <ProtocolPieChart data={protocolData} />
                    </CardContent>
                </Card>
                <Card className="w-[25%] shadow-lg max-h">
                    <CardContent>
                            <TopIPTable title="Top Source IPs" data={topSources} />
                    </CardContent>
                </Card>
                <Card className="w-[25%] shadow-lg max-h">
                    <CardContent>
                            <TopIPTable title="Top Destination IPs" data={topDestinations} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}