import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CreditDisplay from '../components/CreditDisplay';
import SavedFeeds from '../components/SavedFeeds';

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    const awardDailyCredits = async () => {
      if (!user) return;
      
      try {
        // Check if already awarded credits today
        const creditsRes = await axios.get('/api/credits', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        const today = new Date().toDateString();
        const lastAward = creditsRes.data.transactions
          .find(t => t.reason === 'daily_login' && 
            new Date(t.date).toDateString() === today);
        
        if (lastAward) return;
  
        // Award credits
        await axios.post('/api/credits/add', {
          amount: 10,
          reason: 'daily_login'
        }, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      } catch (err) {
        console.error('Credit award error:', err.response?.data || err.message);
      }
    };
  
    awardDailyCredits();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <CreditDisplay />
      </div>
      <div className="md:col-span-2">
        <SavedFeeds />
      </div>
    </div>
  );
}