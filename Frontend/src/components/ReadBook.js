//ReadBook.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import books from '../bookData';
import { BOOK_GENRES, data_sample } from '../bookData';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import TextExtractor from './TextExtractor';

// Explicitly set the worker source URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;



const ReadBook = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      alert('READER YOU HAVE SPENT 1HOUR READING BOOKS,\n PLEASE TAKE SOME REST 😊');
    }, 300); // 30 seconds in milliseconds

    return () => {
      clearTimeout(timer);
    };
  }, []);


  const { title } = useParams();

  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayClicked, setPlayClicked] = useState(false);

  useEffect(() => {

    const extractText = async () => {
      try {
        const loadingTask = pdfjs.getDocument(`http://localhost:5000/api/getPdf/${title}`);
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        let extractedText = '';

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          extractedText += pageText + '\n';
        }

        setText(extractedText);
      } catch (error) {
        console.error('Error extracting text:', error);
      }
    };

    extractText();
  }, []);

  // if (!selectedBook) {
  //   console.log('Book not found:', parsedBookId);
  //   return <div>Book not found.</div>;
  // }

  let playButtonClicked = false;

  const speakText = () => {
    window.responsiveVoice.speak(text, "UK English Male");
    setIsPlaying(true);
    setPlayClicked(true);
    playButtonClicked = true;
  };

  const pauseText = () => {
    window.responsiveVoice.pause();
    setIsPlaying(false);
  };

  const resumeText = () => {
    window.responsiveVoice.resume();
    setIsPlaying(true);
  };
  
  return (
    <div>
      <iframe
        src={`http://localhost:5000/api/getPdf/${title}#toolbar=0`}
        style={{ width: "100%", maxWidth: "100%", height: "850px" }}
        allow="fullscreen"
        title={title}
      ></iframe>
      <button className="overlay-button" onClick={speakText} style={{ display: isPlayClicked ? 'none' : 'inline-block' }}>
        Play
      </button>
      {/* {playButtonClicked && 
      <> */}
        <button className="overlay-button" onClick={pauseText} style={{ display: isPlaying ? 'inline-block' : 'none', 'marginLeft': '200px'}}>
          Pause🔊
        </button>
        <button className="overlay-button" onClick={resumeText} style={{ display: isPlaying ? 'none' : 'inline-block', 'marginLeft': '200px'}}>
          Resume🔊
        </button>
      {/* </>
      } */}
    </div>
  );
};

export default ReadBook;
