'use client';

import { useState, useEffect } from 'react';
import { getClasses, createClass, deleteClass } from '@/actions/admin';
import { BookOpen, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomToast from '@/components/CustomToast';

export default function ManageClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [newGrade, setNewGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    const data = await getClasses();
    setClasses(data);
  }

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newGrade.trim()) return;

    setLoading(true);
    try {
      await createClass(newGrade);
      setNewGrade('');
      setToast({
        message: 'Class created successfully',
        type: 'success',
        isVisible: true,
      });
      await loadClasses();
    } catch (error) {
      console.error(error);
      setToast({
        message: 'Error creating class. It might already exist.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await deleteClass(id);
      setToast({
        message: 'Class deleted successfully',
        type: 'success',
        isVisible: true,
      });
      setConfirmDelete(null);
      await loadClasses();
    } catch (error) {
      console.error(error);
      setToast({
        message: 'Failed to delete class',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <header className='mb-10'>
        <h1 className='text-3xl font-bold text-slate-950 mb-2'>
          Manage Classes
        </h1>
        <p className='text-slate-800 font-medium italic'>
          Create and organize school grades and sections.
        </p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Create Class Form */}
        <div className='md:col-span-1'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200'>
            <h2 className='text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
              <Plus className='h-5 w-5' />
              New Class
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-bold text-slate-900 mb-1'>
                  Grade / Class Name
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g. Grade 10-A'
                  className='w-full p-2.5 border border-slate-400 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none'
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                />
              </div>
              <Button
                type='submit'
                disabled={loading}
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold'
              >
                {loading ? 'Creating...' : 'Create Class'}
              </Button>
            </form>
          </div>
        </div>

        {/* Classes List */}
        <div className='md:col-span-2'>
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
            <div className='p-4 border-b bg-slate-50'>
              <h2 className='font-bold text-slate-900 flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-indigo-600' />
                Existing Classes ({classes.length})
              </h2>
            </div>
            <div className='divide-y divide-slate-100'>
              {classes.length === 0 ? (
                <div className='p-10 text-center text-slate-800 font-medium italic'>
                  No classes created yet.
                </div>
              ) : (
                classes.map((cls) => (
                  <div
                    key={cls._id}
                    className='p-4 flex items-center justify-between hover:bg-slate-50 transition-colors'
                  >
                    <div>
                      <span className='text-lg font-bold text-slate-900'>
                        {cls.grade}
                      </span>
                      <p className='text-xs text-slate-700 font-medium'>
                        Created on{' '}
                        {new Date(cls.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(cls._id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title='Delete Class'
                    >
                      <Trash2 className='h-5 w-5' />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200'>
            <div className='flex items-center gap-3 text-red-600 mb-4'>
              <AlertTriangle className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Class?</h3>
            </div>
            <p className='text-slate-600 text-sm mb-6 leading-relaxed'>
              Are you sure you want to delete this class? This will also remove
              the class reference from all students and faculty assigned to it.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setConfirmDelete(null)}
                className='px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                disabled={loading}
                className='px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50'
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
