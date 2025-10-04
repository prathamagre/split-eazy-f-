import React, { useState, useEffect } from 'react';
import "./../SettlementPage/SettlementPage.css";
import { useNavigate } from 'react-router-dom';
import BackImg from "./../../assests/back (2).png";
import HomeImg from "./../../assests/home-button.png";

const serverURL = "https://split-eazy.onrender.com";

const SettlementPage = () => {
    const [data, setData] = useState(null); // Store API response
    const [loading, setLoading] = useState(true); // Track loading
    const [error, setError] = useState(null); // Track errors

    const navigate = useNavigate();

    // Parse localStorage once
    const paymentPageData = JSON.parse(localStorage.getItem("paymentPageData") || "{}");

    useEffect(() => {
        if (!paymentPageData.listingID) {
            setError("No listing ID found in local storage.");
            setLoading(false);
            return;
        }

        const fetchSettlementData = async () => {
            try {
                const response = await fetch(`${serverURL}/payment/settlement`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ listingID: paymentPageData.listingID }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch settlement data");
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlementData();
    }, [paymentPageData.listingID]);

    // Loading & error states
    if (loading) return <div className="loader"></div>;
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;
    if (!data?.settlement || data.settlement.length === 0)
        return <h2>No Settlement Data Found</h2>;

    return (
        <div>
            <div className="payment-heading-container">
                <h1>{paymentPageData.name || "Listing"}</h1>
                <div className="payment-heading-names">
                    {paymentPageData.participants?.map((participant, index) => (
                        <span key={index} className="participant-badge">
                            {participant}
                        </span>
                    ))}
                </div>
            </div>
            <hr />
            <h3 className="settle-txt">Settlement Information</h3>
            <div className="settlement-container">
                {data.settlement.map((s, index) => (
                    <div key={index} className="card c">
                        <p>
                            {s[0]} pays {s[1]} {'\u20b9'}
                            {Math.floor(s[2])}.
                        </p>
                    </div>
                ))}
            </div>
            <img
                onClick={() => navigate("/")}
                className="home-btn-im"
                src={HomeImg}
                alt="Home"
            />
            <img
                onClick={() => navigate("/payments-page")}
                className="back-img bck"
                src={BackImg}
                alt="Back"
            />
        </div>
    );
};

export default SettlementPage;
