"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { fetchTasks } from "@/redux/slices/taskSlice";

export default function TaskBoard({ selectedUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, isModalOpen]);

  const filteredTasks = selectedUser
    ? tasks.filter((task) => task.user === selectedUser._id)
    : tasks;

  const priorityColors = {
    low: "bg-gray-100 border-gray-300",
    medium: "bg-yellow-100 border-yellow-300",
    high: "bg-red-100 border-red-300",
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="mb-4 w-full flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:grid md:grid-cols-3 md:gap-10 overflow-hidden">
        {["low", "medium", "high"].map((priority) => {
          const tasksByPriority = filteredTasks.filter(
            (task) => task.priority === priority
          );

          return (
            <div
              key={priority}
              className={`p-4 border rounded-xl shadow-md ${priorityColors[priority]} w-full h-[420px] overflow-y-auto`}
            >
              <h3 className="text-lg font-semibold mb-3 capitalize text-gray-800 text-center">
                {priority} Priority
              </h3>
              <div className="space-y-3">
                {tasksByPriority.length > 0 ? (
                  tasksByPriority.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center mt-10">No tasks available</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
