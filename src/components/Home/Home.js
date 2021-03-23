import React, { useEffect, useState } from 'react';
import "./Home.css"

import Ride from '../Ride/Ride';

const Home = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const url = 'https://api.mocki.io/v1/c8159493';
        fetch(url)
            .then(response => response.json())
            .then(data => {

                setCategories(data);
            })
            .catch(error => console.log(error))
    }, [])
    return (
        <div className="banner">

            {/* <h1>this is home component</h1> */}
            <div className=" row m-5 d-flex home-container" >
                {
                    categories.map(category => <Ride key={category.id} category={category} setCategories={setCategories} />)
                }
            </div>

        </div>
    );
};

export default Home;