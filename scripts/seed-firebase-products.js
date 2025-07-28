// Script to seed Firebase with sample products
// Run this script after setting up Firebase configuration

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Your Firebase config (using environment variables)
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
const db = getFirestore(app)

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    regularPrice: 99.99,
    salePrice: 79.99,
    rating: 4.5,
    reviews: 128,
    thumbnailImg: '/images/cover/cover-01.png',
    badge: 'Best Seller',
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    inStock: true,
    sku: 'WH-001',
    weight: 0.3,
    dimensions: { length: 18, width: 8, height: 3 },
    featured: true,
    published: true,
    approved: true,
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking watch with heart rate monitor and GPS.',
    regularPrice: 199.99,
    salePrice: 159.99,
    rating: 4.3,
    reviews: 89,
    thumbnailImg: '/images/cover/cover-02.jpg',
    badge: 'New',
    category: 'Electronics',
    tags: ['fitness', 'smartwatch', 'health', 'tracking'],
    inStock: true,
    sku: 'SW-002',
    weight: 0.1,
    dimensions: { length: 4, width: 4, height: 1 },
    featured: true,
    published: true,
    approved: true,
  },
  {
    name: 'Premium Coffee Maker',
    slug: 'premium-coffee-maker',
    description: 'Professional coffee maker with programmable settings and thermal carafe.',
    regularPrice: 149.99,
    salePrice: 119.99,
    rating: 4.7,
    reviews: 256,
    thumbnailImg: '/images/cover/cover-03.jpg',
    badge: 'Sale',
    category: 'Home & Kitchen',
    tags: ['coffee', 'kitchen', 'appliance', 'brewing'],
    inStock: true,
    sku: 'CM-003',
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 35 },
    featured: false,
    published: true,
    approved: true,
  },
  {
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    description: 'Comfortable organic cotton t-shirt available in multiple colors.',
    regularPrice: 29.99,
    salePrice: 24.99,
    rating: 4.2,
    reviews: 67,
    thumbnailImg: '/images/cover/cover-04.jpg',
    badge: 'Eco-Friendly',
    category: 'Clothing',
    tags: ['organic', 'cotton', 'tshirt', 'clothing'],
    inStock: true,
    sku: 'TS-004',
    weight: 0.2,
    dimensions: { length: 25, width: 20, height: 1 },
    featured: false,
    published: true,
    approved: true,
  },
  {
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable speaker with 20-hour battery life and deep bass.',
    regularPrice: 89.99,
    salePrice: 69.99,
    rating: 4.4,
    reviews: 156,
    thumbnailImg: '/images/cover/cover-05.jpg',
    badge: 'Waterproof',
    category: 'Electronics',
    tags: ['portable', 'bluetooth', 'speaker', 'waterproof'],
    inStock: true,
    sku: 'PS-005',
    weight: 0.5,
    dimensions: { length: 15, width: 8, height: 8 },
    featured: true,
    published: true,
    approved: true,
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours.',
    regularPrice: 34.99,
    salePrice: 27.99,
    rating: 4.6,
    reviews: 198,
    thumbnailImg: '/images/cover/cover-01.png',
    badge: 'Insulated',
    category: 'Home & Kitchen',
    tags: ['water', 'bottle', 'stainless', 'insulated'],
    inStock: true,
    sku: 'WB-006',
    weight: 0.4,
    dimensions: { length: 8, width: 8, height: 25 },
    featured: false,
    published: true,
    approved: true,
  },
  {
    name: 'Wireless Charging Pad',
    slug: 'wireless-charging-pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    regularPrice: 49.99,
    salePrice: 39.99,
    rating: 4.1,
    reviews: 76,
    thumbnailImg: '/images/cover/cover-02.jpg',
    badge: 'Fast Charge',
    category: 'Electronics',
    tags: ['wireless', 'charging', 'qi', 'fast'],
    inStock: true,
    sku: 'WC-007',
    weight: 0.2,
    dimensions: { length: 10, width: 10, height: 1 },
    featured: false,
    published: true,
    approved: true,
  },
  {
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Non-slip yoga mat made from eco-friendly materials.',
    regularPrice: 44.99,
    salePrice: 34.99,
    rating: 4.3,
    reviews: 92,
    thumbnailImg: '/images/cover/cover-03.jpg',
    badge: 'Eco-Friendly',
    category: 'Sports & Fitness',
    tags: ['yoga', 'mat', 'fitness', 'eco-friendly'],
    inStock: true,
    sku: 'YM-008',
    weight: 1.2,
    dimensions: { length: 180, width: 60, height: 0.5 },
    featured: false,
    published: true,
    approved: true,
  },
]

async function seedProducts() {
  try {
    console.log('Starting to seed products...')

    const productsCollection = collection(db, 'products')

    for (const product of sampleProducts) {
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(productsCollection, productData)
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`)
    }

    console.log('✅ Successfully seeded all products!')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
  }
}

// Run the seeding function
seedProducts()
