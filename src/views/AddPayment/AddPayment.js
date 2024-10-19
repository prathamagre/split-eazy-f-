// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // function Add() {
// //     const [category, setCategory] = useState("");
// //     const [description, setDescription] = useState("");
// //     const [participant1, setParticpant1] = useState("");
// //     const [participant2, setParticpant2] = useState("");
// //     const [paidBy, setPaidBy] = useState("");

// //     const navigate = useNavigate(); // To navigate programmatically

// //     const AddPayment = async (e) => {
// //         e.preventDefault(); // Prevent form default submission behavior

// //         try{
// //             const response = await fetch("http://127.0.0.1:5000/listing/createListing", {
// //                     method: "POST", // POST request to send data
// //                     headers: {
// //                         "Content-Type": "application/json", // Indicate that the request body is JSON
// //                     },
// //                     body: JSON.stringify({"name":category, "description":description, "participants":[participant1, participant2]}), // Convert the JavaScript object/array to JSON string
// //                 });

// //                 if (!response.ok) {
// //                     throw new Error('Failed to add listing');
// //                 }
// //         } catch (error) {
// //             console.error("Error:", error.message);
// //         }

// //         // Clear form inputs
// //         setCategory("");
// //         setDescription("");
// //         setParticpant1("");
// //         setParticpant2("");
// //         setPaidBy("");

// //         // Navigate to the list page after submission
// //         navigate("/payments-page");
// //     };

// //     return (
// //         <div>
// //             <div>Add Payment</div>
// //             <form className='payment-form' onSubmit={AddPayment}>
// //                 <label>Amount: </label>
// //                 <input 
// //                     type='number' 
// //                     name='amount' 
// //                     placeholder='0' 
// //                     value={category} 
// //                     onChange={(e) => setCategory(e.target.value)}
// //                 />

// //                 <label>Description: </label>
// //                 <input 
// //                     type='text' 
// //                     name='description' 
// //                     placeholder='Description about category' 
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)} 
// //                 />

// //                 <label>Paid By: </label>

// //                 <select name = 'paidBy' placeholder="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
// //                     <option value="" disabled >
// //                         Paid By
// //                     </option>
// //                     {JSON.parse(localStorage.getItem("paymentPageData")).participants.map((option)=>(
// //                         <option value={option}>
// //                             {option}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <label>Paid For 1: </label>
// //                 <input 
// //                     type="text" 
// //                     name="participant-1" 
// //                     value={participant1}
// //                     onChange={(e) => setParticpant1(e.target.value)} 
// //                 />

// //                 <label>Paid For 2: </label>
// //                 <input 
// //                     type="text" 
// //                     name="participant-2" 
// //                     value={participant2}
// //                     onChange={(e) => setParticpant2(e.target.value)} 
// //                 />

// //                 <button type="submit" className="submit-btn">
// //                     Submit
// //                 </button>
// //             </form>
// //         </div>
// //     );
// // }

// // export default Add;


// import React, { useState } from 'react';

// function PaymentForm() {
//     const [participants, setParticipants] = useState(["Alice", "Bob", "Charlie", "David"]); // Example participants
//     const [paidBy, setPaidBy] = useState("");
//     const [paidFor, setPaidFor] = useState([]);
//     const [amount, setAmount] = useState("");
//     const [paymentDescription, setPaymentDescription] = useState("");

//     // Handle change for Paid By dropdown
//     const handlePaidByChange = (e) => {
//         setPaidBy(e.target.value);
//     };

//     // Handle change for Paid For checkboxes
//     const handlePaidForChange = (e) => {
//         const value = e.target.value;

//         // If the participant is already selected, remove them; if not, add them
//         setPaidFor((prev) =>
//             prev.includes(value)
//                 ? prev.filter((participant) => participant !== value)
//                 : [...prev, value]
//         );
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Paid By:", paidBy);
//         console.log("Paid For:", paidFor);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>Amount: Rs.</label>
//                  <input
//                 type='number'
//                 name='amount'
//                 placeholder='0'
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//             />

//             <label>Payment Description: </label>
//             <input
//                 type='text'
//                 name='paymentDescription'
//                 placeholder='Description about the payment.'
//                 value={paymentDescription}
//                 onChange={(e) => setPaymentDescription(e.target.value)}
//             />
//             <label>Paid By: </label>
//             <select
//                 name="paidBy"
//                 value={paidBy}
//                 onChange={handlePaidByChange}
//                 placeholder="Select who paid"
//             >
//                 <option value="" disabled>
//                     -- Select who paid --
//                 </option>
//                 {participants.map((participant, index) => (
//                     <option key={index} value={participant}>
//                         {participant}
//                     </option>
//                 ))}
//             </select>

//             <label>Paid For: </label>
//             <div>
//                 {participants.map((participant, index) => (
//                     <div key={index}>
//                         <input
//                             type="checkbox"
//                             id={`paidFor-${index}`}
//                             value={participant}
//                             checked={paidFor.includes(participant)}
//                             onChange={handlePaidForChange}
//                         />
//                         <label htmlFor={`paidFor-${index}`}>{participant}</label>
//                     </div>
//                 ))}
//             </div>

//             <button type="submit">Submit</button>
//         </form>
//     );
// }

// export default PaymentForm;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            "listingID":JSON.parse(localStorage.getItem("paymentPageData")).listingID,
            "amount": amount,
            "description": paymentDescription,
            "paidBy": paidBy,
            "paidFor": paidFor
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/payment/addRecord", {
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
        <form onSubmit={(e)=>{handleSubmit(e,navigate);}}>
            <label>Amount: Rs.</label>
            <input
                type='number'
                name='amount'
                placeholder='0'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />

            <label>Payment Description: </label>
            <input
                type='text'
                name='paymentDescription'
                placeholder='Description about the payment.'
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                required
            />

            <label>Paid By: </label>
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

            <label>Paid For: </label>
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

            <button type="submit">Submit</button>

            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    );
}

export default PaymentForm;
