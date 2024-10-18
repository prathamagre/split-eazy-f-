import React, { useState, useEffect } from 'react';

const App = () => {
    const [data, setData] = useState(null); // Store JSON data
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/listing/getAllListings");

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

    // Conditional Rendering
    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data || !data.listings || data.listings.length === 0) return <h2>No Data Found</h2>;

    return <ListPage data={data} />;
}

const ListPage = ({ data }) => {
    return (
        <div>
            <h1>Fetched Listings:</h1>
            <div className="card-container">
                {data.listings.map(listing => (
                    <div key={listing.listingID} className="card">
                        <h2>{listing.name}</h2>
                        <p>{listing.description}</p>
                        <p><strong>Participants:</strong> {listing.participants.join(', ')}</p>
                        <p><strong>Date of Creation:</strong> {listing.dateOfCreation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
