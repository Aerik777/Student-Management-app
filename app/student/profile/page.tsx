import IDCard from "@/components/IDCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // In a real app, fetch these details from your MongoDB 'Student' collection
  const studentData = {
    name: session?.user?.name || "Student Name",
    rollNumber: "CS2026-001",
    department: "Computer Science"
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Your Digital ID Card</h1>
      <IDCard student={studentData} />
    </div>
  );
}