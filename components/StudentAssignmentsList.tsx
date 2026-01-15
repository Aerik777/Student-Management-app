'use client';

import { useState, useEffect } from 'react';
import {
  getAssignmentsForStudent,
  submitAssignment,
  getStudentSubmissions,
} from '@/actions/student';

export default function StudentAssignmentsList({
  studentId,
  classIds,
}: {
  studentId: string;
  classIds: string[];
}) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classIds && classIds.length > 0) refreshData();
  }, [classIds]);

  const refreshData = async () => {
    const [a, s] = await Promise.all([
      getAssignmentsForStudent(classIds),
      getStudentSubmissions(studentId),
    ]);
    setAssignments(a);
    setSubmissions(s);
  };

  const handleUpload = async (assignmentId: string, fileUrl: string) => {
    setLoading(true);
    await submitAssignment({
      studentId,
      questioneid: assignmentId,
      file: fileUrl,
      status: 'pending',
    });
    refreshData();
    setLoading(false);
  };

  if (!classIds || classIds.length === 0)
    return <div className='p-6'>You are not assigned to any class yet.</div>;

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6 text-slate-900'>
        Course Assignments
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {assignments.map((a) => {
          const submission = submissions.find(
            (s) => s.questioneid._id === a._id
          );
          const isRejected = submission?.status === 'rejected';

          return (
            <div
              key={a._id}
              className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                submission
                  ? isRejected
                    ? 'border-red-500'
                    : 'border-green-500'
                  : 'border-blue-500'
              }`}
            >
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-bold text-slate-900'>{a.title}</h3>
                {submission && (
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${
                      submission.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.status.toUpperCase()}
                  </span>
                )}
              </div>
              <p className='text-sm text-slate-700 font-medium mb-4'>
                Instructor: {a.teacherId?.name}
              </p>
              <p className='text-xs text-red-600 mb-4 font-bold'>
                Due Date: {new Date(a.submission_date).toLocaleDateString()}
              </p>

              {/* Show Remarks if Rejected */}
              {isRejected && submission.remarks && (
                <div className='mb-4 bg-red-50 p-3 rounded text-sm text-red-800 border border-red-200'>
                  <span className='font-bold block mb-1'>Teacher Remarks:</span>
                  {submission.remarks}
                </div>
              )}

              {!submission || isRejected ? (
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-slate-900 block'>
                    {isRejected ? 'Resubmit PDF File' : 'Upload PDF File'}
                  </label>
                  <input
                    type='file'
                    accept='.pdf'
                    className='w-full text-sm p-2 border border-slate-300 rounded text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleUpload(a._id, reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {loading && (
                    <p className='text-xs text-blue-600 mt-1 font-semibold'>
                      {isRejected ? 'Resubmitting...' : 'Uploading...'}
                    </p>
                  )}
                </div>
              ) : (
                <a
                  href={submission.file}
                  target='_blank'
                  className='text-sm text-blue-600 hover:underline font-bold'
                >
                  View My Submission
                </a>
              )}
            </div>
          );
        })}
      </div>
      {assignments.length === 0 && (
        <p className='text-slate-500 font-medium mt-8 text-center'>
          No assignments posted for your class.
        </p>
      )}
    </div>
  );
}
