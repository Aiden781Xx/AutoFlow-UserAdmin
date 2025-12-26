import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../modules/auth/services/auth.api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch (err) {
        localStorage.clear();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logoutUser(refreshToken);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">AuthFlow</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-danger text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-secondary mb-6">
            Welcome, {user?.name}!
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-lg font-medium text-secondary">{user?.email}</p>
            </div>

            {user?.avatar && (
              <div>
                <p className="text-gray-600">Avatar</p>
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-16 h-16 rounded"
                />
              </div>
            )}

            <div>
              <p className="text-gray-600">Provider</p>
              <p className="text-lg font-medium capitalize text-secondary">
                {user?.provider}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
