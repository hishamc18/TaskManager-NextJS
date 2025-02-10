"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTask, fetchTasks, updateTask } from "@/redux/slices/taskSlice";
import { useToast } from "./Toast";

const TaskModal = ({ isOpen, onClose, task }) => {
    const dispatch = useDispatch();
    const isEditing = !!task;
    const { showToast } = useToast()

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
    });

    useEffect(() => {
        if (task) {
            setTaskData({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                priority: task.priority || "low",
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (isEditing) {
            dispatch(updateTask({ taskId: task._id, updates: taskData })).then((res) => {
              dispatch(fetchTasks())
              showToast("Task Updated")
            });
        } else {
            dispatch(createTask(taskData)).then((res) => {
              dispatch(fetchTasks())
              showToast("Task Created")
            });
        }

        setTaskData({ title: "", description: "", dueDate: "", priority: "low" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Task" : "Create New Task"}</h2>

                <input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    className="w-full p-2 border text-[14px] text-gray-500 rounded-xl mb-2"
                />

                <textarea
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    className="w-full p-2 border text-[14px]  text-gray-500 rounded-xl mb-2"
                ></textarea>

                <input
                    type="date"
                    name="dueDate"
                    value={taskData.dueDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-xl mb-2"
                />

                <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-xl mb-4  text-gray-500"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-gray-400">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        {isEditing ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
