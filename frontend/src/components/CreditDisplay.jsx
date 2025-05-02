import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreditDisplay() {
  const { user } = useAuth();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get('/api/credits', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setCredits(res.data);
      } catch (err) {
        console.error('Error fetching credits:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCredits();
  }, [user]);

  if (loading) return <div>Loading credits...</div>;
  if (!credits) return <div>No credit data available</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Credits</h2>
      <div className="text-3xl font-bold mb-2">{credits.balance}</div>
      <div className="text-gray-600 mb-4">Total points earned</div>
      
      <h3 className="font-medium mb-2">Recent Transactions</h3>
      <ul className="space-y-2">
        {credits.transactions.slice(0, 5).map((tx, index) => (
          <li key={index} className="flex justify-between">
            <span>{tx.reason.replace(/_/g, ' ')}</span>
            <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
              {tx.amount > 0 ? '+' : ''}{tx.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}