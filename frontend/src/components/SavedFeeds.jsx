import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SavedFeeds() {
  const { user } = useAuth();
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedFeeds = async () => {
      try {
        const res = await axios.get('/api/feed/saved', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setSavedFeeds(res.data);
      } catch (err) {
        console.error('Error fetching saved feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSavedFeeds();
  }, [user]);

  if (loading) return <div>Loading saved feeds...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Saved Content</h2>
      {savedFeeds.length === 0 ? (
        <p className="text-gray-500">You haven't saved any content yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedFeeds.map((feed) => (
            <li key={feed._id} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium">{feed.title}</h3>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  feed.source === 'twitter' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {feed.source}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(feed.savedAt).toLocaleDateString()}
                </span>
              </div>
              <a
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
              >
                View Original
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}