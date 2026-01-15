'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, getClasses } from '@/actions/admin';
import ClassMultiSelect from '@/components/ClassMultiSelect';

export default function AddUserPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    contact_no: '',
    address: '',
    classIds: [] as string[],
    rollNumber: '',

    qualification: '',
  });

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      router.push('/admin/users');
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md'>
      <h1 className='text-2xl font-bold text-slate-950 mb-6'>Add New User</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              required
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Email
            </label>
            <input
              type='email'
              required
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Password
            </label>
            <input
              type='password'
              required
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Role
            </label>
            <select
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium'
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value='STUDENT'>Student</option>
              <option value='FACULTY'>Faculty</option>
              <option value='ADMIN'>Admin</option>
            </select>
          </div>
        </div>

        {formData.role === 'STUDENT' && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-bold text-slate-900 mb-1'>
                Roll Number
              </label>
              <input
                type='text'
                required
                className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none'
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {formData.role === 'FACULTY' && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-bold text-slate-900 mb-1'>
                Qualification
              </label>
              <input
                type='text'
                required
                className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
              />
            </div>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <div className='col-span-2'>
            <label className='block text-sm font-bold text-slate-900 mb-2'>
              Assigned Classes (Students & Faculty)
            </label>
            <div className='bg-slate-50 p-4 rounded-lg border border-slate-200'>
              <ClassMultiSelect
                classes={classes}
                selected={formData.classIds}
                onChange={(ids) => setFormData({ ...formData, classIds: ids })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className='block text-sm font-bold text-slate-900 mb-1'>
            Address
          </label>
          <textarea
            className='w-full p-2 border border-slate-300 rounded text-slate-900'
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className='pt-4 flex justify-end gap-4'>
          <button
            type='button'
            onClick={() => router.back()}
            className='px-4 py-2 text-gray-600 hover:text-gray-800'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300'
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
