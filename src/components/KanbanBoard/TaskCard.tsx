import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { MdDelete } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task, deleteTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: false, //if true we can draggle false here
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes} // only use where you wanna drag
      {...listeners} // only use where you wanna drag
      className="bg-mainBackgroundColor p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {task.content}

      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackground  p-2 rounde opacity-60 hover:opacity-100"
        >
          <MdDelete size={20} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
