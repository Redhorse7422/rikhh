const fetch = require('node-fetch');

// Fast2SMS configuration
const API_KEY = '3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND';
const BASE_URL = 'https://www.fast2sms.com/dev/bulkV2';
const SENDER_ID = 'WORCVZ';

async function testFast2SMS() {
  try {
    console.log('Testing Fast2SMS API...');
    
    // Test phone number (replace with a real number for testing)
    const testPhoneNumber = '9999999999'; // Replace with actual test number
    const testOTP = '123456';
    
    // Test POST method
    console.log('\n1. Testing POST method...');
    const postResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'dlt',
        sender_id: SENDER_ID,
        message: '177690',
        variables_values: testOTP,
        numbers: testPhoneNumber,
        flash: 0
      })
    });
    
    const postResult = await postResponse.json();
    console.log('POST Response:', postResult);
    
    // Test GET method
    console.log('\n2. Testing GET method...');
    const params = new URLSearchParams({
      authorization: API_KEY,
      route: 'dlt',
      sender_id: SENDER_ID,
      message: '177690',
      variables_values: testOTP,
      numbers: testPhoneNumber,
      flash: '0'
    });
    
    const getResponse = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: 'GET'
    });
    
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult);
    
    console.log('\nTest completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testFast2SMS(); 