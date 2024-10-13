import React, { useState, useEffect } from 'react';

const Subscriptions = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subscription/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();

        if (response.ok) {
          setSubscriptions(data.subscriptions);
          checkIfExpired(data.subscriptions); // Check expiration status
        } else {
          setError(data.error || 'Failed to fetch subscription details.');
        }
      } catch (err) {
        setError('Error fetching subscription.');
      } finally {
        setLoading(false);
      }
    };

    const checkIfExpired = (subscriptions) => {
      const currentDate = new Date();
      const endDate = new Date(subscriptions.endDate);
      setIsExpired(currentDate > endDate);
    };

    fetchSubscriptions();
  }, [user.id]);

  const handleRenew = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/subscription/upgrade/${user.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Subscription renewed successfully!');
        setSubscriptions(data.subscription);
        setIsExpired(false); // Reset expired status after renewal
      } else {
        setMessage('Renewal failed.');
      }
    } catch (error) {
      setMessage('Error during subscription renewal.');
    }
  };

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {subscriptions.length === 0 && <p>No active subscriptions.</p>}
      {isExpired && <p style={{ color: 'red' }}>Your subscription has expired. Please renew.</p>}
      <button onClick={handleRenew} disabled={!isExpired}>Renew Subscription</button>
      {message && <p>{message}</p>}
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub}>{sub}</li>
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
