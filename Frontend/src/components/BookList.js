import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [searchResults, setSearchResults] = useState([]); // State to store the search results
  const [cart, setCart] = useState([]); // Provide a default value for cart
  const [addedToCart, setAddedToCart] = useState(false); // Track whether a book is added to the cart
  
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(0); // State to track the current page
  // Calculate the indices for pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const totalPages = Math.ceil(searchResults.length / itemsPerPage);


  const next = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };


  const previous = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  let userId = localStorage.getItem('userid');

  const handleSearchInput = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books based on the search query
    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    });

    setSearchResults(filteredBooks);
  };

  const isBookInCart = (title) => {
    return cart.some((item) => item.title === title);
  };

  const [books, setBooks] = useState([]);

  async function getCart() {
    try {
      const res = await axios.get(`http://localhost:5000/api/getcart/${userId}`);
      setCart(res.data.cart.books);
    } catch (error) {
      console.log('Error getting cart.', error);
    }
  }

  useEffect(() => {
    async function getBooks() {
      try {
        const res = await axios.get('http://localhost:5000/api/getBooks');
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    getCart();
    getBooks();
  }, [userId]);

  useEffect(() => {
    getCart();
    setAddedToCart(false); // Reset addedToCart state after cart changes
  }, [cart]);

  async function addBookToCart(title) {
    try {
      const data = {
        title: title,
      };
      const res = await axios.post(`http://localhost:5000/api/addtocart/${userId}`, data);
      setCart(res.data.cart.books);
      setAddedToCart(true);
    } catch (error) {
      console.error('Error adding books to cart:', error);
    }
  }

  // Function to render books by genre
  const renderBooksByGenre = (genre) => {
    const genreBooks = books.filter((book) => book.genre === genre);

    return (
      <div key={genre}>
        <h2
          style={{
            fontFamily: 'Ravie',
            color: 'black',
            textAlign: 'left',
            paddingLeft: '50px',
            position: 'relative',
            fontSize: '40px',
          }}
        >
          {genre}
        </h2>
        <div className='scroll-container'>
          <div className='container'>
            {genreBooks.map((book) => (
              <div key={book._id} id='outer-card-container'>
                <div className={`card`} style={{ backgroundImage: `url(${book.image})` }}></div>
                <Link style={{ textDecoration: 'none' }} to={`/bookInfo/${book._id}`}>
                  <button
                    style={{
                      backgroundColor: '#A1045A',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    View
                  </button>
                </Link>
                {!isBookInCart(book.title) ? (
                  <button
                    onClick={() => addBookToCart(book.title)}
                    style={{
                      backgroundColor: addedToCart ? '#72C3F4' : '#A1045A',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginLeft: '10px',
                    }}
                  >
                    {addedToCart ? 'Go to 🛒' : 'Add to 🛒'}
                  </button>
                ) : (
                  <Link to='/cart' style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        backgroundColor: '#72C3F4',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                      }}
                    >
                      Go to 🛒
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: '2%' }}>
      <div className='wrap'>
        <div className='search'>
          <input
            type='text'
            className='searchTerm'
            name='search'
            placeholder='What are you looking for?'
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <button type='submit' className='searchButton'>
            <i className='fa fa-search'></i>
          </button>
        </div>
      </div>
      <br />
      <br />

      {/* Display searched books */}
      {searchQuery !== '' && (
        searchResults.length > 0 ? (
          <div className="scroll-container">
            <div className="container">
              {searchResults.slice(startIndex, endIndex).map((book, index) => (
                // Render the books up to the displayedBooks limit
                <div key={index} id='outer-card-container'>
                  <div className={`card`} style={{ backgroundImage: `url(${book.image})` }}></div>
                  <Link style={{ textDecoration: 'none' }} to={`/bookInfo/${book._id}`}>
                    <button
                      style={{
                        backgroundColor: '#A1045A', color: 'white',
                        padding: '10px 20px', borderRadius: '5px',
                        border: 'none', cursor: 'pointer', fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                      View
                    </button>
                  </Link>
                  {/* Add to Cart button */}
                  {!isBookInCart(book.title) ? (
                    <button
                      onClick={() => addBookToCart(book.title)}
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
              ))}
            </div>
          </div>
        ) : (


          <div className='noResult' >
            <p>No results found</p>
          </div>
        )
      )}

      <br />

      {/* Display books by genre */}
      {Array.from(new Set(books.map((book) => book.genre))).map((genre) => renderBooksByGenre(genre))}

      <br />
    </div>
  );
};

export default BookList;
