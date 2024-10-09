import React, { useState, useEffect } from 'react';

const Subscriptions = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subscription/${user.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();

        if (response.ok) {
          setSubscription(data);
        } else {
          setError(data.error || 'Failed to fetch subscription details.');
        }
      } catch (err) {
        setError('Error fetching subscription.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user.id]);

  const handleSubscribe = async () => {
    const sessionId = 'your-session-id'; // Get the session ID from your context or state

    const response = await fetch('http://localhost:5000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ userId: user.id, sessionId }),
    });

    if (response.ok) {
      setMessage('Subscription successful!');
      setSubscription((prev) => [...prev, sessionId]); // Update state
    } else {
      setMessage('Subscription failed.');
    }
  };

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {subscription && subscription.length === 0 && <p>No active subscriptions.</p>}
      <button onClick={handleSubscribe}>Subscribe to New Session</button>
      {message && <p>{message}</p>}
      <ul>
        {subscription && subscription.map((sub) => (
          <li key={sub}>{sub}</li> // Display subscriptions
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
