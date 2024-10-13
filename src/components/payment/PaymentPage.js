import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';  // Import the CSS file

const PaymentPage = () => {
  const location = useLocation();  // Get the current location
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set session name from location state if available
  useEffect(() => {
    if (location.state && location.state.sessionName) {
      setSessionName(location.state.sessionName);
    }
  }, [location.state]);

  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!sessionName) {
      setError('Please select a session to pay for.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ sessionId: sessionName }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
  
      const { id } = await response.json();
  
      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${id}`;
      
      // Optionally navigate to another page after payment (uncomment if needed)
      // navigate('/payment-success');
    } catch (error) {
      setError('Error during payment. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="payment-page">
      <h2>Payment Page</h2>
      <form onSubmit={handlePayment}>
        <div>
          <label htmlFor="session">Session Name:</label>
          <input
            type="text"
            id="session"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PaymentPage;
