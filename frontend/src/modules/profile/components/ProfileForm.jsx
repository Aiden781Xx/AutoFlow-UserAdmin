import { useState } from 'react';

export default function ProfileForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.avatar.trim()) {
      setError('Avatar URL is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          Avatar URL
        </label>
        <input
          type="url"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          placeholder="https://example.com/avatar.jpg"
        />
        {formData.avatar && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="w-32 h-32 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128?text=Invalid+URL';
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-danger bg-opacity-10 border border-danger text-danger p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
