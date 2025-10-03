import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../AddPayment/AddPayment.css';
import Navbar from "./../../components/navbar/Navbar";
import PaymentImg from "./../../assests/add-payment-img.png";

const serverURL = "https://split-eazy.onrender.com";

function PaymentForm() {
    const [participants, setParticipants] = useState(JSON.parse(localStorage.getItem("paymentPageData")).participants); // Example participants
    const [paidBy, setPaidBy] = useState("");
    const [paidFor, setPaidFor] = useState([]);
    const [amount, setAmount] = useState("");
    const [paymentDescription, setPaymentDescription] = useState("");
    const [error, setError] = useState(null); // State for errors

    // Handle change for Paid By dropdown
    const handlePaidByChange = (e) => {
        setPaidBy(e.target.value);
    };

    // Handle change for Paid For checkboxes
    const handlePaidForChange = (e) => {
        const value = e.target.value;

        // If the participant is already selected, remove them; if not, add them
        setPaidFor((prev) =>
            prev.includes(value)
                ? prev.filter((participant) => participant !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e, navigate) => {
        e.preventDefault();

        // Check if at least one checkbox is selected
        if (paidFor.length === 0) {
            alert("Please select at least one participant for 'Paid For'.");
            return;
        }

        const payload = {
            "listingID": JSON.parse(localStorage.getItem("paymentPageData")).listingID,
            "amount": amount,
            "description": paymentDescription,
            "paidBy": paidBy,
            "paidFor": paidFor
        };

        try {
            const response = await fetch(`${serverURL}/payment/addRecord`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Sending JSON data
                },
                body: JSON.stringify(payload) // Convert payload to JSON string
            });

            if (!response.ok) {
                throw new Error('Failed to submit payment record');
            }

            // Optionally, clear the form after submission
            setAmount("");
            setPaymentDescription("");
            setPaidBy("");
            setPaidFor([]);

            navigate("/payments-page");

        } catch (error) {
            setError(error.message);
            console.error('Error submitting payment:', error);
        }


    };

    const navigate = useNavigate(); // Declare useNavigate in this component
    return (
        <div>
            <Navbar />
            <div className='add-payment-container'>
                <form onSubmit={(e) => { handleSubmit(e, navigate); }}>
                    <label>Amount ({'\u20b9'})</label>
                    <input
                        type='number'
                        name='amount'
                        placeholder='0'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <label>Payment Description</label>
                    <input
                        type='text'
                        name='paymentDescription'
                        placeholder='Description about the payment.'
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        required
                    />

                    <label>Paid By</label>
                    <select
                        name="paidBy"
                        value={paidBy}
                        onChange={handlePaidByChange}
                        placeholder="Select who paid"
                        required
                    >
                        <option value="" disabled>
                            -- Select who paid --
                        </option>
                        {participants.map((participant, index) => (
                            <option key={index} value={participant}>
                                {participant}
                            </option>
                        ))}
                    </select>

                    <label>Paid For</label>
                    <div>
                        {participants.map((participant, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    id={`paidFor-${index}`}
                                    value={participant}
                                    checked={paidFor.includes(participant)}
                                    onChange={handlePaidForChange}
                                />
                                <label htmlFor={`paidFor-${index}`}>{participant}</label>
                            </div>
                        ))}
                    </div>

                    <button className='add-pay-submit-btn' type="">Submit</button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
                <img className="payment-img" src={PaymentImg}></img>
            </div>
        </div>
    );
}

export default PaymentForm;
