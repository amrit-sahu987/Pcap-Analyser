"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ProtocolPieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#9CA3AF']; // Add more if needed

const CustomTooltip = (data: any) => {
  return ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const total = data.reduce((sum: number, entry: any) => sum + entry.value, 0);
      const percent = total ? (value / total) * 100 : 0;

      return (
        <div className="bg-white p-2 rounded shadow-lg text-sm text-gray-800">
          <p>{name}</p>
          <p>{`Count: ${value}`}</p>
          <p>{`Percentage: ${percent.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };
};


export const description = "A pie chart with a label"

export const ProtocolPieChart: React.FC<ProtocolPieChartProps> = ({ data }) => {
  return (
    <div className="w-full h-75">
      <ResponsiveContainer>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                label={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
            >
                {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip content={CustomTooltip(data)} />
            <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                fontSize: '0.875rem',
                color: '#64748b' // Tailwind slate-500
                }}
            />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

