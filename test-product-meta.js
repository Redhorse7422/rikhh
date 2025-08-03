const https = require('https');

async function checkProductMetaTags() {
  return new Promise((resolve, reject) => {
    https.get('https://rikhh.com/product/LaKO9GRempobQ1dq3aWB', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check for product-specific meta tags
        const ogTitle = data.match(/<meta property="og:title" content="([^"]+)"/);
        const ogDescription = data.match(/<meta property="og:description" content="([^"]+)"/);
        const ogImage = data.match(/<meta property="og:image" content="([^"]+)"/);
        const ogUrl = data.match(/<meta property="og:url" content="([^"]+)"/);
        
        console.log('=== PRODUCT META TAGS CHECK ===');
        console.log('og:title:', ogTitle ? ogTitle[1] : 'NOT FOUND');
        console.log('og:description:', ogDescription ? ogDescription[1] : 'NOT FOUND');
        console.log('og:image:', ogImage ? ogImage[1] : 'NOT FOUND');
        console.log('og:url:', ogUrl ? ogUrl[1] : 'NOT FOUND');
        
        // Check if it's using product-specific content
        if (ogTitle && ogTitle[1].includes('local kokora')) {
          console.log('✅ Product-specific title found!');
        } else {
          console.log('❌ Still showing default title');
        }
        
        if (ogImage && ogImage[1].includes('image-proxy')) {
          console.log('✅ Product-specific image (proxy) found!');
        } else {
          console.log('❌ Still showing default image');
        }
        
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

checkProductMetaTags().catch(console.error); 