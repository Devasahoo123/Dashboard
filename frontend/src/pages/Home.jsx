import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to Creator Dashboard</h1>
      <p className="text-xl mb-8">Manage your profile, earn credits, and discover content</p>
      {user ? (
        <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Login
          </Link>
          <Link to="/register" className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}