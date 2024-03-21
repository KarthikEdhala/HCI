import React, { useState, useEffect } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Papa from 'papaparse';
import { DataArrayRounded } from '@mui/icons-material';
import subcountData from './subcount.json';

function MainListItems({ handleChartDataUpdate }) {
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Amazon_Appliances_Reviews.csv');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const csvText = await response.text();
                const parsedData = Papa.parse(csvText, { header: true, dynamicTyping: true, skipEmptyLines: true, delimiter: ',', quoteChar: '"' }).data;
                setData(parsedData); // Limit to first 10 rows
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Amazon_Appliances_Metadata.csv');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const csvText = await response.text();
                const parsedData = Papa.parse(csvText, { header: true, dynamicTyping: true, skipEmptyLines: true, delimiter: ',', quoteChar: '"' }).data;
                setData1(parsedData); // Limit to first 10 rows
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    function handleMenuItemClick(data) {
        handleChartDataUpdate(data);
    }

    return (
        <React.Fragment>
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
            </ListItemButton>
            <QuantitativeQueriesMenuItem handleMenuItemClick={handleMenuItemClick} data={data} data1={data1} />
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Exact-Search Queries" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Hybrid-Search Queries" />
            </ListItemButton>
        </React.Fragment>
    );
}

function secondaryListItems() {
    return (
        <React.Fragment>
            <ListSubheader component="div" inset>
                Saved reports
            </ListSubheader>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Current month" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Last quarter" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Year-end sale" />
            </ListItemButton>
        </React.Fragment>
    );
}

function QuantitativeQueriesMenuItem({ handleMenuItemClick, data, data1 }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleQuantitativeQueriesClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const averageText = () => {
        console.log(data);
        if (!data) {
            console.error('Data is not available yet');
            return;
        }
        const totalTextSize = data.reduce((acc, review) => {
            if (review.reviewText) {
                return acc + review.reviewText.length;
            } else {
                return acc;
            }
        }, 0);

        const averageSize = totalTextSize / data.length;
        handleMenuItemClick(averageSize);
        console.log(averageSize);
        handleClose();
    };
    const countReviewsBySubcategory = () => {
        if (!data) {
            console.error('Data is not available yet');
            return;
        }

        // Create an object to store the count of reviews for each ASIN (product identifier)
        const reviewCountsByASIN = {};

        // Iterate over each review
        data.forEach(review => {
            const asin = review.asin;

            // If the ASIN is not already in the object, initialize its count to 1
            if (!reviewCountsByASIN[asin]) {
                reviewCountsByASIN[asin] = 1;
            } else {
                // If the ASIN already exists, increment its count
                reviewCountsByASIN[asin]++;
            }
        });

        // Now reviewCountsByASIN contains the count of reviews for each ASIN
        handleMenuItemClick(reviewCountsByASIN);
        handleClose();
    };

    const handleMenuItemSelection = () => {
        // Filter data for January reviews in the specified years
        const januaryReviews = data.filter(review => {
            const date = new Date(review.reviewTime);
            return date.getMonth() === 0 && [2011, 2012, 2013, 2014].includes(date.getFullYear());
        });

        // Count the number of reviews for each January
        const reviewCounts = {};
        januaryReviews.forEach(review => {
            const year = new Date(review.reviewTime).getFullYear();
            reviewCounts[year] = (reviewCounts[year] || 0) + 1;
        });
        handleMenuItemClick(reviewCounts);
        handleClose();
    };


    const countProductsPerSubcategory = () => {
        const inputData = [
            { "subcategory": "Appliances", "count": 143685 },
            { "subcategory": "Parts & Accessories", "count": 114090 },
            { "subcategory": "Washer Parts & Accessories", "count": 5687 },
            { "subcategory": "Freezers", "count": 698 },
            { "subcategory": "Chest Freezers", "count": 382 },
            { "subcategory": "Range Parts & Accessories", "count": 12484 },
            { "subcategory": "Plug Receptacles", "count": 279 },
            { "subcategory": "Refrigerator Parts & Accessories", "count": 47159 },
            { "subcategory": "Power Cords", "count": 2596 },
            { "subcategory": "Dryer Parts & Accessories", "count": 9433 },
            { "subcategory": "Humidifier Parts & Accessories", "count": 8838 },
            { "subcategory": "Humidity Meters", "count": 2782 },
        ];

        const reviewCounts = inputData.map(item => ({
            subcategory: item.subcategory,
            count: item.count
        }));

        console.log(reviewCounts);


        handleMenuItemClick(reviewCounts);


        handleClose();
    };


    const average = () => {
        const reviewStats = {};

        // Iterate over each review in the dataset
        data.forEach(review => {
            const asin = review.asin;
            const reviewText = review.reviewText;

            // Check if reviewText is not null before calculating its size
            if (reviewText !== null) {
                const reviewSize = reviewText.length;

                if (!reviewStats[asin]) {
                    reviewStats[asin] = {
                        totalSize: reviewSize,
                        count: 1
                    };
                } else {
                    reviewStats[asin].totalSize += reviewSize;
                    reviewStats[asin].count++;
                }
            }
        });

        // Calculate average size for each ASIN
        const averageReviewSize = {};
        Object.keys(reviewStats).forEach(asin => {
            const totalSize = reviewStats[asin].totalSize;
            const count = reviewStats[asin].count;
            const average = totalSize / count;
            averageReviewSize[asin] = average;
        });

        handleMenuItemClick(averageReviewSize);
        handleClose();
    };


    return (
        <React.Fragment>
            <ListItemButton onClick={handleQuantitativeQueriesClick}>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Quantitative Queries" />
            </ListItemButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuItem onClick={() => countProductsPerSubcategory(data1)}>Count the number of products in each subcategory.</MenuItem>
                <MenuItem onClick={() => countReviewsBySubcategory(data)}>Determine the count of reviews for each product subcategory.</MenuItem>
                <MenuItem onClick={() => average(data)}>Calculate the average size of the review text/body (in characters or words).</MenuItem>
                <MenuItem onClick={() => handleMenuItemSelection(data)}>Count the reviews submitted in each January for the years 2011, 2012, 2013, and 2014</MenuItem>

            </Menu>
        </React.Fragment>
    );
}

export { MainListItems, secondaryListItems };
