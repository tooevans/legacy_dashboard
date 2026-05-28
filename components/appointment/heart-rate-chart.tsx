"use client"

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface DataProps {
    average: string
    data: {
        label: string
        value1: string
        value2: string
    }[]
}

export function HeartRateChart({ average, data } : DataProps) {

    const lastData = data[data.length - 1]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pulse Rate</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <p className='text-lg xl:text-xl font-semibold'>
                            {lastData?.value1 || 0} / {lastData?.value2 || 0} bpm
                        </p>
                        <p className='text-sm text-muted-foreground'>Recent Readings</p>
                    </div>

                    <div>
                        <p className='text-lg xl:text-xl font-semibold'>{average}</p>
                        <p className='text-sm text-muted-foreground'>Average Rate</p>
                    </div>

                    <Button variant={"outline"} size={"sm"}>
                        See Insight
                    </Button>
                </div>

                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={data}>
                        <CartesianGrid 
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#ddd"
                        />
                        <XAxis dataKey='label' axisLine={false} tickLine={false} tick={{ fill: "#9ca3af"}} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                        <Tooltip contentStyle={{ borderRadius: '10px', borderColor: "#fff" }} />
                        <Line 
                            type='monotone'
                            dataKey='value1'
                            stroke='#8884d8'
                            activeDot={{ r: 8 }}
                        />
                        <Line 
                            type='monotone'
                            dataKey='value2'
                            stroke='#82ca9d'
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}