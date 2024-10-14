import React, { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const columnsId = useMemo(() => {
    return columns.map((col) => col.id);
  }, [columns]);

  const [acttiveColumn, setActiveColumn] = useState(null);
  const [acttiveTask, setActiveTask] = useState(null);

  //   it's importnat for if you use any event in upper layer of drag layer, so using sensor we can set when drag 10 pixel the it will start drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // The drag will activate after 3px of movement
      },
    })
  );

  //
  const createNewColumn = () => {
    const columnToAdd = {
      id: generaeId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  //
  function generaeId() {
    return Math.floor(Math.random() * 10000);
  }

  //
  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  //   onDrag start
  const onDragStart = (event) => {
    // console.log("EVENT", event.active.data);
    // for column
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    // for task
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  //   onDragEnd
  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);
    // distructure active/drag over/drop from event
    const { active, over } = event;
    // if over not happend then return
    if (!over) return;

    // active/drag over/drop column id
    const activeColumnId = active.id;
    const overColumnId = over.id;

    // if dragid and dropId same then return
    if (activeColumnId === overColumnId) return;

    // now it's time to change array element possition
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      //cng array ele index position - arrayMove(targetArray,who,where) //
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  // create task
  const createTask = (columnId) => {
    const newTask = {
      id: generaeId(),
      columnId,
      content: `task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };
  //
  const deleteTask = (taskId) => {
    const newTask = tasks.filter((task) => task.id !== taskId);
    setTasks(newTask);
  };

  // ondragover
  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
      onDragOver={onDragOver}
    >
      <div
        className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    "
      >
        <div className="m-auto">
          <div className="flex gap-4">
            {/* wrapping column with sortablae */}
            <SortableContext items={columnsId}>
              {columns.map((col: any) => (
                <ColumnContainer
                  deleteTask={deleteTask}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                />
              ))}
            </SortableContext>
          </div>

          {/* add column  */}
          <button
            onClick={() => createNewColumn()}
            className="
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackground
            p-4
            ring-rose-500
            hover:ring-2
      "
          >
            Add Column
          </button>
        </div>
        {/* overlay : when we drag then how it looks like, where ever we can keep that code */}
        {/* and creating portal is like dont create node for it in reaact , it's just for show as mirror duplicate */}
        {createPortal(
          <DragOverlay>
            {/* coumn overlay */}
            {acttiveColumn && (
              <ColumnContainer
                tasks={tasks.filter(
                  (task) => (task.columnId = acttiveColumn.id)
                )}
                deleteTask={deleteTask}
                createTask={createTask}
                column={acttiveColumn}
                deleteColumn={deleteColumn}
              />
            )}
            {/* task overlay */}
            {acttiveTask && (
              <TaskCard task={acttiveTask} deleteTask={deleteTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
