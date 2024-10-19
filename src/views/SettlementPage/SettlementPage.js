import React, { useState, useEffect } from 'react';

const SettlementPage = () => {
    const [data, setData] = useState(null); // To store the fetched data
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To track any errors

    useEffect(() => {
        const listDetails = JSON.parse(localStorage.getItem("paymentPageData")); // Get data from local storage
        if (!listDetails || !listDetails.listingID) {
            setError("No listing ID found in local storage.");
            setLoading(false);
            return;
        }

        const fetchSettlementData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/payment/settlement", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Indicate we're sending JSON
                    },
                    body: JSON.stringify({"listingID": listDetails.listingID}), // Send listingID as JSON
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch settlement data');
                }

                const result = await response.json(); // Parse the JSON response
                setData(result); // Set the fetched data
            } catch (error) {
                setError(error.message); // Set error state
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        fetchSettlementData(); // Call the function to fetch data
    }, []); // Run only once when the component mounts

    // Conditional Rendering
    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2 style={{ color: 'red' }}>Error: {error}</h2>; // Display error message
    if (!data) return <h2>No Settlement Data Found</h2>; // Fallback message if no data is found

    return (
        <div>
            <h1>Settlement Information</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display fetched data */}
            {/* Optionally, you can render the data in a more user-friendly way */}
        </div>
    );
};

export default SettlementPage;
