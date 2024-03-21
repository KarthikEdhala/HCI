import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartComponent = ({ data }) => {
    // Check if data is null or undefined
    if (!data) {
        return null; // or you can return a placeholder, error message, or loading indicator
    }


    // Convert data to an array of objects
    let dat = Object.entries(data).map(([year, reviews]) => ({ year: parseInt(year), reviews }));

    // Display only the first 10 entries if the array size is larger than 10
    if (dat.length > 15) {
        dat = dat.slice(0, 10);
    }
    return (
        <ResponsiveContainer width="80%" height={250}>
            <BarChart
                data={dat}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reviews" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChartComponent;
