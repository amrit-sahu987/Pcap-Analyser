"use client";

import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progess';
import PcapPacketTable from '@/components/ui/packet-table';
import { Table } from '@/components/ui/table';
import PcapUploadPanel from '@/components/ui/pcapuploadpanel';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePacketData } from "@/app/PacketContext";
import router from 'next/router';

export default function Home() {
  const protocols = ['UDP', 'TCP', 'ARP', 'NDP', 'MLD', 'Other']
  const IP_versions = ['IPv4', 'IPv6', 'Unknown']
  const [protocolFilter, setProtocolFilter] = useState("all");
  const[resp, setResp] = useState<string>('');
  // const [packets, setPackets] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("");

  const nodeport = "8080"
  const pyport = "5000"

  const { packets, setPackets, message, setMessage } = usePacketData();

  const handlePackets = (data: any) => {
    setPackets(data.data);
    setMessage(data.message);
    // router.push("/analytics");
    // router.push("/anomaly-detection");
    // router.push("/ml");
  };

  const filteredPackets = (packets ?? []).filter(packet => {
    const proto = packet.protocol ? packet.protocol.toLowerCase() : 'unknown';
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
  });

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
              PCAP Analyser
            </h1>
            <p className="text-sm text-slate-400">Upload & View</p>
          </div>
        </div>
      </div>
    </div>

    {/* Main layout: Upload panel + Table */}
    <div className="flex h-[calc(100vh-80px)]">
      {/* Upload Panel - Left (1/4 width) */}
      <div className="w-1/4 bg-gradient-to-b from-slate-800 to-slate-900 border-r-4 border-blue-500/20 shadow-2xl">
        <div className="p-6 h-full">
          <PcapUploadPanel
              onPacketsReceived={handlePackets} onMessageReceived={function (msg: string): void {
                throw new Error('Function not implemented.');
              } }          />
        </div>
      </div>

      {/* Table - Right (3/4 width) */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 ">
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
            <div className="flex items-center gap-2">
            <span className="text-sm text-slate-800 dark:text-slate-800">Filter by Protocol:</span>
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
            </div>
            <div></div>
          </div>
        </div>
        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 ">
          <PcapPacketTable packets={filteredPackets} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  </div>
  );
  }