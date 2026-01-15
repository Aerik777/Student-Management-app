'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateUser, getClasses } from '@/actions/admin';
import ClassMultiSelect from '@/components/ClassMultiSelect';
import User from '@/models/user'; // This won't work on client side directly if imported from models

// We need an action to fetch a single user
// I'll check if it's in actions/admin.ts. If not, I'll add it or use a separate endpoint.
// For now, I'll assume I need to add getUserById to actions/admin.ts

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    contact_no: '',
    address: '',
    classIds: [] as string[],
    rollNumber: '',

    qualification: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const classesData = await getClasses();
        setClasses(classesData);

        // Fetch user data via a new action I will create
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'STUDENT',
          contact_no: userData.contact_no || '',
          address: userData.address || '',
          classIds: userData.classIds || [],
          rollNumber: userData.rollNumber || '',

          qualification: userData.qualification || '',
        });
      } catch (error) {
        console.error(error);
        alert('Error loading user data');
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(userId, formData);
      router.push('/admin/users');
    } catch (error) {
      console.error(error);
      alert('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className='p-10 text-center font-bold text-slate-900'>
        Loading user data...
      </div>
    );

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-slate-200'>
      <h1 className='text-2xl font-bold text-slate-950 mb-6'>
        Edit User: {formData.name}
      </h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              required
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
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
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
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
              Role
            </label>
            <select
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600 bg-white'
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
          <div>
            <label className='block text-sm font-bold text-slate-900 mb-1'>
              Contact No
            </label>
            <input
              type='text'
              className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
              value={formData.contact_no}
              onChange={(e) =>
                setFormData({ ...formData, contact_no: e.target.value })
              }
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='col-span-2'>
            <label className='block text-sm font-bold text-slate-900 mb-2'>
              Assigned Classes (Students & Faculty)
            </label>
            <div className='bg-slate-50 p-4 rounded-lg border border-slate-200'>
              <ClassMultiSelect
                classes={classes}
                selected={formData.classIds}
                onChange={(ids: string[]) =>
                  setFormData({ ...formData, classIds: ids })
                }
              />
            </div>
            {classes.length === 0 && (
              <p className='text-xs text-slate-500 mt-2 italic'>
                No classes available. Create some in "Manage Classes" first.
              </p>
            )}
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
                className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
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

        <div>
          <label className='block text-sm font-bold text-slate-900 mb-1'>
            Address
          </label>
          <textarea
            rows={3}
            className='w-full p-2 border border-slate-400 rounded text-slate-900 font-medium outline-none focus:border-indigo-600'
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
            className='px-6 py-2 text-slate-900 font-bold hover:text-black border border-slate-300 rounded-lg'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-300 shadow-md'
          >
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
}
