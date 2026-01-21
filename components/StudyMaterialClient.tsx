'use client';

import { useState, useEffect } from 'react';
import {
  uploadStudyMaterial,
  getStudyMaterialsByTeacher,
  deleteStudyMaterial,
  getClassesForTeacher,
} from '@/actions/faculty';
import { FileText, Plus, Trash2, Download, ExternalLink } from 'lucide-react';
import CustomToast from './CustomToast';

export default function StudyMaterialClient({
  teacherId,
  isTeacher,
  studentClassIds,
}: {
  teacherId?: string;
  isTeacher: boolean;
  studentClassIds?: string[];
}) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as any,
    isVisible: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    classId: '',
    teacherId: teacherId || '',
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    if (isTeacher && teacherId) {
      const [m, c] = await Promise.all([
        getStudyMaterialsByTeacher(teacherId),
        getClassesForTeacher(teacherId),
      ]);
      setMaterials(m);
      setClasses(c);
    } else if (studentClassIds) {
      // Fetch for student
      const { getStudyMaterialsForStudent } = await import('@/actions/student');
      const m = await getStudyMaterialsForStudent(studentClassIds);
      setMaterials(m);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await uploadStudyMaterial(formData);
    if (res.error) {
      setToast({ message: res.error, type: 'error', isVisible: true });
    } else {
      setToast({
        message: 'Material uploaded successfully',
        type: 'success',
        isVisible: true,
      });
      setShowAdd(false);
      setFormData({
        ...formData,
        title: '',
        description: '',
        fileUrl: '',
        classId: '',
      });
      refreshData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      await deleteStudyMaterial(id);
      setToast({
        message: 'Material deleted',
        type: 'success',
        isVisible: true,
      });
      refreshData();
    }
  };

  return (
    <div className='p-6'>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-3xl font-extrabold text-slate-900'>
            Study Materials
          </h1>
          <p className='text-slate-500 font-medium'>
            Access and manage PDF resources for your courses.
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100'
          >
            {showAdd ? (
              'Cancel'
            ) : (
              <>
                <Plus className='h-5 w-5' />
                Upload Material
              </>
            )}
          </button>
        )}
      </div>

      {showAdd && isTeacher && (
        <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-10 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300'>
          <h2 className='text-xl font-bold text-slate-900 mb-6'>
            Upload New PDF
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-bold text-slate-500 uppercase mb-1 ml-1'>
                  Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g. Advanced Calculus Lecture Notes'
                  className='w-full p-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-xs font-bold text-slate-500 uppercase mb-1 ml-1'>
                  Target Class
                </label>
                <select
                  required
                  className='w-full p-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 transition-all font-bold'
                  value={formData.classId}
                  onChange={(e) =>
                    setFormData({ ...formData, classId: e.target.value })
                  }
                >
                  <option value=''>Select Class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 ml-1'>
                PDF URL
              </label>
              <input
                type='url'
                required
                placeholder='https://example.com/file.pdf'
                className='w-full p-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium'
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 ml-1'>
                Description
              </label>
              <textarea
                placeholder='Brief summary for students...'
                className='w-full p-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium'
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50'
            >
              {loading ? 'Processing...' : 'Confirm Upload'}
            </button>
          </form>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {materials.length === 0 ? (
          <div className='col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200'>
            <FileText className='h-12 w-12 text-slate-300 mx-auto mb-4' />
            <p className='text-slate-500 font-bold'>
              No study materials found.
            </p>
          </div>
        ) : (
          materials.map((m) => (
            <div
              key={m._id}
              className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='bg-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition-transform'>
                  <FileText className='h-6 w-6 text-indigo-600' />
                </div>
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(m._id)}
                    className='text-rose-200 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                )}
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-1 truncate'>
                {m.title}
              </h3>
              <p className='text-xs font-bold text-indigo-600 mb-2'>
                Class: {m.classId?.grade || 'General'}
              </p>
              <p className='text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]'>
                {m.description || 'No description provided.'}
              </p>
              <a
                href={m.fileUrl}
                target='_blank'
                className='flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all'
              >
                <Download className='h-4 w-4' />
                View PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
