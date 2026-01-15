import connectDB from '@/lib/db';
import { Book, Issue } from '@/models/library';
import Student from '@/models/student';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudentLibrary() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className='p-8'>
        <h1 className='text-2xl font-bold text-slate-950 mb-6'>
          My Borrowed Books
        </h1>
        <p className='text-slate-700 font-semibold'>
          Please log in to view your books.
        </p>
      </div>
    );
  }
  const myBooks = await Issue.find({
    studentId: session?.user?.id,
    status: 'Issued',
  })
    .populate('bookId')
    .lean();

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold text-slate-950 mb-6'>
        My Borrowed Books
      </h1>
      <div className='grid gap-4'>
        {myBooks.map((record: any) => {
          const isOverdue = new Date() > new Date(record.dueDate);
          return (
            <div
              key={record._id}
              className='bg-white p-4 rounded-lg shadow border flex justify-between items-center'
            >
              <div>
                <h3 className='font-bold text-lg'>{record.bookId.title}</h3>
                <p className='text-slate-700 text-sm font-medium'>
                  Issued on: {new Date(record.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className='text-right'>
                <p
                  className={`text-sm font-semibold ${
                    isOverdue ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  Due: {new Date(record.dueDate).toLocaleDateString()}
                </p>
                {isOverdue && (
                  <span className='text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded'>
                    OVERDUE
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {myBooks.length === 0 && (
          <p className='text-slate-700 font-semibold'>
            You haven't borrowed any books yet.
          </p>
        )}
      </div>
    </div>
  );
}
