"use client";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import TaskBoard from "@/components/TaskBoard";
import AdminControls from "@/components/AdminControls";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-4">
      {user?.user?.role === "admin" && (
        <AdminControls selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      )}

      <TaskBoard selectedUser={selectedUser} />
    </div>
  );
}
