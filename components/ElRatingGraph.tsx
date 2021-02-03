import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {format} from "date-fns";
import React from "react";

export default function ElRatingGraph({chartData}: {chartData: {rating: number, date: number}[]}) {
    return (
        <>
            <style dangerouslySetInnerHTML={
                {__html: `
.recharts-xAxis .recharts-text.recharts-cartesian-axis-tick-value {
    transform: translateY(1rem);
}

.recharts-yAxis .recharts-text.recharts-cartesian-axis-tick-value {
    transform: translateX(-0.5rem);
}
                `}
            }/>
            <ResponsiveContainer width="100%" height={400} className="my-8">
                <LineChart data={chartData}>
                    <XAxis
                        dataKey="date"
                        domain={["auto", "auto"]}
                        name="Date"
                        tickFormatter={(unixTime) => format(new Date(unixTime), "M/d/yyyy")}
                        type="number"
                        style={{opacity: 0.5}}
                    />
                    <YAxis
                        dataKey="rating"
                        name="Rating"
                        tickFormatter={rating => Math.round(+rating).toString()}
                        domain={[chartData ? Math.min(...chartData.map(d => d.rating)) - 50 : 0, chartData ? Math.max(...chartData.map(d => d.rating)) + 50 : 2000]}
                        style={{opacity: 0.5}}
                    />
                    <Line type="monotone" dataKey="rating" stroke="#222" activeDot={{ r: 8 }} isAnimationActive={false}/>
                    <Tooltip content={({active, payload, label}) => (
                        (active && payload && label) ? (
                            <>
                                <p>Date: {format(new Date(+label), "M/d/yyyy 'at' h:mm a")}</p>
                                <p>Rating: {Math.round(+payload[0].value)}</p>
                            </>
                        ) : null
                    )}/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}