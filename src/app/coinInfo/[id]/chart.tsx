import React, { ReactElement } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { coinPrice } from './types'

interface IChartProps {
    graphData: coinPrice[]
    width: number
    height: number
}

const Chart= ({ graphData, width, height }: IChartProps):ReactElement => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={graphData}
                margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="Date"
                    label={{
                        value: 'Date',
                        position: 'insideBottomRight',
                        offset: 0,
                    }}
                />
                <YAxis
                    label={{
                        value: 'Prise(USD)',
                        position: 'insideLeft',
                        angle: -90,
                        offset: 0,
                    }}
                />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="Price"
                    stroke="#8884d8"
                    fill="#8884d8"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default Chart
