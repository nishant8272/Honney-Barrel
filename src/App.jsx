import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState(''); // Add a title state for auto-fill
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen for messages from content script (to auto-fill the fields)
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'BOTTLE_INFO') {
        setTitle(message.payload.title); // Auto-fill the title
        setUrl(message.payload.url); // Auto-fill the URL
      }
    });
  }, []);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://services.baxus.co/api/search/listings?from=0&size=50&listed=true`
      );
      const listings = response.data.listings || [];

      // Use Fuse.js for fuzzy matching
      const fuse = new Fuse(listings, {
        keys: ['title'],
        threshold: 0.4, // lower = stricter match, higher = more lenient
      });

      const matched = fuse.search(url).map((result) => result.item);
      setResults(matched);
    } catch (error) {
      console.error('Error comparing prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-sm font-sans w-[300px]">
      <h2 className="text-lg font-semibold mb-2">The Honey Barrel 🍯</h2>

      <input
        type="text"
        placeholder="Enter bottle name or product URL"
        className="border rounded p-1 w-full mb-2 text-sm"
        value={title} // Display the auto-filled title
        onChange={(e) => setUrl(e.target.value)} // Keep the URL state as before
      />

      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
        onClick={handleCompare}
        disabled={loading}
      >
        {loading ? 'Comparing...' : 'Compare on BAXUS'}
      </button>

      <div className="mt-4">
        {results.length > 0 ? (
          <ul>
            {results.map((item) => (
              <li key={item.id} className="mb-2 border-b pb-2">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs">Price: ${item.price}</div>
                <a
                  href={`https://www.baxus.co/asset/${item.assetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs hover:underline"
                >
                  View on BAXUS
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-600">
            {loading ? '' : 'No matches found yet.'}
          </div>
        )}
      </div>
    </div>
  );
};


export default App
