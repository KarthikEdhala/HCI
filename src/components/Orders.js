import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function Orders() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Amazon_Appliances_Reviews.csv');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const csvText = await response.text();
                const parsedData = Papa.parse(csvText, { header: true }).data;
                setData(parsedData.slice(0, 10)); // Limit to first 10 rows
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Orders</h2>
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={styles.header}>Reviewer ID</th>
                            <th style={styles.header}>ASIN</th>
                            <th style={styles.header}>Reviewer Name</th>
                            <th style={styles.header}>Helpful</th>
                            <th style={styles.header}>Review Text</th>
                            <th style={styles.header}>Overall</th>
                            <th style={styles.header}>Summary</th>
                            <th style={styles.header}>Unixreviewtime</th>
                            <th style={styles.header}>Reviewtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td style={styles.cell}>{row.reviewerID}</td>
                                <td style={styles.cell}>{row.asin}</td>
                                <td style={styles.cell}>{row.reviewerName}</td>
                                <td style={styles.cell}>{row.helpful}</td>
                                <td style={styles.cell}>{row.reviewText}</td>
                                <td style={styles.cell}>{row.overall}</td>
                                <td style={styles.cell}>{row.summary}</td>
                                <td style={styles.cell}>{row.unixReviewTime}</td>
                                <td style={styles.cell}>{row.reviewTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    header: {
        padding: '8px',
        border: '1px solid #ddd',
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
    },
    cell: {
        padding: '8px',
        border: '1px solid #ddd',
    },
};

export default Orders;
