const { initializeApp } = require('firebase/app')
const { getStorage, ref, getDownloadURL } = require('firebase/storage')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

// Test Firebase Storage URLs
async function testFirebaseStorageUrls() {
  console.log('🔍 Testing Firebase Storage URLs...')
  console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  
  // Test some common image paths
  const testPaths = [
    'product_images/test-image.jpg',
    'users/test-user/profile.jpg',
    'products/sample-product/thumbnail.jpg'
  ]

  for (const path of testPaths) {
    try {
      console.log(`\n📁 Testing path: ${path}`)
      const storageRef = ref(storage, path)
      const downloadURL = await getDownloadURL(storageRef)
      console.log(`✅ Success: ${downloadURL}`)
      
      // Test if the URL is accessible
      const response = await fetch(downloadURL, { method: 'HEAD' })
      if (response.ok) {
        console.log(`✅ URL is accessible (Status: ${response.status})`)
      } else {
        console.log(`❌ URL not accessible (Status: ${response.status})`)
      }
    } catch (error) {
      console.log(`❌ Error for ${path}:`, error.message)
    }
  }
}

// Test URL formatting
function testUrlFormatting() {
  console.log('\n🔧 Testing URL formatting...')
  
  const testUrls = [
    'https://firebasestorage.googleapis.com/v0/b/rikhh-9d30a.appspot.com/o/product_images%2Ftest.jpg?alt=media&token=abc123',
    'https://firebasestorage.googleapis.com/v0/b/rikhh-9d30a.appspot.com/o/product_images%2Ftest.jpg?token=abc123',
    'https://rikhh-9d30a.firebasestorage.app/o/product_images%2Ftest.jpg?alt=media&token=abc123',
    'https://rikhh-9d30a.firebasestorage.app/o/product_images%2Ftest.jpg?token=abc123'
  ]

  testUrls.forEach(url => {
    const hasAltMedia = url.includes('alt=media')
    const isFirebaseUrl = url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')
    console.log(`URL: ${url}`)
    console.log(`  - Is Firebase URL: ${isFirebaseUrl}`)
    console.log(`  - Has alt=media: ${hasAltMedia}`)
    console.log('')
  })
}

// Run tests
async function runTests() {
  try {
    await testFirebaseStorageUrls()
    testUrlFormatting()
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

runTests() 