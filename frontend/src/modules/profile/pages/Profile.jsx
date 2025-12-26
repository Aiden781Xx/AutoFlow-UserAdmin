import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';
import ProfileForm from '../components/ProfileForm';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/me');
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await api.put('/api/user/me', formData);
      setUser(response.data.user);
      setError('');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">My Profile</h1>
          <p className="text-gray-600 mb-8">
            Email: {user?.email} (cannot be changed)
          </p>

          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger p-4 rounded mb-6">
              {error}
            </div>
          )}

          <ProfileForm user={user} onSubmit={handleUpdateProfile} />
        </div>
      </div>
    </div>
  );
}
