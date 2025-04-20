// src/content/contentScript.js

// Extracts product title and price from the current page
function extractBottleInfo() {
    const title = document.querySelector('h1')?.innerText || '';
    const priceText =
      document.querySelector('[class*=price], .price')?.innerText || '';
  
    // Send message to the background
    chrome.runtime.sendMessage({
      type: 'BOTTLE_INFO',
      payload: {
        title,
        price: priceText,
        url: window.location.href,
      },
    });
  }
  
  // Run on page load
  extractBottleInfo();
  