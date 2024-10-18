import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Add() {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [participant1, setParticpant1] = useState("");
    const [participant2, setParticpant2] = useState("");
    const [paidBy, setPaidBy] = useState("");
    
    const navigate = useNavigate(); // To navigate programmatically

    const AddPayment = async (e) => {
        e.preventDefault(); // Prevent form default submission behavior

        try{
            const response = await fetch("http://127.0.0.1:5000/listing/createListing", {
                    method: "POST", // POST request to send data
                    headers: {
                        "Content-Type": "application/json", // Indicate that the request body is JSON
                    },
                    body: JSON.stringify({"name":category, "description":description, "participants":[participant1, participant2]}), // Convert the JavaScript object/array to JSON string
                });

                if (!response.ok) {
                    throw new Error('Failed to add listing');
                }
        } catch (error) {
            console.error("Error:", error.message);
        }

        // Clear form inputs
        setCategory("");
        setDescription("");
        setParticpant1("");
        setParticpant2("");
        setPaidBy("");

        // Navigate to the list page after submission
        navigate("/payments-page");
    };

    return (
        <div>
            <div>Add Payment</div>
            <form className='payment-form' onSubmit={AddPayment}>
                <label>Amount: </label>
                <input 
                    type='number' 
                    name='amount' 
                    placeholder='0' 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                />

                <label>Description: </label>
                <input 
                    type='text' 
                    name='description' 
                    placeholder='Description about category' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                />

                <label>Paid By: </label>
            
                <select name = 'paidBy' placeholder="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                    <option value="" disabled >
                        Paid By
                    </option>
                    {JSON.parse(localStorage.getItem("paymentPageData")).participants.map((option)=>(
                        <option value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <label>Paid For 1: </label>
                <input 
                    type="text" 
                    name="participant-1" 
                    value={participant1}
                    onChange={(e) => setParticpant1(e.target.value)} 
                />

                <label>Paid For 2: </label>
                <input 
                    type="text" 
                    name="participant-2" 
                    value={participant2}
                    onChange={(e) => setParticpant2(e.target.value)} 
                />

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Add;
