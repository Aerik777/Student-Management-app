"use client";

import { useOptimistic } from "react";
import { updateAttendance } from "@/lib/actions";

export function AttendanceButton({ id, initialStatus }: { id: string, initialStatus: string }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    initialStatus,
    (state, newStatus: string) => newStatus
  );

  const handleToggle = async () => {
    const nextStatus = optimisticStatus === "Present" ? "Absent" : "Present";
    
    // 1. Update UI instantly
    setOptimisticStatus(nextStatus);
    
    // 2. Sync with database
    await updateAttendance(id, nextStatus);
  };

  return (
    <button onClick={handleToggle} className="transition-all duration-200">
      {optimisticStatus}
    </button>
  );
}