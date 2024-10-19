import React, { useState, useEffect } from 'react';

const SettlementPage = () => {
    const [listingID, setListingID] = useState(JSON.parse(localStorage.getItem("paymentPageData")).listingID); // Default listingID is 1, you can make it dynamic if needed
    const [data, setData] = useState(null); // To store the fetched data
    const [error, setError] = useState(null); // To store any error message
    const [loading, setLoading] = useState(false); // To manage loading state

    const handleSettlementRequest = async () => {
        setLoading(true); // Show loading spinner
        setError(null); // Reset any previous error message

        try {
            const response = await fetch("http://127.0.0.1:5000/payment/settlement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Indicate we're sending JSON
                },
                body: JSON.stringify({ "listingID": JSON.parse(localStorage.getItem("paymentPageData")).listingID }), // Convert the listingID to JSON string
            });

            if (!response.ok) {
                throw new Error('Failed to fetch settlement data');
            }

            const result = await response.json(); // Parse the response JSON
            setData(result); // Store the fetched data

        } catch (error) {
            setError(error.message); // Set the error message
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    // Fetch settlement data when the page loads
    useEffect(() => {
        handleSettlementRequest();
    }, []); // Empty dependency array means it runs once when the component mounts

    return (
        <div>
            <h1>Settlement Data for Listing #{listingID}</h1>

            {loading && <p>Loading...</p>} {/* Show loading message */}

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if any */}

            {data && (
                <div>
                    <h2>Settlement Information:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    {/* Alternatively, you can customize how the data is displayed below */}
                    {/* Example: */}
                    {/* <p>Amount: {data.amount}</p> */}
                    {/* <p>Description: {data.description}</p> */}
                </div>
            )}
        </div>
    );
};

export default SettlementPage;
