'use client';

import { useState, useEffect } from 'react';
import {
  getAssignmentsByTeacher,
  createAssignment,
  getClassesForTeacher,
} from '@/actions/faculty';

export default function FacultyAssignmentsClient({
  teacherId,
}: {
  teacherId: string;
}) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    assigned_class_id: '',
    submission_date: '',
    teacherId: teacherId,
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const [a, c] = await Promise.all([
      getAssignmentsByTeacher(teacherId),
      getClassesForTeacher(teacherId),
    ]);
    setAssignments(a);
    setClasses(c);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment(formData);
    setShowAdd(false);
    refreshData();
  };

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState<{ [key: string]: string }>(
    {}
  );

  const handleViewSubmissions = async (assignmentId: string) => {
    setLoadingSubmissions(true);
    // Find the assignment object to set selected
    const assignment = assignments.find((a) => a._id === assignmentId);
    setSelectedAssignment(assignment);

    // Fetch submissions
    const { getSubmissions } = await import('@/actions/faculty');
    const subs = await getSubmissions(assignmentId);
    setSubmissions(subs);
    setLoadingSubmissions(false);
  };

  const handleStatusUpdate = async (submissionId: string, status: string) => {
    const { updateSubmissionStatus } = await import('@/actions/faculty');
    const remarks =
      status === 'rejected' ? rejectRemarks[submissionId] : undefined;
    await updateSubmissionStatus(submissionId, status, remarks);

    // Refresh local list
    setSubmissions((prev) =>
      prev.map((s) => (s._id === submissionId ? { ...s, status, remarks } : s))
    );
  };

  return (
    <div className='p-6 relative'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-slate-950'>
          Manage Assignments
        </h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className='bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700'
        >
          {showAdd ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded-lg shadow-md mb-8 space-y-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-900 mb-1'>
                Title
              </label>
              <input
                type='text'
                required
                className='w-full p-2 border border-slate-300 rounded text-slate-900'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-900 mb-1'>
                Due Date
              </label>
              <input
                type='date'
                required
                className='w-full p-2 border border-slate-300 rounded text-slate-900'
                value={formData.submission_date}
                onChange={(e) =>
                  setFormData({ ...formData, submission_date: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-900 mb-1'>
              Assigned Class
            </label>
            <select
              required
              className='w-full p-2 border rounded'
              value={formData.assigned_class_id}
              onChange={(e) =>
                setFormData({ ...formData, assigned_class_id: e.target.value })
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
          <button
            type='submit'
            className='bg-emerald-600 text-white px-6 py-2 rounded'
          >
            Create
          </button>
        </form>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {assignments.map((a) => (
          <div
            key={a._id}
            className='bg-white p-6 rounded-lg shadow border-l-4 border-emerald-500'
          >
            <h3 className='text-lg font-bold text-slate-900'>{a.title}</h3>
            <p className='text-sm text-slate-700 font-medium'>
              Class: {(a.assigned_class_id as any)?.grade}
            </p>
            <p className='text-sm text-slate-700 font-medium'>
              Due: {new Date(a.submission_date).toLocaleDateString()}
            </p>
            <div className='mt-4 flex gap-2'>
              <button
                onClick={() => handleViewSubmissions(a._id)}
                className='text-sm text-emerald-600 font-semibold hover:underline'
              >
                View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions Modal */}
      {selectedAssignment && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col'>
            <div className='p-4 border-b flex justify-between items-center bg-gray-50'>
              <h3 className='font-bold text-lg text-slate-900'>
                Submissions for {selectedAssignment.title}
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className='text-slate-500 hover:text-slate-700'
              >
                ✕
              </button>
            </div>

            <div className='p-6 overflow-y-auto flex-1'>
              {loadingSubmissions ? (
                <div className='text-center py-8'>Loading...</div>
              ) : submissions.length === 0 ? (
                <div className='text-center py-8 text-slate-500'>
                  No submissions yet.
                </div>
              ) : (
                <table className='w-full text-sm text-left'>
                  <thead className='bg-gray-50 text-slate-700 font-bold'>
                    <tr>
                      <th className='p-3'>Student</th>
                      <th className='p-3'>Date</th>
                      <th className='p-3'>File</th>
                      <th className='p-3'>Status</th>
                      <th className='p-3'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y'>
                    {submissions.map((sub) => (
                      <tr key={sub._id}>
                        <td className='p-3 font-medium text-slate-900'>
                          {(sub.studentId as any)?.name}
                        </td>
                        <td className='p-3 text-slate-600'>
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </td>
                        <td className='p-3'>
                          <a
                            href={sub.file}
                            target='_blank'
                            className='text-blue-600 hover:underline font-medium'
                          >
                            View PDF
                          </a>
                        </td>
                        <td className='p-3'>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              sub.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : sub.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </td>
                        <td className='p-3'>
                          <div className='flex flex-col gap-2'>
                            <div className='flex gap-2'>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(sub._id, 'accepted')
                                }
                                className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs'
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(sub._id, 'rejected')
                                }
                                className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs'
                              >
                                Reject
                              </button>
                            </div>
                            <input
                              type='text'
                              placeholder='Remarks (if rejecting)...'
                              className='border rounded px-2 py-1 text-xs w-full mt-1 text-slate-900'
                              value={rejectRemarks[sub._id] || ''}
                              onChange={(e) =>
                                setRejectRemarks((prev) => ({
                                  ...prev,
                                  [sub._id]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
