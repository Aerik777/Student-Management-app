'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      alert('Registration Successful! Redirecting to login...');
      router.push('/login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        .reg-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 15px; }
        button:hover { background: #059669; }
        .link { display: block; text-align: center; margin-top: 15px; color: #4f46e5; text-decoration: none; font-size: 0.9rem; }
      `}</style>

      <div className='reg-card'>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Full Name'
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type='email'
            placeholder='Email'
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type='password'
            placeholder='Password'
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <label style={{ fontSize: '0.8rem', color: '#666' }}>
            Register as:
          </label>
          <select
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value='STUDENT'>Student</option>
            <option value='FACULTY'>Faculty</option>
            <option value='ADMIN'>Admin</option>
          </select>

          <button type='submit' disabled={loading}>
            {loading ? 'Saving...' : 'Register'}
          </button>
          <a href='/login' className='link'>
            Already have an account? Login
          </a>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif',
  },
} as const;
