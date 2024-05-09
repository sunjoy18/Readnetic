import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';

const BookInfo = () => {
    const { bookId } = useParams();
    console.log('id : ', bookId)
    const username = localStorage.getItem('username')

    const [books, setBooks] = useState({});

    async function getBooks() {
        try {
            const res = await axios.get(`http://localhost:5000/api/getBook/${bookId}`);
            setBooks(res.data);
            console.log('bookss : ', books)
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }


    useEffect(() => {        
        getBooks();
    }, [bookId]);

    const { cartItems, addToCart } = useCart(); // State for the cart

    const isBookInCart = () => {
        // Assuming books has an id property
        return cartItems.some((item) => item.id === books._id);
    };

    async function postReview() {
        const reviewInput = document.querySelector('.reviewInput');
        const reviewText = reviewInput.value.trim();
    
        if (reviewText === "") {
            // You might want to handle empty reviews differently, e.g., show an error message.
            console.error("Review cannot be empty.");
            return;
        }
    
        try {
            const reviewData = {
                title: books.title, // Assuming you want to associate the review with the current book
                username: username,
                comment: reviewText,
            };
    
            const res = await axios.post('http://localhost:5000/api/addreview', reviewData);
    
            // // Assuming the API returns the updated reviews after adding a new one.
            // setBooks((prevBooks) => ({
            //     ...prevBooks,
            //     review: res.data.review,
            // }));

            // Clear the review input field after posting the review
            reviewInput.value = "";

            getBooks();
        } catch (error) {
            console.error('Error posting review:', error);
        }
    }
    

    const Review = ({ username, rating, comment }) => {
        return (
            <div className="review">
                <h3>User : {username}</h3>
                {/* <p>Rating: {rating}</p> */}
                <p>Review : {comment}</p>
            </div>
        );
    };

    return (
        <>
            <div className='mainInfoContainer'>
                <div className='infoContainer'>
                    <div>
                        <img
                            src={books.image}
                            alt={books.title}
                            className='bookCover'
                            style={{ width: 200, height: 300 }}
                        />
                    </div>
                    <div className='bookDetails'>
                        <h2>{books.title}</h2>
                        <p><b>Author:</b> {books.author}</p>
                        <p><b>Genre:</b> {books.genre}</p>
                        <p><b>Description:</b> {books.description}</p>
                        <div>
                            <Link style={{ textDecoration: 'none' }} to={`/read/${books.pdf}`}>
                                <button
                                    style={{
                                        backgroundColor: '#A1045A', color: 'white',
                                        padding: '10px 20px', borderRadius: '5px',
                                        border: 'none', cursor: 'pointer', fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                    Read
                                </button>
                            </Link>
                            {/* Add to Cart button */}
                            {!isBookInCart() ? (
                                <button
                                    onClick={() => addToCart(books)}
                                    style={{
                                        backgroundColor: '#A1045A', color: 'white',
                                        padding: '10px 20px', borderRadius: '5px',
                                        border: 'none', cursor: 'pointer',
                                        fontSize: '16px', fontWeight: 'bold',
                                        marginLeft: '10px',
                                    }}
                                >
                                    Add to 🛒
                                </button>
                            ) : (
                                <Link to="/cart" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        backgroundColor: '#72C3F4',
                                        color: 'white', padding: '10px 20px',
                                        borderRadius: '5px', border: 'none',
                                        cursor: 'pointer', fontSize: '16px',
                                        fontWeight: 'bold', marginLeft: '10px',
                                    }}>
                                        Go to 🛒
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ borderWidth: '2px', marginTop: '2%', width: '98%', marginLeft: '1%' }} />
            <div className='reviewsContainer'>
                <h2 style={{ marginTop: '2%', marginBottom: '2%' }}>Reviews</h2>
                {books.review && books.review.length > 0 ? (
                    books.review.map((review, index) => (
                        <Review
                            key={index}
                            username={review.username}
                            // rating={review.rating}
                            comment={review.comment}
                        />
                    ))
                ) : (
                    <div>
                        <p>No reviews yet.</p>
                    </div>
                )}

            </div>
            <hr style={{ borderWidth: '2px', marginTop: '2%', width: '98%', marginLeft: '1%' }} />
            <input type='text' placeholder='Write your review...' className='reviewInput'></input>
            <button
                style={{
                    backgroundColor: '#44a4e0',
                    color: 'white', padding: '10px 20px',
                    borderRadius: '5px', border: 'none',
                    cursor: 'pointer', fontSize: '16px',
                    fontWeight: 'bold', marginLeft: '10px',
                }}
                onClick={postReview}
            >
                SEND
            </button>
        </>
    );
};

export default BookInfo;
