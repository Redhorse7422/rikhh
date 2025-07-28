// Simple test script to verify Firebase connection
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

// Firebase config for rikhh-for-website
const firebaseConfig = {
  apiKey: "AIzaSyCMjgdSd3TL32uXt97pAoh104bd7K1p6t8",
  authDomain: "rikhh-for-website.firebaseapp.com",
  projectId: "rikhh-for-website",
  storageBucket: "rikhh-for-website.appspot.com",
  messagingSenderId: "213971884662",
  appId: "1:213971884662:web:19a135caf95c6d2d725d57"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...')
    
    // Test 1: Get sellers
    console.log('\n📋 Testing sellers collection...')
    const sellersCollection = collection(db, 'sellers')
    const sellersSnapshot = await getDocs(sellersCollection)
    console.log(`✅ Found ${sellersSnapshot.docs.length} sellers`)
    
    // Test 2: Get products from first seller
    if (sellersSnapshot.docs.length > 0) {
      const firstSeller = sellersSnapshot.docs[0]
      console.log(`\n📦 Testing products for seller: ${firstSeller.id}`)
      
      const productsCollection = collection(db, `sellers/${firstSeller.id}/products`)
      const productsSnapshot = await getDocs(productsCollection)
      console.log(`✅ Found ${productsSnapshot.docs.length} products`)
      
      // Show first product details
      if (productsSnapshot.docs.length > 0) {
        const firstProduct = productsSnapshot.docs[0]
        const productData = firstProduct.data()
        console.log('\n📄 First product details:')
        console.log(`   ID: ${firstProduct.id}`)
        console.log(`   Name: ${productData.productName}`)
        console.log(`   Price: ${productData.price}`)
        console.log(`   Category: ${productData.category}`)
        console.log(`   Images: ${productData.images?.length || 0} images`)
      }
    }
    
    console.log('\n🎉 Firebase connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error)
    console.error('Error details:', error.message)
  }
}

// Run the test
testFirebaseConnection() 