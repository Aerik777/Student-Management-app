'use client';

import { approveUser, deleteUser } from '@/actions/admin';
import { useState } from 'react';
import CustomToast from './CustomToast';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function UserApprovalButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveUser(userId);
      setToast({
        message: 'User approved successfully',
        type: 'success',
        isVisible: true,
      });
    } catch (error) {
      setToast({
        message: 'Failed to approve user',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await deleteUser(userId);
      setToast({
        message: 'User registration rejected and account deleted',
        type: 'success',
        isVisible: true,
      });
      setConfirmDelete(false);
    } catch (error) {
      setToast({
        message: 'Failed to delete user account',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center gap-2'>
        <button
          onClick={handleApprove}
          disabled={loading}
          className='flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors font-bold disabled:opacity-50'
        >
          <Check className='h-3 w-3' />
          Approve
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className='flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-bold border border-red-200 disabled:opacity-50'
        >
          <X className='h-3 w-3' />
          Reject
        </button>
      </div>

      {/* Custom Confirmation Modal */}
      {confirmDelete && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200'>
            <div className='flex items-center gap-3 text-red-600 mb-4'>
              <AlertTriangle className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Account?</h3>
            </div>
            <p className='text-slate-600 text-sm mb-6 leading-relaxed'>
              Are you sure you want to reject this registration? The user
              account will be permanently deleted.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setConfirmDelete(false)}
                className='px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className='px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50'
              >
                {loading ? 'Deleting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
}
