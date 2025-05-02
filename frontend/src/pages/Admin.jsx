import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/credits/all', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((userCredit) => (
              <tr key={userCredit._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{userCredit.userId.username}</div>
                      <div className="text-sm text-gray-500">{userCredit.userId.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {userCredit.balance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleAddCredits(userCredit.userId._id, 10)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Add 10
                  </button>
                  <button
                    onClick={() => handleAddCredits(userCredit.userId._id, -10)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove 10
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  async function handleAddCredits(userId, amount) {
    try {
      await axios.post('/api/credits/add', {
        userId,
        amount,
        reason: 'admin_adjustment'
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      // Refresh data
      const res = await axios.get('/api/credits/all', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error adding credits:', err);
    }
  }
}