import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import TaskCard from "./TaskCard";

const ColumnContainer = ({
  column,
  deleteColumn,
  createTask,
  tasks,
  deleteTask,
}) => {
  //   const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: false, //if true we can draggle false here
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
    bg-columnBackground
        w-[350px]
        h-[500px]
        opacity-40
        border-rose-500
        border-2
        max-h-[500px]
        rounded-md
        flex
        flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef} // target element who drag
      style={style}
      className="
        bg-columnBackground
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "
    >
      {/* title */}
      <div
        {...attributes} // only use where you wanna drag
        {...listeners} // only use where you wanna drag
        // onClick={() => setEditMode(true)}
        className="
      bg-mainBackgroundColor 
      text-md 
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-black/10
      border-4
      flex 
      items-center
      justify-between
      "
      >
        <div className=" flex gap-2">
          <div
            className="
        flex 
        justify-center
        items-center
        bg-black/10
        px-2
        py-1
        text-sm
        
        "
          >
            0
          </div>
          {column.title}
          {/* {!editMode && column.title}
          {editMode && (
            <input
              className="text-black"
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )} */}
        </div>
        <button onClick={() => deleteColumn(column.id)} className="text-sm">
          <MdDelete size={20} />
        </button>
      </div>
      {/* task */}

      <div className="flex flex-grow flex-col  gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {
          <SortableContext items={taskIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
            ))}
          </SortableContext>
        }
      </div>
      {/*  */}

      <button
        onClick={() => createTask(column.id)}
        className="border-rose-400 p-2 border-2 m-4"
      >
        Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
