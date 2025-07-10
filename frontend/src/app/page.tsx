"use client";

import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progess';
import PcapPacketTable from '@/components/ui/packet-table';
import { Table } from '@/components/ui/table';
import PcapUploadPanel from '@/components/ui/pcapuploadpanel';

export default function Home() {
  const[resp, setResp] = useState<string>('');
  const [packets, setPackets] = useState<any[]>([])
  const nodeport = "8080"
  const pyport = "5000"

  const nodesubmit = () => {
  axios.get('http://localhost:' + nodeport).then((data) => {
    console.log(data)
    setResp(data.data)
  })
  }

  const pysubmit = () => {
    axios.get('http://localhost:' + pyport).then((data) => {
    console.log(data)
    setResp(data.data)
  })
  }
  return (
  <div className={`min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans`}>
    {/* Header */}
    <div className="border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              PCAP Analyzer
            </h1>
            <p className="text-sm text-slate-400">Network packet analysis dashboard</p>
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
            onPacketsReceived={setPackets}
          />
        </div>
      </div>

      {/* Table - Right (3/4 width) */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 ">
        <div className="p-6 border-b-2 border-blue-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between ">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Packet Analysis</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Network traffic analysis results
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-slate-700 px-3 py-1.5 rounded-full border border-blue-200 dark:border-slate-600">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z " />
              </svg>
              Ready for analysis
            </div>
          </div>
        </div>
        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 ">
          <PcapPacketTable packets={packets} />
        </div>
      </div>
    </div>
  </div>
);
}

// return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white text-gray-800 font-san ${geistSans.variable}">
//     {/* Main layout: Upload panel + Table */}
//     <div className="flex px-6 gap-6 pb-10">
//       {/* Upload Panel - Left */}
//       <div className="w-1/4">
//         <PcapUploadPanel
//           onPacketsReceived={(packets: any[]) => {
//             // Handle packets here
//           }}
//         />
//       </div>
//       {/* Table - Right */}
//       <div className="w-3/4">
//         <PcapPacketTable packets={[]} />
//       </div>
//     </div>
//   </div>
//   );