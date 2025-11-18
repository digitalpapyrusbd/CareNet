const fetch = require('node-fetch');

async function testRegistration() {
  console.log('Testing registration with demo guardian data...');
  
  const demoData = {
    name: 'Demo Guardian',
    email: 'guardian@demo.com',
    phone: '01712345678',
    password: 'DemoPass123',
    confirmPassword: 'DemoPass123',
    agreeToTerms: true,
    role: 'GUARDIAN',
    address: '123 Demo Street, Dhaka, Bangladesh',
    emergencyContact: '0187654321'
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('Response:', result);
      
      if (result.requiresOTP) {
        console.log('📱 OTP should be sent to:', demoData.phone);
        console.log('🔢 Demo OTP code: 1234');
        
        // Test OTP verification
        const otpResponse = await fetch('http://localhost:3000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: demoData.phone,
            otp: '1234'
          }),
        });
        
        const otpResult = await otpResponse.json();
        
        if (otpResponse.ok) {
          console.log('✅ OTP verification successful!');
          console.log('Response:', otpResult);
        } else {
          console.log('❌ OTP verification failed');
          console.log('Error:', await otpResponse.json());
        }
      }
    } else {
      console.log('❌ Registration failed');
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testRegistration();