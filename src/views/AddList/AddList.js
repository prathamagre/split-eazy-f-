// import React from 'react'
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// function Add() {
//     const [category, setCategory] = useState("");
//     const [description, setDescription] = useState("");
//     const [participant1, setParticpant1] = useState("");
//     const [participant2, setParticpant2] = useState("");

//     const addList = () => {
//         const listData = JSON.parse(localStorage.getItem("listData")) || [];

//         const listDataObject = {
//             category,
//             description,
//             participant1,
//             participant2,
//         };

//         listData.push(listDataObject);

//         localStorage.setItem("listData", JSON.stringify(listData));

//         category("");
//         description("");
//         participant1("");
//         participant2("");

//         navigate("/list-page");
//     };
//     return (
//         <div>
//             <div>AddList</div>
//             <form className='list-form'>
//                 <label>Category: </label>
//                 <input type='text' name='category' placeholder='Ex-Travel, food' value={category} onChange={(e) => {
//                     setCategory(e.target.value);
//                 }}></input>
//                 <label>Description: </label>
//                 <input type='text' name='decription' placeholder='Description about category' value={description}
//                     onChange={(e) => {
//                         setDescription(e.target.value);
//                     }}></input>
//                 <label>participant-1: </label>
//                 <input type="text" name="participant-1" value={participant1}
//                     onChange={(e) => {
//                         setParticpant1(e.target.value);
//                     }}></input>
//                 <label>participant-2: </label>
//                 <input type="text" name="participant-2" value={participant2}
//                     onChange={(e) => {
//                         setParticpant2(e.target.value);
//                     }}></input>

//                 <button
//                     type="submit"
//                     onClick={addList}
//                     className="submit-btn">
//                     <Link to="/list-page"></Link>
//                     Submit

//                 </button>
//             </form>
//         </div>
//     )
// }

// export default Add;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Add() {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [participant1, setParticpant1] = useState("");
    const [participant2, setParticpant2] = useState("");
    
    const navigate = useNavigate(); // To navigate programmatically

    const addList = async (e) => {
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

        // Navigate to the list page after submission
        navigate("/list-page");
    };

    return (
        <div>
            <div>AddList</div>
            <form className='list-form' onSubmit={addList}>
                <label>Category: </label>
                <input 
                    type='text' 
                    name='category' 
                    placeholder='Ex-Travel, food' 
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

                <label>Participant 1: </label>
                <input 
                    type="text" 
                    name="participant-1" 
                    value={participant1}
                    onChange={(e) => setParticpant1(e.target.value)} 
                />

                <label>Participant 2: </label>
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
