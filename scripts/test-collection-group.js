// Test script for Collection Group Query
const { initializeApp } = require('firebase/app')
const { getFirestore, collectionGroup, getDocs } = require('firebase/firestore')

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

async function testCollectionGroupQuery() {
  try {
    console.log('🔍 Testing Collection Group Query for products...')
    
    // Use Collection Group Query to get all products from all sellers
    const productsQuery = collectionGroup(db, 'products')
    const productsSnapshot = await getDocs(productsQuery)
    
    console.log(`✅ Found ${productsSnapshot.docs.length} products total`)
    
    // Show details of each product
    productsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data()
      const pathParts = doc.ref.path.split('/')
      const sellerId = pathParts[1]
      
      console.log(`\n📦 Product ${index + 1}:`)
      console.log(`   Path: ${doc.ref.path}`)
      console.log(`   ID: ${doc.id}`)
      console.log(`   Seller ID: ${sellerId}`)
      console.log(`   Name: ${data.productName}`)
      console.log(`   Price: ${data.price}`)
      console.log(`   Category: ${data.category}`)
      console.log(`   Images: ${data.images?.length || 0} images`)
    })
    
    console.log('\n🎉 Collection Group Query test completed successfully!')
    
  } catch (error) {
    console.error('❌ Collection Group Query test failed:', error)
    console.error('Error details:', error.message)
  }
}

// Run the test
testCollectionGroupQuery() 