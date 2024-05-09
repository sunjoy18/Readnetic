import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import NavBar from './components/NavBar';
import Introduction from './components/Introduction';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Terms from './components/Terms';
import Animation from './components/Animation';
import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import ReadBook from './components/ReadBook';
import TextExtractor from './components/TextExtractor';
import CartPage from './components/CartPage';
import ChatHome from './components/ChatHome';
import ChatRoom from './components/ChatRoom';
import BookInfo from './components/BookInfo';


function App() {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Time in milliseconds for which the Intro component should be rendered
    const introDuration = 5000; // 5 seconds

    const hideIntro = async () => {
      await delay(introDuration);
      setShowIntro(false);
    };

    hideIntro();
  }, []);


  return (
    <>
      <CartProvider>
        {showIntro ? (
          <Animation />
        ) : (
          <Router>
            <NavBar />
            <Routes>
              <Route path='/' element={<Introduction />}></Route>
              <Route path='/signup' element={<SignUp />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/about' element={<AboutUs />}></Route>
              <Route path='/contact' element={<ContactUs />}></Route>
              <Route path='/tnc' element={<Terms />}></Route>
              <Route path="/home" element={<BookList />}></Route>
              <Route path="/read/:title" element={<ReadBook />}></Route>
              <Route path="/extract/:url" element={<TextExtractor />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path="/chathome" element={<ChatHome/>} ></Route>
              <Route path="/chat/:randomWriter" element={<ChatRoom />} ></Route>
              <Route path="/bookInfo/:bookId" element={<BookInfo />} ></Route>
            </Routes>
          </Router>
        )}
      </CartProvider>
    </>
  );
}

export default App;