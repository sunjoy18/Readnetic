import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';

const importAll = (r) => r.keys().map((filename) => r(filename));

const BookCategory = ({ title, pdfs, backgroundImages }) => {
  const [pdfPages, setPdfPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await Promise.all(pdfs.map(async (pdf) => {
        const module = await import(`../books/genres/${pdf}`);
        return module.default;
      }));

      setPdfPages(pages);
    };

    fetchPages();
  }, [pdfs]);


  return (
    <div>
      <h1 style={{ fontFamily: 'Ravie', color: 'black', textAlign: 'left', paddingLeft: '50px', position: 'relative', fontSize: '40px' }}>{title}</h1>
      <div className="container">
        {pdfPages.map((pdfPage, index) => (
          <div key={index} className={`card`} style={{ backgroundImage: `url(${backgroundImages[index]})` }}>
            <Document file={pdfPage}>
              <Page pageNumber={1} />
            </Document>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialMediaButtons = () => {
  return (
    <div>
      <hr />
      <br />
      <p style={{ fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}> FOLLOW US ON:</p>
      <br />
      <div className='buttons-container'>
        <div className='button facebook'>
          <i className="fab fa-facebook-f fa-2x"></i>
        </div>
        <div className='button twitter'>
          <i className="fab fa-twitter fa-2x"></i>
        </div>
        <div className='button whatsapp'>
          <i className="fab fa-whatsapp fa-2x"></i>
        </div>
        <div className='button instagram'>
          <i className="fab fa-instagram fa-2x"></i>
        </div>
        <div className='button snapchat'>
          <i className="fab fa-snapchat fa-2x"></i>
        </div>
      </div>
      <br />
      <nav style={{ height: '20px' }}></nav>
    </div>
  );
};

const importPdfsFromFolder = async (folder) => {
  const pdfContext = require.context(`../books/genres/${folder}`, false, /\.pdf$/);
  const files = importAll(pdfContext);

  const pdfs = await Promise.all(files.map(async (filename) => {
    const path = `../books/genres/${folder}/${filename}`;
    const pdfModule = await import(path);
    return pdfModule.default;
  }));

  return pdfs;
};

const handleGenreRender = async (title, folderName, backgroundImages) => {
  const pdfs = await importPdfsFromFolder(folderName);
  return <BookCategory title={title} pdfs={pdfs} backgroundImages={backgroundImages} />;
};

const Home = () => {

  const renderGenre = async (title, folderName, backgroundImages) => {
    const pdfs = await importPdfsFromFolder(folderName);
    return handleGenreRender(title, folderName, backgroundImages, pdfs);
  };

  return (
    <div>
      <div className="wrap">
        <form method="POST" action="search_books.php">
          <div className="search">
            <input type="text" className="searchTerm" name="search" placeholder="What are you looking for?" autoComplete="on" required />
            <button type="submit" className="searchButton">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </form>
      </div>
      <br />
      <br />

      {renderGenre("ROMANCE", "romance", [
        "https://lalchowk.in/lalchowk/pictures/Ugly%20Love%20A%20Novel.jpg",
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1642118320l/59856881.jpg",
        "https://m.media-amazon.com/images/I/51uq6tDW6SL._SL500_.jpg",
      ])}
      {renderGenre("HISTORICAL FICTION", "historical-fiction", [
        "https://groep7-selfpublish-books.co.za/wp-content/uploads/2019/11/A-Pirates-Wife.jpg",
        "https://i.thenile.io/r1000/9781530997664.jpg?r=5e29bb3f55297",
        "https://www.obooko.com/images-cache/miss-matchs-misadventures-nash-obooko-ebook-a0a788148c35be72ff3930516a7c7c99.jpg",
        "https://i.ebayimg.com/images/g/sNAAAOSwiPtg3~61/s-l300.jpg",
      ])}
      {renderGenre("MYSTERY", "mystery", [
        "https://www.obooko.com/images-cache/death-stalks-her-cover-obooko-ebook-76cf5f89dc354729c8fee9150db80352.jpg",
        "https://th.bing.com/th/id/R.a7fe11e929ac3af6cc619b0c297dd752?rik=9cocgqquJE2uEw&riu=http%3a%2f%2fwww.e-booksdirectory.com%2fimglrg%2f1789.jpg&ehk=%2fB5LGmJl%2foAlgz%2fIgWigEwk0MJbOJ4AvYsXrl2BXVOI%3d&risl=&pid=ImgRaw&r=0",
        "https://www.obooko.com/images-cache/the-murderer-ayokanmi-e9792f92c46992a2bdb57a0cec2d5a47.jpg",
        "https://1.bp.blogspot.com/-T2oUyzHDRjk/XbsLOFEd5iI/AAAAAAAAxmA/4MRRy-mtePUqN7JK0sCFvCwTYgMYdmkgwCLcBGAsYHQ/s1600/BookCover_FindingLisa.jpg",
      ])}
      {renderGenre("SCIENCE FICTION", "science-fiction", [
        "https://www.obooko.com/images-cache/man-in-the-moon-cover-obooko-b994d4f2dc76ae00eae8fa10a6b30096.jpg",
        "https://m.media-amazon.com/images/I/41-6k2p96jL.jpg",
        "https://th.bing.com/th/id/R.5c3a7f79c97ddbdca6aa366b9226b474?rik=FQEY9iYQBf1soA&riu=http%3a%2f%2fimg1.imagesbn.com%2fp%2f2940011065446_p0_v1_s260x420.JPG&ehk=vhyiM%2fRt0NfQ00teITzVihey%2buntTCsHptDJ2gnQhS0%3d&risl=&pid=ImgRaw&r=0",
        "https://booksprout.co/uploads/covers/midsizes/RoseRed-1626247292.jpg",
      ])}
      <SocialMediaButtons />
    </div>
  );
};

export default Home;
