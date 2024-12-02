import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../ListPage/ListPage.css";
import Navbar from "./../../components/navbar/Navbar";
import ListingImg from "./../../assests/listing.png"

const serverURL = "https://grassx03.pythonanywhere.com";

const App = () => {
    const [data, setData] = useState(null); // Store JSON data
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverURL}/listing/getAllListings`);

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

    const navigate = useNavigate(); // Declare useNavigate in this component
    // Conditional Rendering
    if (loading) return <div class="loader"></div>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data || !data.listings || data.listings.length === 0) return (
        <div>
            <h2>No Listing Exists.</h2>
            <button
                onClick={() => navigate("/add-list")}
                className="add-btn">Add Listing</button>
        </div>
    );

    return <ListPage data={data} />;
}

const NavigatePayment = (listingID, description, category, participants, navigate) => {
    localStorage.setItem("paymentPageData",
        JSON.stringify({
            "listingID": listingID,
            "description": description,
            "name": category,
            "participants": participants,
        })
    );

    navigate("/payments-page"); // Trigger navigation after storing the data
}

const DeleteListing = async (listingID, navigate, setData) => {
    try {
        const response = await fetch(`${serverURL}/listing/deleteListing`, {
            method: "POST", // POST request to send data
            headers: {
                "Content-Type": "application/json", // Indicate that the request body is JSON
            },
            body: JSON.stringify({ "listingID": listingID }), // Convert the JavaScript object/array to JSON string
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        setData((prevData) => ({
            ...prevData,
            listings: prevData.listings.filter((listing) => listing.listingID !== listingID),
        }));

        navigate("/list-page"); // Trigger navigation after the deletion
        // Refresh the page after successful deletion
        // window.location.reload();

    } catch (error) {
        console.error(error.message); // Log the error to the console for debugging
    }
}

const ListPage = ({ data }) => {
    const navigate = useNavigate(); // Declare useNavigate
    const [localData, setLocalData] = useState(data); // Local state to handle updates

    return (
        <div>
            <Navbar />
            <h2 className='page-heading'>Listings (Groups of Payments)</h2>
            <div className='list-page-container'>
                <img className="listing-img" src={ListingImg} alt="Listing illustration"></img>
                <div className="card-container">
                    {localData.listings.map((listing) => (
                        <div key={listing.listingID} className="card">
                            <h2>{listing.name}</h2>
                            <p>{listing.description}</p>
                            <p><strong>Participants:</strong> {listing.participants.join(', ')}</p>
                            <div className='date'>{listing.dateOfCreation}</div>
                            <button
                                className='add-participant-btn'
                                onClick={() => NavigatePayment(listing.listingID, listing.description, listing.name, listing.participants, navigate)}
                            >
                                Open
                            </button>
                            <button
                                onClick={() => DeleteListing(listing.listingID, navigate, setLocalData)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => navigate("/add-list")}
                className="add-list-btn"
            >
                Add Listing
            </button>
        </div>
    );
};


export default App;
