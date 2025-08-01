const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc } = require('firebase/firestore');

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test user data
const testUserData = {
  name: 'Test User',
  email: 'testuser@example.com',
  phoneNumber: '9876543210',
  type: 'buyer',
  // Address data
  street: '123 Test Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400001'
};

async function testUserRegistration() {
  try {
    console.log('Testing Firebase User Registration...\n');

    // 1. Check if user exists by phone
    console.log('1. Checking if user exists by phone...');
    const phoneQuery = query(collection(db, 'users'), where('phone', '==', testUserData.phoneNumber));
    const phoneSnapshot = await getDocs(phoneQuery);
    
    if (!phoneSnapshot.empty) {
      console.log('❌ User with this phone number already exists');
      return;
    }
    console.log('✅ No existing user found with this phone number');

    // 2. Check if user exists by email
    console.log('\n2. Checking if user exists by email...');
    const emailQuery = query(collection(db, 'users'), where('email', '==', testUserData.email));
    const emailSnapshot = await getDocs(emailQuery);
    
    if (!emailSnapshot.empty) {
      console.log('❌ User with this email already exists');
      return;
    }
    console.log('✅ No existing user found with this email');

    // 3. Create user
    console.log('\n3. Creating new user...');
    const userDoc = {
      name: testUserData.name,
      email: testUserData.email,
      phone: testUserData.phoneNumber,
      provider: 'PHONE',
      status: 'approved',
      isApproved: true,
      isBlocked: false,
      isDeleteMarked: false,
      image_url: 'https://winaero.com/blog/wp-content/uploads/2017/12/User-icon-256-blue.png',
      // Address as a single string (always includes India)
      address: `${testUserData.street}, ${testUserData.city}, ${testUserData.state} ${testUserData.zipCode}, India`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'users'), userDoc);
    console.log('✅ User created successfully with ID:', docRef.id);

    // 4. Verify user was created
    console.log('\n4. Verifying user creation...');
    const createdUserDoc = await getDoc(doc(db, 'users', docRef.id));
    
    if (createdUserDoc.exists()) {
      const userData = createdUserDoc.data();
      console.log('✅ User data verified:');
      console.log('   - Name:', userData.name);
      console.log('   - Email:', userData.email);
      console.log('   - Phone:', userData.phone);
      console.log('   - Provider:', userData.provider);
      console.log('   - Status:', userData.status);
      console.log('   - Is Approved:', userData.isApproved);
    } else {
      console.log('❌ User document not found after creation');
    }

    console.log('\n🎉 Firebase User Registration Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUserRegistration(); 