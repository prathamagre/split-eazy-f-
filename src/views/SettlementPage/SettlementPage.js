import React, { useState, useEffect } from 'react';
import "./../SettlementPage/SettlementPage.css"
import { useNavigate } from 'react-router-dom';
import BackImg from "./../../assests/back (2).png";
import HomeImg from "./../../assests/home-button.png"

const serverURL = "https://grassx03.pythonanywhere.com";

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
                const response = await fetch(`${serverURL}/payment/settlement`, {
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

    const navigate = useNavigate();

    // Conditional Rendering
    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2 style={{ color: 'red' }}>Error: {error}</h2>; // Display error message
    if (!data) return <h2>No Settlement Data Found</h2>; // Fallback message if no data is found

    return (
        <div>
            <div className='payment-heading-container'>
                <h1>{JSON.parse(localStorage.getItem("paymentPageData")).name}</h1>
                <div className='payment-heading-names'>
                    {JSON.parse(localStorage.getItem("paymentPageData")).participants.map((participant, index) => (
                        <span key={index} className="participant-badge"> {participant}</span>
                    ))}
                </div>
            </div>
            <hr/>
            <h3 className='settle-txt'>Settlement Information</h3>
            <div className='settlement-container'>
                {data.settlement.map((s) => (
                    <div className='card'>
                        <p>{s[0]} pays {s[1]} {'\u20b9'}{Math.floor(s[2])}.</p>
                    </div>
                ))}
            </div>
            <img onClick={() => navigate("/")} className='home-btn-im' src={HomeImg}></img>           
            <img onClick={() => navigate("/list-page")} className='back-img' src={BackImg}></img>
        </div>
    );
};

export default SettlementPage;
