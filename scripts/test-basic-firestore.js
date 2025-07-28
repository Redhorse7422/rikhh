// Basic Firestore connection test
const { initializeApp } = require('firebase/app')
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore')

// Firebase config for rikhh-for-website
const firebaseConfig = {
  apiKey: "AIzaSyCMjgdSd3TL32uXt97pAoh104bd7K1p6t8",
  authDomain: "rikhh-for-website.firebaseapp.com",
  projectId: "rikhh-for-website",
  storageBucket: "rikhh-for-website.appspot.com",
  messagingSenderId: "213971884662",
  appId: "1:213971884662:web:19a135caf95c6d2d725d57"
}

console.log('🔧 Firebase Config:', firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testBasicFirestore() {
  try {
    console.log('🔍 Testing basic Firestore connection...')
    
    // Test 1: Write a test document
    console.log('\n📝 Writing test document...')
    const testDoc = doc(db, 'test', 'connection')
    await setDoc(testDoc, {
      message: 'Hello Firestore!',
      timestamp: new Date().toISOString(),
      test: true
    })
    console.log('✅ Test document written successfully')
    
    // Test 2: Read the test document back
    console.log('\n📖 Reading test document...')
    const docSnap = await getDoc(testDoc)
    
    if (docSnap.exists()) {
      console.log('✅ Test document read successfully:', docSnap.data())
    } else {
      console.log('❌ Test document not found')
    }
    
    console.log('\n🎉 Basic Firestore connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Basic Firestore connection test failed:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Suggestion: Check your Firestore security rules')
    } else if (error.code === 'not-found') {
      console.log('\n💡 Suggestion: Make sure Firestore database is created in Firebase Console')
    } else if (error.code === 'unauthenticated') {
      console.log('\n💡 Suggestion: Check your Firebase configuration')
    }
  }
}

// Run the test
testBasicFirestore() 