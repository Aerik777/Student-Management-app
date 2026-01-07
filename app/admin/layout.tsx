import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <aside className="w-64 bg-indigo-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">College ERP</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-indigo-300">Dashboard</a>
          <a href="/admin/students" className="block hover:text-indigo-300">Manage Students</a>
          <a href="/admin/courses" className="block hover:text-indigo-300">Courses</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}