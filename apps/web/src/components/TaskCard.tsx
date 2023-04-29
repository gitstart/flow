import React from "react";
import { TaskCard_task$key } from "@flowdev/web/relay/__generated__/TaskCard_task.graphql";
import { useMemo } from "react";
import { graphql, useFragment, useMutation } from "@flowdev/relay";
import { TaskCardDetails_task$key } from "@flowdev/web/relay/__generated__/TaskCardDetails_task.graphql";
import { TaskCardActions_task$key } from "@flowdev/web/relay/__generated__/TaskCardActions_task.graphql";
import { DurationBadge, TimeBadge } from "./Badges";
import { BsCheck, BsCheckAll, BsX } from "@flowdev/icons";
import {
  TaskCardUpdateTaskStatusMutation,
  TaskStatus,
} from "@flowdev/web/relay/__generated__/TaskCardUpdateTaskStatusMutation.graphql";
import { TaskTitle } from "./TaskTitle";

type TaskCardProps = {
  task: TaskCard_task$key;
};

export const TaskCard = (props: TaskCardProps) => {
  const task = useFragment(
    graphql`
      fragment TaskCard_task on Task {
        title
        durationInMinutes
        status
        ...TaskCardDetails_task
        ...TaskCardActions_task
        ...TaskTitle_task
      }
    `,
    props.task
  );

  let statusStyles = "";
  if (task.status !== "TODO") {
    statusStyles = "opacity-50 hover:opacity-100";
  }

  return (
    <div
      className={`${statusStyles} bg-background-50 rounded-md flex flex-col gap-1 p-3 group cursor-pointer`}
    >
      <div className="flex gap-1">
        <TaskTitle task={task} />
        {task.durationInMinutes && <DurationBadge durationInMinutes={task.durationInMinutes} />}
      </div>
      <TaskCardDetails task={task} />
      <TaskCardActions task={task} />
    </div>
  );
};

type TaskCardDetailsProps = {
  task: TaskCardDetails_task$key;
};

const TaskCardDetails = (props: TaskCardDetailsProps) => {
  const task = useFragment(
    graphql`
      fragment TaskCardDetails_task on Task {
        item {
          scheduledAt
        }
        pluginDatas {
          pluginSlug
          min
        }
      }
    `,
    props.task
  );

  return <div>{task.item?.scheduledAt && <TimeBadge time={task.item.scheduledAt} />}</div>;
};

type TaskCardActionsProps = {
  task: TaskCardActions_task$key;
};

const TaskCardActions = (props: TaskCardActionsProps) => {
  const task = useFragment(
    graphql`
      fragment TaskCardActions_task on Task {
        status
        canBeSuperdone
        id
      }
    `,
    props.task
  );

  const [_updateTaskStatus] = useMutation<TaskCardUpdateTaskStatusMutation>(graphql`
    mutation TaskCardUpdateTaskStatusMutation($input: MutationUpdateTaskStatusInput!) {
      updateTaskStatus(input: $input) {
        ...Day_day
      }
    }
  `);

  const updateStatus = (status: TaskStatus, superDone?: boolean) => {
    _updateTaskStatus({
      variables: {
        input: { id: task.id, status, superDone },
      },
    });
  };

  const doneButton = (
    <button
      key="done"
      className="rounded-full flex bg-background-200 bg-opacity-50 h-6 text-sm text-foreground-700 w-6 items-center justify-center hover:(bg-opacity-70 bg-background-300) active:(bg-opacity-100 bg-background-300) "
      onClick={() => updateStatus("DONE")}
    >
      <BsCheck />
    </button>
  );

  const undoDoneButton = (
    <button
      key="undoDone"
      className="rounded-full flex bg-positive-100 h-6 text-positive-600 w-6 items-center justify-center hover:bg-positive-200 active:bg-positive-300"
      onClick={() => updateStatus("TODO")}
    >
      <BsCheck />
    </button>
  );

  const superdoneButton = (
    <button
      key="superdone"
      className="rounded-full bg-background-200 bg-opacity-50 h-6 text-sm text-foreground-700 w-6 items-center justify-center hidden hover:(bg-opacity-70 bg-background-300) active:(bg-opacity-100 bg-background-300) group-hover:flex "
      onClick={() => updateStatus("DONE", true)}
    >
      <BsCheckAll />
    </button>
  );

  const undoSuperdoneButton = (
    <button
      key="undoSuperdone"
      className="rounded-full flex bg-positive-100 h-6 text-positive-600 w-6 items-center justify-center hover:bg-positive-200 active:bg-positive-300"
      onClick={() => updateStatus("TODO")}
    >
      <BsCheckAll />
    </button>
  );

  const cancelButton = (
    <button
      key="cancel"
      className="rounded-full bg-background-200 bg-opacity-50 h-6 text-sm text-foreground-700 w-6 items-center justify-center hidden hover:(bg-opacity-70 bg-background-300) active:(bg-opacity-100 bg-background-300) group-hover:flex "
      onClick={() => updateStatus("CANCELED")}
    >
      <BsX size={20} />
    </button>
  );

  const undoCancelButton = (
    <button
      key="undoCancel"
      className="rounded-full flex bg-negative-100 h-6 text-negative-600 w-6 items-center justify-center hover:bg-negative-200 active:bg-negative-300"
      onClick={() => updateStatus("TODO")}
    >
      <BsX size={20} />
    </button>
  );

  const taskStatusActions: Array<React.ReactNode> = useMemo(() => {
    if (task.status === "TODO") {
      return [doneButton, ...(task.canBeSuperdone ? [superdoneButton] : []), cancelButton];
    } else if (task.status === "DONE") {
      return task.canBeSuperdone ? [undoSuperdoneButton] : [undoDoneButton];
    } else if (task.status === "CANCELED") {
      return [undoCancelButton];
    }
    return [];
  }, [task.status]);

  return <div className="flex gap-2">{taskStatusActions.map((action) => action)}</div>;
};
