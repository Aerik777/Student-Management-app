"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/dashboard">Dashboard</Link>
      
      {role === "ADMIN" && (
        <>
          <Link href="/admin/students">Manage Students</Link>
          <Link href="/admin/faculty">Manage Faculty</Link>
        </>
      )}

      {(role === "ADMIN" || role === "FACULTY") && (
        <Link href="/attendance">Mark Attendance</Link>
      )}

      {role === "STUDENT" && (
        <Link href="/student/grades">View My Grades</Link>
      )}
    </nav>
  );
}