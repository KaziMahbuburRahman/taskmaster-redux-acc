import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AddTaskModal from "../components/tasks/AddTaskModal";
import MyTasks from "../components/tasks/MyTasks";
import MyTasksSkeleton from "../components/tasks/MyTasksSkeleton";
import TaskCard from "../components/tasks/TaskCard";
import TaskCardSkeleton from "../components/tasks/TaskCardSkeleton";
import MenuDropdown from "../components/ui/MenuDropdown";
import { useGetTasksQuery } from "../redux/features/api/tasksApiSlice";
import { auth } from "../utils/firebase.config";

const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const { users } = useSelector((state) => state.allUsers);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header Skeleton */}
        <div className="px-4 md:px-10 pt-5 md:pt-10 pb-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 md:justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-3 md:gap-5">
              <div className="h-9 w-9 md:h-10 md:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-9 w-9 md:h-10 md:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-9 w-9 md:h-10 md:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between flex-grow">
          <div className="flex flex-col lg:flex-col gap-5 px-4 md:px-10 pb-5 w-full">
            {/* Task Columns Skeleton */}
            <div className="flex-grow flex flex-col md:flex-row gap-4 md:gap-5">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                    <div className="sticky top-0 flex justify-between items-center bg-[#D3DDF9] p-4 rounded-t-lg">
                      <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-6 w-6 bg-primary/40 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-[60vh] md:h-[70vh] overflow-y-auto p-4 space-y-3 flex-grow">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <TaskCardSkeleton key={i} />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members and My Tasks Section Skeleton */}
          <div className="lg:w-96 border-t-2 lg:border-t-0 bg-white lg:bg-transparent py-5 lg:py-0 lg:mt-10 lg:border-l-2 lg:border-secondary/20 px-4">
            <div className="mb-6">
              <div className="h-6 w-28 bg-gray-300 rounded animate-pulse mb-3"></div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-200 animate-pulse"
                    ></div>
                  ))}
              </div>
            </div>
            <MyTasksSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  console.log("users", users);
  // const currentUserName = users?.find((user) => user.uid === currentUserName?.uid)
  console.log("all tasks", tasks);
  const currentUserName = auth.currentUser?.displayName;
  const myPendingTasks = tasks?.filter(
    (item) => item.status === "pending" && item.assignTo === currentUserName
  );
  const myRunningTasks = tasks?.filter(
    (item) => item.status === "in-progress" && item.assignTo === currentUserName
  );
  const myDoneTasks = tasks?.filter(
    (item) => item.status === "completed" && item.assignTo === currentUserName
  );

  const othersPendingTasks = tasks?.filter(
    (item) => item.status === "pending" && item.assignTo !== currentUserName
  );
  const othersRunningTasks = tasks?.filter(
    (item) => item.status === "in-progress" && item.assignTo !== currentUserName
  );
  const othersDoneTasks = tasks?.filter(
    (item) => item.status === "completed" && item.assignTo !== currentUserName
  );

  const getTaskId = (task) => {
    return task._id || task.id;
  };

  if (isError) return <div>Error loading tasks</div>;

  const renderTaskColumn = (title, tasks = [], count) => (
    <div className="flex-1 min-w-0">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="sticky top-0 flex justify-between items-center bg-[#D3DDF9] p-4 rounded-t-lg">
          <h2 className="text-sm md:text-base font-medium">{title}</h2>
          <span className="bg-primary text-white w-6 h-6 grid place-content-center rounded-md text-sm">
            {count}
          </span>
        </div>
        <div className="h-[60vh] md:h-[70vh] overflow-y-auto py-3 space-y-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => <TaskCardSkeleton key={index} />)
            : tasks.map((item) => (
                <TaskCard key={getTaskId(item)} task={item} />
              ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AddTaskModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between flex-grow">
          <div className="flex flex-col lg:flex-col gap-5 px-4 md:px-10 pb-5 w-full">
            {/* Header Section */}
            <div className="px-4 md:px-10 pt-5 md:pt-10 pb-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 md:justify-between">
                <h1 className="font-semibold text-2xl md:text-3xl">Tasks</h1>
                <div className="flex items-center gap-3 md:gap-5">
                  <button className="border-2 border-secondary/20 hover:border-primary hover:bg-primary rounded-xl h-9 w-9 md:h-10 md:w-10 grid place-content-center text-secondary hover:text-white transition-all">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                  <button className="border-2 border-secondary/20 hover:border-primary hover:bg-primary rounded-xl h-9 w-9 md:h-10 md:w-10 grid place-content-center text-secondary hover:text-white transition-all">
                    <BellIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-primary text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                  >
                    Add Task
                  </button>
                  <MenuDropdown>
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl overflow-hidden">
                      <img
                        src={
                          auth.currentUser?.photoURL ||
                          "https://ui-avatars.com/api/?name=User&background=random"
                        }
                        alt={auth.currentUser?.displayName || "User"}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </MenuDropdown>
                </div>
              </div>
            </div>
            {/* Task Columns Container */}
            <div className="flex-grow flex flex-col md:flex-row gap-4 md:gap-5">
              {renderTaskColumn(
                "Up Next",
                [...myPendingTasks, ...othersPendingTasks],
                myPendingTasks?.length + othersPendingTasks?.length
              )}
              {renderTaskColumn(
                "In Progress",
                [...myRunningTasks, ...othersRunningTasks],
                myRunningTasks?.length + othersRunningTasks?.length
              )}
              {renderTaskColumn(
                "Done",
                [...myDoneTasks, ...othersDoneTasks],
                myDoneTasks?.length + othersDoneTasks?.length
              )}
            </div>
          </div>
          {/* Members and My Tasks Section */}
          <div className="lg:w-96 border-t-2 lg:border-t-0 bg-white lg:bg-transparent py-5 lg:py-0 lg:flex lg:flex-col lg:mt-10 border-l-2 border-secondary/20 px-4">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-medium mb-3">Members</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-200 animate-pulse"
                        />
                      ))
                  : users.map((user) => (
                      <div
                        key={user.uid}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-xl overflow-hidden"
                      >
                        <img
                          src={
                            user.photoURL || "https://via.placeholder.com/40"
                          }
                          alt={user.displayName}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ))}
              </div>
            </div>
            <MyTasks tasks={tasks} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
