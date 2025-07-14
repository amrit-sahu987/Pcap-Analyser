"use client"

import * as React from "react"
import { AreaChart, Area, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { parseISO, differenceInSeconds, format } from 'date-fns';
import { Packet } from "@/components/ui/packet-table"
import { useState } from "react";


interface PacketFrequencyChartProps {
  packets: Packet[];
}

function parsePacketTime(timeStr: string): Date {
  const [timePart, datePart] = timeStr.split(' ');
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  const [day, month, year] = datePart.split('/').map(Number);
  const fullYear = 2000 + year;
  return new Date(fullYear, month - 1, day, hours, minutes, seconds);
}

function floorDateToUnit(date: Date, unit: 'second' | 'minute' | 'hour') {
  const d = new Date(date);
  if (unit === 'hour') d.setMinutes(0, 0, 0);
  else if (unit === 'minute') d.setSeconds(0, 0);
  else d.setMilliseconds(0);
  return d;
}

// Function to determine time unit based on span
function determineTimeUnit(start: Date, end: Date): 'second' | 'minute' | 'hour' {
  const diffMs = end.getTime() - start.getTime();
  const diffSec = diffMs / 1000;

  if (diffSec > 86400) return 'hour';     // more than a day
  if (diffSec > 3600) return 'minute';    // more than an hour
  return 'second';
}

// Main transformation
function getTimeFrequencyData(packets: Packet[]): { time: string, count: number }[] {
  if (!packets.length) return [];

  const timestamps = packets.map(p => parsePacketTime(p.time));
  const start = new Date(Math.min(...timestamps.map(d => d.getTime())));
  const end = new Date(Math.max(...timestamps.map(d => d.getTime())));
  const timeUnit = determineTimeUnit(start, end);

  const freqMap: Record<string, number> = {};

  for (const packet of packets) {
    const parsedDate = parsePacketTime(packet.time);
    const flooredDate = floorDateToUnit(parsedDate, timeUnit);
    const key = flooredDate.toISOString(); // Use this as x-axis key
    freqMap[key] = (freqMap[key] || 0) + 1;
  }

  return Object.entries(freqMap).map(([time, count]) => ({
    time,
    count,
  }));
}


function floorDate(date: Date, unit: 'second' | 'minute' | 'hour' | 'day') {
  switch (unit) {
    case 'second':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    case 'minute':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    case 'hour':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    case 'day':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

export const description = "An interactive area chart"

function aggregatePacketsByTime(packets: Packet[]) {
  if (!packets.length) return [];

  const times = packets.map(p => parseISO(p.time));
  const minTime = new Date(Math.min(...times.map(t => t.getTime())));
  const maxTime = new Date(Math.max(...times.map(t => t.getTime())));
  const durationSeconds = (maxTime.getTime() - minTime.getTime()) / 1000;

  // Decide unit based on duration:
  let unit: 'second' | 'minute' | 'hour' | 'day';
  if (durationSeconds <= 120) unit = 'second'; // up to 2 minutes: show seconds
  else if (durationSeconds <= 7200) unit = 'minute'; // up to 2 hours: show minutes
  else if (durationSeconds <= 86400) unit = 'hour'; // up to 1 day: show hours
  else unit = 'day'; // longer: show days

  // Aggregate counts
  const countsMap = new Map<string, number>();

  for (const packet of packets) {
    const date = parseISO(packet.time);
    const flooredDate = floorDate(date, unit);
    const key = flooredDate.toISOString();

    countsMap.set(key, (countsMap.get(key) || 0) + 1);
  }

  // Convert to sorted array with formatted labels for the x-axis
  const sortedEntries = Array.from(countsMap.entries()).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

  const formatMap = {
    second: 'HH:mm:ss',
    minute: 'HH:mm',
    hour: 'MMM d HH:00',
    day: 'MMM d',
  };

  return sortedEntries.map(([timeISO, count]) => ({
    time: format(parseISO(timeISO), formatMap[unit]),
    count,
  }));
}
  
export const ChartAreaInteractive: React.FC<PacketFrequencyChartProps> = ({packets}) => {
    const data = getTimeFrequencyData(packets);

    const LastPointDot = ({ cx, cy, index, dataLength }: any) => {
      if (index !== dataLength - 1) return null
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#4f46e5"
          stroke="#ffffff"
          strokeWidth={2}
        />
      )
    }

    const HoverDot = (props: any) => {
      const { cx, cy } = props
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#4f46e5"
          stroke="#ffffff"
          strokeWidth={2}
        />
      )
    }

    const [hovered, setHovered] = useState(false)

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart 
                data={data}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                >
                    <defs>
                        <linearGradient id="fillPackets" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                            {/* <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} /> */}
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(timeStr) => new Date(timeStr).toLocaleString()} />
                    {/* <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} /> */}
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4f46e5"
                        fill="url(#fillPackets)"
                        strokeWidth={2}
                        dot={
                          !hovered
                            ? ({ cx, cy, index }: any) => (
                                <LastPointDot
                                  key={`last-dot-${index}`} 
                                  cx={cx}
                                  cy={cy}
                                  index={index}
                                  dataLength={data.length}
                                />
                              )
                            : false
                        }
                        activeDot={hovered ? <HoverDot /> : false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}


