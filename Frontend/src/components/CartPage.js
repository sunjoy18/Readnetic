import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const userId = localStorage.getItem('userid');
  const navigate = useNavigate();
  let location = useLocation();

  async function fetchCart() {
    try {
      const response = await axios.get(`http://localhost:5000/api/getcart/${userId}`);
      const cartData = response.data.cart;
      setCart(cartData);
      // Calculate total price
      const totalPrice = cartData.books.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  const decrementBookQuantity = async (title) => {
    try {
      await axios.put(`http://localhost:5000/api/updateQuantity/${userId}`, { title, operation: 'decrement' });
      fetchCart(); // Fetch the updated cart after updating quantity
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const incrementBookQuantity = async (title) => {
    try {
      await axios.put(`http://localhost:5000/api/updateQuantity/${userId}`, { title, operation: 'increment' });
      fetchCart(); // Fetch the updated cart after updating quantity
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };


  const removeBookFromCart = async (title) => {
    try {
      await axios.delete(`http://localhost:5000/api/removeFromCart/${userId}`, { data: { title } });
      fetchCart(); // Fetch the updated cart after removing the book
    } catch (error) {
      console.error('Error removing book from cart:', error);
    }
  };


  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clearCart/${userId}`);
      fetchCart(); // Fetch the updated cart after clearing
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
  };

  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
  };

  return (
    <>
      <nav>
        <div id='mySidenav' className='sidenav'>
          <Link className='closebtn' onClick={closeNav}>
            &times;
          </Link>
          <br />
          <Link to='/about'>ABOUT US</Link>
          <br />
          <Link to='/contact'>CONTACT US</Link>
          <br />
          <Link to='/tnc'>T&C</Link>
        </div>

        <span style={{ fontSize: '50px', cursor: 'pointer', color: 'white' }} onClick={openNav}>
          <b>&#9776;</b>
        </span>

        <div className='logo'>
          <Link to='/' style={{ textDecoration: 'none' }}>
            READNETIC
          </Link>
        </div>

        <div className='licon'>
          <div className='dropdown'>
            <i className='fas fa-user-circle fa-2x' style={{ fontSize: '40px', color: 'white' }}></i>

            {!localStorage.getItem('token') ? (
              <form className='dropdown-content'>
                {location.pathname === '/login' ? (
                  console.log('Welcome to Readnetic !!')
                ) : (
                  <Link to='/login'>Login</Link>
                )}
              </form>
            ) : (
              <form className='dropdown-content'>
                <Link onClick={handleLogout}>Log Out</Link>
              </form>
            )}
          </div>
        </div>
      </nav>
      <div className='cart-heading' style={{ borderBottom: '1px solid #ccc', marginLeft: '15px' }}>
        <h1 style={{ fontFamily: 'Ravie', color: 'black', textAlign: 'left', paddingLeft: '50px', position: 'relative', fontSize: '40px' }}>
          Shopping Cart
        </h1>
        <div className='cart-heading'>
          <div>
            <p>Total Books: {cart.books ? cart.books.length : 0}</p>
            <p style={{ marginRight: '20px' }}>Total Price: ₹{totalPrice}</p>
          </div>
          <button
            style={{ backgroundColor: '#A1045A', border: '1px solid white', borderRadius: '5px', color: 'white', padding: '7px', cursor: 'pointer' }}>
            Proceed to Checkout
          </button>
          <button
            onClick={() => clearCart()}
            style={{ backgroundColor: '#A1045A', border: '1px solid white', borderRadius: '5px', color: 'white', padding: '7px', marginLeft: '10px', cursor: 'pointer' }}>
            Empty Cart🗑️
          </button>
        </div>
      </div>
      <div className='cart-scroll-container'>
        <div>
          {cart.books && cart.books.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '10%' }}>Your cart is empty</p>
          ) : (
            <div className='outer-cart-container'>
              {cart.books &&
                cart.books.map((item) => (
                  <div key={item._id} className='cartItems'>
                    <img src={item.image} alt={item.title} />
                    <div className='cart-descriptions'>
                      <p>{item.title}</p>
                      <p>Price: ₹{item.price}</p>
                      <button onClick={() => removeBookFromCart(item.title)}>Remove</button>
                      <button
                        onClick={() => decrementBookQuantity(item.title)}
                        style={{
                          width: '30px',
                          margin: '5px',
                          marginLeft: '20px',
                          backgroundColor: item.quantity === 1 ? 'gray' : '',
                          cursor: item.quantity === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        -
                      </button>

                      {item.quantity}
                      <button onClick={() => incrementBookQuantity(item.title)} style={{ width: '30px', margin: '5px' }}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
