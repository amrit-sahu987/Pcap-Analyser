"use client"

import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useState } from "react";

export default function OpenliPage() {
    const [step1Clicked, setStep1Clicked] = useState(false);
    const [step2Clicked, setStep2Clicked] = useState(false);
    const [step3Clicked, setStep3Clicked] = useState(false);
    const [step4Clicked, setStep4Clicked] = useState(false);
    const [step5Clicked, setStep5Clicked] = useState(false);
    const [step6Clicked, setStep6Clicked] = useState(false);

    const handleStart = async () => {
        try {
            const res = await fetch("http://localhost:5000/open-li/start-all", { method: "GET" })

            if (!res.ok) {
                const error = await res.json()
                // toast('Error ${res.status}: ${error.error}')
                throw new Error('Error ${res.status}: ${error.error}')
            }
            const resp = await res.json()
            toast("Started OpenLI successfully")
        } catch (err) {
            toast("Failed to start OpenLI")
        }
    }

    const handleConfig = async () => {
        try {
            const res = await fetch("http://localhost:5000/open-li/config-ip", { method: "GET" })

            if (!res.ok) {
                const error = await res.json()
                // toast('Error ${res.status}: ${error.error}')
                throw new Error('Error ${res.status}: ${error.error}')
            }
            const resp = await res.json()
            toast("Configured IP capture successfully")
        } catch (err) {
            toast("Failed to configure IP capture")
        }
    }

    const handleModify = async () => {
        try {
            const res = await fetch("http://localhost:5000/open-li/modify-ip", { method: "GET" })

            if (!res.ok) {
                const error = await res.json()
                // toast('Error ${res.status}: ${error.error}')
                throw new Error('Error ${res.status}: ${error.error}')
            }
            const resp = await res.json()
            toast("Modified IP capture successfully")
        } catch (err) {
            toast("Failed to modify IP capture")
        }
    }
    
    const handleDelete = async () => {
        try {
            const res = await fetch("http://localhost:5000/open-li/delete-ip", { method: "GET" })

            if (!res.ok) {
                const error = await res.json()
                // toast('Error ${res.status}: ${error.error}')
                throw new Error('Error ${res.status}: ${error.error}')
            }
            const resp = await res.json()
            toast("Delete IP capture successfully")
        } catch (err) {
            toast("Failed to delete IP capture")
        }
    }

    const handleEnd = async () => {
        try {
            const res = await fetch("http://localhost:5000/open-li/end-all", { method: "GET" })

            if (!res.ok) {
                const error = await res.json()
                // toast('Error ${res.status}: ${error.error}')
                throw new Error('Error ${res.status}: ${error.error}')
            }
            const resp = await res.json()
            toast("Terminated OpenLI successfully")
        } catch (err) {
            toast("Failed to terminate OpenLI")
        }
    }

    const enabled1 = !step1Clicked || step6Clicked
    const enabled2 = step1Clicked 
    const enabled3 = step2Clicked
    const enabled4 = step2Clicked 
    const enabled5 = step2Clicked 
    const enabled6 = step1Clicked && !step6Clicked

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
                            <p className="text-sm text-slate-400">LI Simulator</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-5 px-5 py-5">
                <Card className="w-[40%] shadow-lg max-h">
                    <CardContent className="flex  flex-col justify-left w-[40%]"> 
                        <button type="button" 
                        className={`text-black bg-gradient-to-r from-lime-200 to-blue-500 hover:bg-gradient-to-l 
                        hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 
                        dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
                        ${!enabled1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!enabled1} onClick={() => {handleStart(); setStep1Clicked(x => !x); setStep6Clicked(false);}} >
                        Start OpenLI</button>
                        
                        <button type="button" 
                        className={`text-black bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl 
                        focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium
                        rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${!enabled2 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!enabled2} onClick={() => {setStep2Clicked(true); handleConfig();}}>
                        Configure IP Capture</button>
                        
                        <button type="button" 
                        className={`text-black bg-gradient-to-r from-cyan-300 to-blue-600 hover:bg-gradient-to-bl 
                        focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${!enabled3 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        onClick={() => {setStep3Clicked(x => !x)}}
                        disabled={!enabled3}>Run IP Capture</button>

                        <button type="button" 
                        className={`text-black bg-gradient-to-br from-purple-500 to-blue-600 hover:bg-gradient-to-bl 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${!enabled4 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!enabled4} onClick={() => {setStep4Clicked(x => !x); handleModify();}}>
                        Modify IP Capture</button>
                        
                        <button type="button" 
                        className={`text-black bg-gradient-to-r from-fuchsia-500 to-blue-600 hover:bg-gradient-to-bl 
                        focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${!enabled5 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!enabled5} onClick={() => {setStep5Clicked(x => !x); handleDelete();}}>
                        Delete IP Capture</button>
                        
                        <button type="button" 
                        className={`text-black bg-gradient-to-br from-red-600 to-blue-600 hover:bg-gradient-to-bl 
                        focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium 
                        rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${!enabled6 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!enabled6} onClick={() => {setStep6Clicked(x => !x); handleEnd(); setStep2Clicked(false); setStep1Clicked(false);}}>
                        End OpenLI</button>
                    </CardContent>
                    <CardContent>
                        <p>{step1Clicked.toString()}</p>
                        <p>{step2Clicked.toString()}</p>
                        <p>{step3Clicked.toString()}</p>
                        <p>{step4Clicked.toString()}</p>
                        <p>{step5Clicked.toString()}</p>
                        <p>{step6Clicked.toString()}</p>
                    </CardContent>
                </Card>
                <Card className="w-[60%] shadow-lg max-h">
                    <CardContent className="flex justify-center">
                            <img 
                            className="max-w-full transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
                            src="Diagram2.svg"/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
