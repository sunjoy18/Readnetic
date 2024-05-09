import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import cart from '../Images/cart.jpg'
import chatroom from '../Images/chatroom.png'
import { Link as ScrollLink } from 'react-scroll';
import { useCart } from './CartContext';




const withouSidebarRoutes = ["/signup", "/login", "/animate", "/cart"];


const NavBar = () => {


  const { cartItems } = useCart();


  const { pathname } = useLocation();
  let location = useLocation();
  let history = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/login");
  }


  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  }
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  }


  if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;


  return (
    <div>
      <nav>
        <div id="mySidenav" className="sidenav">
          <Link className="closebtn" onClick={closeNav}>&times;</Link>
          <br />
          <Link to="/about">ABOUT US</Link>
          <br />
          <Link to="/contact">CONTACT US</Link>
          <br />
          <Link to="/tnc">T&C</Link>
        </div>


        <span style={{ fontSize: '50px', cursor: 'pointer', color: 'white' }} onClick={openNav}>
          <b>&#9776;</b>
        </span>


        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none' }}>READNETIC</Link>
        </div>


        <div className="dropdown">
          <i className="fas fa-mask" style={{ fontSize: '30px', color: 'white' }}>&nbsp;Genres</i>
          <div className="dropdown-content">
            <ScrollLink to="ACTION" smooth={true} duration={500}>Action</ScrollLink>
            <ScrollLink to="FANTASY" smooth={true} duration={500}>Fantasy</ScrollLink>
            <ScrollLink to="HISTORY" smooth={true} duration={500}>History</ScrollLink>
            <ScrollLink to="HORROR" smooth={true} duration={500}>Horror</ScrollLink>
            <ScrollLink to="HUMOR" smooth={true} duration={500}>Humor</ScrollLink>
            <ScrollLink to="MYSTERY" smooth={true} duration={500}>Mystery</ScrollLink>
            <ScrollLink to="ROMANCE" smooth={true} duration={500}>Romance</ScrollLink>
            <ScrollLink to="SCIENCE" smooth={true} duration={500}>Science</ScrollLink>
            <ScrollLink to="THRILLER" smooth={true} duration={500}>Thriller</ScrollLink>
          </div>
        </div>


        <div className='cart' style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
          <Link to="/cart" style={{ textDecoration: 'none', fontSize: '30px' }}>
            <img src={cart} alt='Cart' style={{ width: '40px', height: '40px' }} />
          </Link>
          {(cartItems.length <= 0) ? (
            <p></p>
          ) : (<p style={{ color: 'white', marginTop: '-7px' }}>{cartItems.length}</p>)
          }


        </div>


        <div>
          <Link to="/chathome" style={{ textDecoration: 'none', fontSize: '30px' }}>
            <img src={chatroom} alt='chatroom' style={{ width: '40px', height: '40px' }} />
          </Link>
        </div>
        <div className="licon">
          <div className="dropdown">
            <i className="fas fa-user-circle fa-2x" style={{ fontSize: '40px', color: 'white' }}></i>


            {!localStorage.getItem("token") ? (
              <form className="dropdown-content">
                {location.pathname === '/login' ? (
                  console.log("Welcome to Readnetic !!")
                ) : (
                  <Link to='/login'>Login</Link>
                )}
              </form>
            ) : (
              <form className="dropdown-content">
                <Link to='/login' onClick={handleLogout}>Log Out</Link>
              </form>
            )}




            {/* <form method="POST">
              <div className="dropdown-content">
                <Link to="/login">Logout</Link>
              </div>
            </form> */}
          </div>
        </div>
      </nav>
    </div>
  )
}


export default NavBar

