import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../ListPage/ListPage.css";
import Navbar from "./../../components/navbar/Navbar";
import ListingImg from "./../../assests/listing.png";

const serverURL = "https://split-eazy.onrender.com";

const App = () => {
    const [data, setData] = useState([]); // Store JSON array directly
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverURL}/listing/`);
                if (!response.ok) throw new Error("Failed to fetch data");

                const jsonData = await response.json();
                setData(jsonData.data || []); // Set the array of listings
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Conditional rendering
    if (loading) return <div className="loader"></div>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data || data.length === 0)
        return (
            <div>
                <h2>No Listing Exists.</h2>
                <button onClick={() => navigate("/add-list")} className="add-btn">
                    Add Listing
                </button>
            </div>
        );

    return <ListPage data={data} setData={setData} />;
};

// Navigate to payment page and store data in localStorage
const NavigatePayment = (listingID, description, name, participants, navigate) => {
    localStorage.setItem(
        "paymentPageData",
        JSON.stringify({ listingID, description, name, participants })
    );
    navigate("/payments-page");
};

// Delete a listing
const DeleteListing = async (listingID, setData) => {
    try {
        const response = await fetch(`${serverURL}/listing/delete/:id`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to delete listing");

        setData((prevData) => prevData.filter((listing) => listing._id !== listingID));
    } catch (err) {
        console.error(err.message);
    }
};

const ListPage = ({ data, setData }) => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <h2 className="page-heading">Listings (Groups of Payments)</h2>
            <div className="list-page-container">
                <img className="listing-img" src={ListingImg} alt="Listing illustration" />
                <div className="card-container">
                    {data.map((listing) => (
                        <div key={listing._id} className="card">
                            <h2>{listing.name}</h2>
                            <p>{listing.description}</p>
                            <p>
                                <strong>Participants:</strong> {listing.participants.join(", ")}
                            </p>
                            <div className="date">{new Date(listing.dateOfCreation).toLocaleString()}</div>
                            <button
                                className="add-participant-btn"
                                onClick={() =>
                                    NavigatePayment(
                                        listing._id,
                                        listing.description,
                                        listing.name,
                                        listing.participants,
                                        navigate
                                    )
                                }
                            >
                                Open
                            </button>
                            <button
                                onClick={() => DeleteListing}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => navigate("/add-list")} className="add-list-btn">
                Add Listing
            </button>
        </div>
    );
};

export default App;
