// src/components/PdfTextExtractor.js
import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf';

// Explicitly set the worker source URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const TextExtractor = ({ pdfUrl }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const extractText = async () => {
      try {
        const loadingTask = pdfjs.getDocument(pdfUrl);
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
  }, [pdfUrl]);

  return (
    <div>
      <h2>Text Extractor</h2>
      <pre>{text}</pre>
    </div>
  );
};

export default TextExtractor;
