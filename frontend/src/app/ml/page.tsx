"use client";

import { usePacketData } from "@/app/PacketContext";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function MlPage() {
    const { packets, message } = usePacketData();
    return (
        <div className={`h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans`}>
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
                            <p className="text-sm text-slate-400">ML Analysis</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center px-5 py-5">
                <Card className="w-[100%] shadow-lg max-h">
                    <CardContent>
                        <p>{message}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}