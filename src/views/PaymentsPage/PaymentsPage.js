import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../PaymentsPage/PaymentsPage.css";
import NodataImg from "./../../assests/no-data.png";
import BackImg from "./../../assests/back (2).png";
import HomeImg from "./../../assests/home-button.png"

const serverURL = "https://split-eazy.onrender.com";

const App = () => {
    const [data, setData] = useState(null); // Store JSON data
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        const listDetails = JSON.parse(localStorage.getItem("paymentPageData"));

        const fetchData = async () => {
            try {
                const response = await fetch(`${serverURL}/payment/getAllRecords`, {
                    method: "POST", // POST request to send data
                    headers: {
                        "Content-Type": "application/json", // Indicate that the request body is JSON
                    },
                    body: JSON.stringify({ "listingID": listDetails.listingID }), // Convert the JavaScript object/array to JSON string
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const jsonData = await response.json();
                setData(jsonData); // Set the fetched data
                setLoading(false); // Stop the loading state

            } catch (error) {
                setError(error.message); // Handle errors and set error state
                setLoading(false); // Stop loading even if there is an error
            }
        };

        fetchData();
    }, []); // Runs only on mount

    const navigate = useNavigate();
    // Conditional Rendering
    if (loading) return <div class="loader"></div>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data || !data.payments || data.payments.length === 0) return (
        <div>
            <div className='payment-heading-container'>
                <h1>{JSON.parse(localStorage.getItem("paymentPageData")).name}</h1>
                <div className='payment-heading-names'>
                    {JSON.parse(localStorage.getItem("paymentPageData")).participants.map((participant, index) => (
                        <span key={index} className="participant-badge"> {participant}</span>
                    ))}
                </div>
            </div>
            <hr />
            <h2 className='no-record-txt'>No Payment Records.</h2>
            <img className='nodata-img' src={NodataImg}></img>
            <div className="buttons-container">
                <button onClick={() => navigate("/settlement-page")} className="settle-btn">Settlement</button>
                <button onClick={() => navigate("/add-payment")} className="add-btn">Add Payment</button>
            </div>

            <img onClick={() => navigate("/")} className='home-btn-im' src={HomeImg}></img>
            <img onClick={() => navigate("/list-page")} className='back-img' src={BackImg}></img>
        </div>
    );

    return <ListPage data={data} setData={setData} setError={setError} setLoading={setLoading} />; // Pass setError to ListPage
}

const DeletePayment = async (paymentID, navigate, setData, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await fetch(`${serverURL}/payment/deleteRecord/${paymentID}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete payment");

        // Update state
        setData(prevData => ({
            ...prevData,
            payments: prevData.payments.filter(payment => payment.paymentID !== paymentID)
        }));

    } catch (error) {
        console.error(error.message);
        setError(error.message);
    }
    setLoading(false);
};


const ListPage = ({ data, setData, setError, setLoading }) => { // Accept setError here
    const navigate = useNavigate(); // Declare useNavigate in this component

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

            <hr className='hr1' />
            <div className="payment-card-container">
                {data.payments.map(payment => (
                    <div key={payment.paymentID} className="payment-card">
                        <h2 className='pay-amount'> {'\u20b9'} {payment.amount}</h2>
                        <p>{payment.description}</p>
                        <hr />
                        <p><strong>Paid By:</strong> {payment.paidBy}</p>
                        <p><strong>Paid For:</strong> {payment.paidFor.join(', ')}</p>
                        <p className='payment-date'> {payment.dateOfPayment}</p>
                        <button
                            onClick={() => DeletePayment(payment._id, navigate, setData, setError, setLoading)}
                            className="del-btn"
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>
            <div className="buttons-container">
                <button onClick={() => navigate("/settlement-page")} className="settle-btn">Settlement</button>
                <button onClick={() => navigate("/add-payment")} className="add-btn">Add Payment</button>
            </div>

            <img onClick={() => navigate("/list-page")} className='back-img-1' src={BackImg}></img>
            <img onClick={() => navigate("/")} className='home-btn-img' src={HomeImg}></img>

        </div >
    );
};


export default App;

