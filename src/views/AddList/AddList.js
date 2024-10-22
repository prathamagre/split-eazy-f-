
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddList from "./../AddList/AddList.css";

function Add() {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [participants, setParticipants] = useState([""]); // Initialize with one participant input

    const navigate = useNavigate(); // To navigate programmatically

    const addList = async (e) => {
        e.preventDefault(); // Prevent form default submission behavior

        try {
            const response = await fetch("http://127.0.0.1:5000/listing/createListing", {
                method: "POST", // POST request to send data
                headers: {
                    "Content-Type": "application/json", // Indicate that the request body is JSON
                },
                body: JSON.stringify({
                    "name": category,
                    "description": description,
                    "participants": participants.filter(p => p) // Filter out empty participant inputs
                }),
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
        setParticipants([""]); // Reset participants

        // Navigate to the list page after submission
        navigate("/list-page");
    };

    const handleParticipantChange = (index, event) => {
        const newParticipants = [...participants];
        newParticipants[index] = event.target.value; // Update the value at the specific index
        setParticipants(newParticipants);
    };

    const handleAddParticipant = () => {
        setParticipants([...participants, ""]); // Add an empty string for a new input field
    };

    const handleRemoveParticipant = (index) => {
        const newParticipants = [...participants];
        newParticipants.splice(index, 1); // Remove the participant at the specified index
        setParticipants(newParticipants);
    };

    return (
        <div>
            <div>AddList</div>
            <div className='add-list-container'>
                
                <form className='list-form' onSubmit={addList}>
                    <label>Title </label>
                    <input
                        type='text'
                        name='category'
                        placeholder='Summer Trip 2024'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />

                    <label>Description </label>
                    <input
                        type='text'
                        name='description'
                        placeholder='A short description (optional)'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Participants </label>
                    {participants.map((participant, index) => (
                        <div key={index} className="participant-input">
                            <input
                                type="text"
                                placeholder={`Participant ${index + 1}`}
                                value={participant}
                                onChange={(e) => handleParticipantChange(index, e)}
                                required
                            />
                            <button type="button"
                                onClick={() => handleRemoveParticipant(index)}
                                className='remove-btn'>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddParticipant}
                        className='add-participant-btn'>
                        Add Participant
                    </button>
                    <br></br>

                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>
            </div>
        </div>    
            );
}

            export default Add;
