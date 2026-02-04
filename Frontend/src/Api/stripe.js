// Stripe payment processing
// Uses backend API endpoints for payment processing

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const processPayment = async (paymentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/processPayment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        return await response.json();
    } catch (error) {
        console.error('Payment processing error:', error);
        return {
            success: false,
            error: 'An error occurred while processing the payment. Please try again.'
        };
    }
};

export const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const response = await fetch(`${API_BASE_URL}/createPaymentIntent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: 'Failed to create payment intent'
        };
    }
};

export const getPaymentMethods = async () => {
    return {
        success: true,
        paymentMethods: ['card'] // Currently only supporting card payments
    };
};
