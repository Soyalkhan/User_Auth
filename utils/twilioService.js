// /utils/twilioService.js
const twilio = require('twilio');

// Twilio config (replace with your actual credentials)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send OTP via SMS
const sendOTP = (phone, otp) => {
    // Add the country code before the phone number (for example, +91 for India)
    const countryCode = '+91'; 
    const userNumberWithCountryCode = countryCode.concat(phone);
// console.log(userNumberWithCountryCode);// debug to check added +91 or not 

    return client.messages.create({
        body: `@DDC : <br> Your Link tree verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: userNumberWithCountryCode, // Use the phone number with the country code
    });
};

module.exports = { sendOTP };
