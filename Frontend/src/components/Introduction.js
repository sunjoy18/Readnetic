import React from 'react'
import { Link } from 'react-router-dom';
import bg from '../Images/indexbg1.png'

const Introduction = () => {
    return (
        <div>
            <img src={bg} alt="Background" style={{ width: '100%' }} />
            <div className="buttons">
                <Link to="/signup"> {/* Use Link and specify the "to" attribute for the route */}
                    <button className="btn-hover color-1">START READING!!</button>
                </Link>
            </div>
        </div>
    )
}

export default Introduction