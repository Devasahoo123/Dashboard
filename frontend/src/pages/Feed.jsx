import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FeedItem from '../components/FeedItem';

export default function Feed() {
  const { user } = useAuth();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const [twitterRes, redditRes] = await Promise.all([
          axios.get('/api/feed/twitter', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          }),
          axios.get('/api/feed/reddit', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          })
        ]);

        const combinedFeeds = [
          ...twitterRes.data.map(item => ({ ...item, type: 'twitter' })),
          ...redditRes.data.map(item => ({ ...item, type: 'reddit' }))
        ].sort(() => Math.random() - 0.5);

        setFeeds(combinedFeeds);
      } catch (err) {
        console.error('Error fetching feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchFeeds();
  }, [user]);

  const handleSave = async (item) => {
    try {
      await axios.post('/api/feed/save', {
        itemId: item.id,
        source: item.type,
        title: item.text || item.title,
        url: item.url
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      // Award credits for interaction
      await axios.post('/api/credits/add', {
        userId: user.id,
        amount: 5,
        reason: 'content_interaction'
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const filteredFeeds = activeTab === 'all' 
    ? feeds 
    : feeds.filter(item => item.type === activeTab);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-indigo-500' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'twitter' ? 'border-b-2 border-indigo-500' : ''}`}
          onClick={() => setActiveTab('twitter')}
        >
          Twitter
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'reddit' ? 'border-b-2 border-indigo-500' : ''}`}
          onClick={() => setActiveTab('reddit')}
        >
          Reddit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeeds.map((item, index) => (
            <FeedItem key={index} item={item} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}