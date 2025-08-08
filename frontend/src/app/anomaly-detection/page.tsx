"use client";

import { usePacketData } from "@/app/PacketContext";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PcapPacketTable from "@/components/ui/packet-table"
import { useEffect, useState } from "react";
import NetflowTable, { Netflow } from "@/components/ui/netflowtable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import ProtocolDropdown, { ProtocolOption } from "@/components/ui/protocoldropdown";

export default function AnomalyDetectionPage() {
    const { message, filename } = usePacketData();
    const [filteredData, setFilteredData] = useState<Netflow[]>([]);
    const [protocolFilter, setProtocolFilter] = useState<ProtocolOption>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData2, setFilteredData2] = useState<Netflow[]>([]);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/anomaly-detection?filename=${filename}`, {
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(typeof data)
            console.log(data)
            setFilteredData(data.autoencode);
            setFilteredData2(data.cluster);
        })
        .catch((err) => console.error("Failed to fetch netflows:", err));
    }, []);

    const filteredPackets = Array.isArray(filteredData) ?
        filteredData.filter((packet) => {
            const proto = packet.Proto ? packet.Proto.toLowerCase() : 'unknown';
            const query = searchQuery.toLowerCase();

            const matchesProtocol = protocolFilter === "all"
            ? true
            : protocolFilter === "other"
            ? !["udp", "tcp", "ndp", "mld", "arp"].some(p => proto.includes(p))
            : proto.includes(protocolFilter);

            const matchesSearch = Object.values(packet)
            .join(" ")
            .toLowerCase()
            .includes(query);

            return matchesProtocol && matchesSearch;
        })
        : [];
    
    const filteredPackets2 = Array.isArray(filteredData2) ?
        filteredData2.filter((packet) => {
            const proto = packet.Proto ? packet.Proto.toLowerCase() : 'unknown';
            const query = searchQuery.toLowerCase();

            const matchesProtocol = protocolFilter === "all"
            ? true
            : protocolFilter === "other"
            ? !["udp", "tcp", "ndp", "mld", "arp"].some(p => proto.includes(p))
            : proto.includes(protocolFilter);

            const matchesSearch = Object.values(packet)
            .join(" ")
            .toLowerCase()
            .includes(query);

            return matchesProtocol && matchesSearch;
        })
        : [];


    return (
        <div className={`h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans`}>
            <div className="border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <SidebarTrigger />
                        </div>
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg ">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            PCAP Analyser
                            </h1>
                            <p className="text-sm text-slate-400">ML Anomaly Detection</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center px-5 py-5">
                <Card className="w-[100%] shadow-lg max-h">
                    <CardContent>
                        <h2><b>ChatGPT's Opinion:</b></h2>
                        <p>{message}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center px-5 py-5">
                <Card className="w-[100%] shadow-lg max-h relative z-10">
                    <CardContent>
                        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 ">
                            <div className="p-6 border-b-2 border-blue-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                <div className="flex items-center justify-between ">
                                    <div>
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Packet View</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Network traffic results
                                    </p>
                                    </div>
                                    <div>
                                    <input
                                        type="text"
                                        placeholder="Search packets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full max-w-sm px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    </div>
                                    <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Displaying <span className="font-semibold">{filteredPackets.length}</span> packet{filteredPackets.length !== 1 ? 's' : ''}
                                    </p>
                                    </div>
                                    {/* <div className="flex items-center gap-2 relative overflow-visible z-50">
                                    <span className="text-sm text-slate-800 dark:text-slate-800">Filter by Protocol:</span>
                                    <ProtocolDropdown value={protocolFilter} onChange={setProtocolFilter}/>
                                    <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                                    <SelectTrigger className="w-[120px] text-slate-800">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="udp">UDP</SelectItem>
                                        <SelectItem value="tcp">TCP</SelectItem>
                                        <SelectItem value="ndp">NDP</SelectItem>
                                        <SelectItem value="mld">MLD</SelectItem>
                                        <SelectItem value="arp">ARP</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    </div> */}
                                    {/* <div></div>  */}
                                </div>
                            </div>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 relative z-10">
                                <NetflowTable flows={filteredPackets} searchQuery={searchQuery}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center px-5 py-5">
                <Card className="w-[100%] shadow-lg max-h relative z-10">
                    <CardContent>
                        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 ">
                            <div className="p-6 border-b-2 border-blue-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                <div className="flex items-center justify-between ">
                                    <div>
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Packet View</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Network traffic results
                                    </p>
                                    </div>
                                    <div>
                                    <input
                                        type="text"
                                        placeholder="Search packets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full max-w-sm px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    </div>
                                    <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Displaying <span className="font-semibold">{filteredPackets2.length}</span> packet{filteredPackets2.length !== 1 ? 's' : ''}
                                    </p>
                                    </div>
                                </div>
                            </div>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 relative z-10">
                                <NetflowTable flows={filteredPackets2} searchQuery={searchQuery}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}