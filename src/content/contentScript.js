// src/content/contentScript.js

// Extracts product title and price from the current page
function extractBottleInfo() {
  const title = document.querySelector('h1')?.innerText || '';
  const url = window.location.href;
  
  // Send message to the extension
  chrome.runtime.sendMessage({
    type: 'BOTTLE_INFO',
    payload: {
      title,
      url
    }
  });
}

// Run on page load
extractBottleInfo();
  