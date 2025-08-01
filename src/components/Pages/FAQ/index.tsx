'use client'

import React, { useState } from 'react'

import { Icon } from '@/components/common/icon'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Order Management
  {
    category: 'Order Management',
    question: 'How can I cancel my order?',
    answer: 'When cancelling your order, please provide a brief description of the reason for cancellation. This helps us improve our service and ensures we meet your needs effectively. Whether it\'s a change of plans, an issue with the product, or any other reason, your feedback is valuable to us. Simply let us know why you\'re cancelling your order, and we\'ll process it promptly. Thank you for your understanding and cooperation.'
  },
  {
    category: 'Order Management',
    question: 'How can I track an order?',
    answer: 'To track your order for products booked in-store, simply visit our shop and utilize our self service kiosk. With just your booking information, you can easily locate your items and complete the purchase transaction independently. Experience the convenience of tracking and picking up your products at your own pace, without the need for staff assistance. We strive to make your shopping experience effortless and efficient.'
  },
  {
    category: 'Order Management',
    question: 'How can I get money back?',
    answer: 'To request a refund, please visit the store or shop where you made your purchase, inspect the product, and proceed with buying it if it meets your satisfaction. If the shop has any refund or return policies in place, kindly review and adhere to their guidelines. It\'s important to note that Rikhh is not responsible for managing refunds or returns. We encourage you to familiarize yourself with the shop\'s policies to ensure a smooth transaction experience. Thank you for your understanding.'
  },

  // Vendor Registration
  {
    category: 'Vendor Registration',
    question: 'Why is my Vendor registration delayed?',
    answer: 'We apologize for the delay in processing your vendor registration. Due to high demand and an influx of registrations, the process may take up to 7 days to complete. Rest assured, our team is working diligently to review and approve your application as quickly as possible. If you have any urgent inquiries or concerns during this time, please don\'t hesitate to contact us at support@rikh.com. We appreciate your patience and understanding.'
  },
  {
    category: 'Vendor Registration',
    question: 'How do I become a seller on Rikhh?',
    answer: 'To become a seller on Rikhh, you need to complete our vendor registration process. This includes providing your business details, contact information, and product categories you wish to sell. Our team will review your application within 7 days and contact you with the next steps. You can start the registration process by visiting our "Become a Seller" page.'
  },

  // Shopping & Products
  {
    category: 'Shopping & Products',
    question: 'What do I need to buy products?',
    answer: 'For in shop purchases, simply visit our store to buy the products you need. No additional information is required except for your name, address (including pin code), current location, and phone number, which may be requested for verification purposes during the transaction process. Experience the convenience of shopping in person and explore our range of products firsthand at our store. We look forward to welcoming you soon!'
  },
  {
    category: 'Shopping & Products',
    question: 'Do you offer free shipping?',
    answer: 'Yes, we offer free standard shipping on eligible orders. Shipping costs are calculated at checkout based on your location and selected shipping method. Some products may have additional shipping charges depending on size, weight, or special handling requirements.'
  },
  {
    category: 'Shopping & Products',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including cash on delivery, credit/debit cards, digital wallets, and online banking. Payment options may vary depending on your location and the specific product or service.'
  },

  // Account & Security
  {
    category: 'Account & Security',
    question: 'How do I create an account?',
    answer: 'Creating an account on Rikhh is simple. You can sign up using your phone number and email address. We\'ll send you an OTP verification to ensure your account is secure. Once verified, you can start shopping and enjoy exclusive member benefits.'
  },
  {
    category: 'Account & Security',
    question: 'I forgot my password. How can I reset it?',
    answer: 'Since we use OTP-based authentication, you don\'t need to remember a password. Simply enter your phone number and we\'ll send you an OTP to verify your identity and access your account.'
  },
  {
    category: 'Account & Security',
    question: 'How can I update my account information?',
    answer: 'You can update your account information by logging into your account and visiting the profile settings section. Here you can modify your personal details, address, and contact information.'
  },

  // Returns & Refunds
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'Our return policy varies by product and vendor. Generally, you can return products within a specified time frame if they are unused and in original packaging. Please check the specific return policy for each product before making a purchase.'
  },
  {
    category: 'Returns & Refunds',
    question: 'How long does it take to process a refund?',
    answer: 'Refund processing times depend on the payment method used and the vendor\'s policy. Typically, refunds are processed within 3-7 business days after the return is approved. You will be notified via email once the refund is processed.'
  },

  // Technical Support
  {
    category: 'Technical Support',
    question: 'I\'m having trouble with the website. What should I do?',
    answer: 'If you\'re experiencing technical issues with our website, please try refreshing the page or clearing your browser cache. If the problem persists, contact our technical support team at contact@rikhh.com or call us at +91-70023-30896 for immediate assistance.'
  },
  {
    category: 'Technical Support',
    question: 'How can I contact customer support?',
    answer: 'You can contact our customer support team through multiple channels: Phone: +91-70023-30896 (24/7), Email: contact@rikhh.com, or visit our contact page. Our team is available to help you with any questions or concerns.'
  },

  // Shipping & Delivery
  {
    category: 'Shipping & Delivery',
    question: 'How long does shipping take?',
    answer: 'Shipping times vary depending on your location and the shipping method selected. Standard shipping typically takes 3-7 business days, while express shipping may take 1-3 business days. You can track your order status through our tracking system.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally?',
    answer: 'Currently, we primarily serve customers in India. For international shipping inquiries, please contact our customer support team to check availability for your specific location.'
  },

  // Product Information
  {
    category: 'Product Information',
    question: 'Are the products authentic?',
    answer: 'Yes, we ensure that all products sold on our platform are authentic and sourced from authorized vendors. We have strict quality control measures in place to maintain product authenticity and customer satisfaction.'
  },
  {
    category: 'Product Information',
    question: 'Can I see product reviews before buying?',
    answer: 'Yes, you can read customer reviews and ratings for products on our platform. These reviews help you make informed purchasing decisions based on real customer experiences.'
  }
]

const categories = ['All', 'Order Management', 'Vendor Registration', 'Shopping & Products', 'Account & Security', 'Returns & Refunds', 'Technical Support', 'Shipping & Delivery', 'Product Information']

export const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index)
    } else {
      newExpandedItems.add(index)
    }
    setExpandedItems(newExpandedItems)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedCategory('All')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Rikhh. Can not find what you are looking for? 
            <a href="/contact-us" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Contact our support team
            </a>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Icon name="AiOutlineSearch" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon name="AiOutlineClose" className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="AiOutlineSearch" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse all categories
              </p>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Found {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
              </div>
              
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{faq.question}</h3>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <Icon
                      name={expandedItems.has(index) ? 'AiOutlineMinus' : 'AiOutlinePlus'}
                      className="h-5 w-5 text-gray-500 ml-4"
                    />
                  </button>
                  
                  {expandedItems.has(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+91-70023-30896"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Icon name="AiOutlinePhone" className="h-4 w-4 mr-2" />
              Call Us: +91-70023-30896
            </a>
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Icon name="AiOutlineMail" className="h-4 w-4 mr-2" />
              Send Message
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
