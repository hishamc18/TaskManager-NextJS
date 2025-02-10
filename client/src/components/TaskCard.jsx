import { FaTrash, FaRegCalendarAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteTask, fetchTasks } from "../redux/slices/taskSlice";
import TaskModal from "./TaskModal";
import { useToast } from "./Toast";

const TaskCard = ({ task }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="border p-6 bg-white shadow-md rounded-xl transition-transform transform hover:scale-105 cursor-pointer"
            >
                <div className="flex items-center gap-2 mb-2 text-gray-800">
                    <h3 className="font-semibold text-[14px]">{task.title}</h3>
                </div>

                <div className="flex items-start gap-2 text-gray-700 mb-2 ">
                    <p className="text-[12px]">{task.description}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FaRegCalendarAlt className="text-red-500" />
                    <span>{task.dueDate?.slice(0, 10) || "No due date"}</span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteTask(task._id)).then((res) => {
                            dispatch(fetchTasks());
                            showToast("Task Deleted");
                        });
                    }}
                    className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                >
                    <FaTrash />
                </button>
            </div>

            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={task} />
        </>
    );
};

export default TaskCard;
