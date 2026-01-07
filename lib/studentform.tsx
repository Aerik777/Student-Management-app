"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormValues } from "@/lib/validations";
import { createStudent } from "@/lib/actions";
import { useState } from "react";

export default function StudentForm() {
  const [msg, setMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data: StudentFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      await createStudent(formData);
      setMsg("Student registered successfully!");
      reset();
    } catch (err) {
      setMsg("Error registering student.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold border-b pb-2">Register New Student</h2>
      
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input {...register("name")} className="w-full border p-2 rounded mt-1" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input {...register("email")} className="w-full border p-2 rounded mt-1" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Roll Number</label>
          <input {...register("rollNumber")} className="w-full border p-2 rounded mt-1" />
          {errors.rollNumber && <p className="text-red-500 text-xs">{errors.rollNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <select {...register("department")} className="w-full border p-2 rounded mt-1">
            <option value="">Select...</option>
            <option value="CS">Computer Science</option>
            <option value="EE">Electrical</option>
            <option value="ME">Mechanical</option>
          </select>
          {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
        </div>
      </div>

      <button 
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Processing..." : "Register Student"}
      </button>

      {msg && <p className="text-center text-sm font-semibold mt-2">{msg}</p>}
    </form>
  );
}