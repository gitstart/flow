import { GraphQLError } from "graphql";
import { prisma } from "../utils/prisma";
import { builder } from "./builder";
import { RepetitionPatternEnum } from "./RepetitionPattern";

// -------------- Routine types --------------

// TODO: move this into its own file / package
type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type UrlSlug = `${Letter | Digit}${string}`;

export type RoutineStep = `${UrlSlug}_${UrlSlug}_${boolean}`;

export const RoutineType = builder.prismaNode("Routine", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    time: t.expose("time", { type: "Time" }),
    repeats: t.expose("repeats", { type: [RepetitionPatternEnum] }),
    steps: t.field({
      type: [RoutineStepType],
      resolve: (routine) =>
        routine.steps.map((step) => {
          const [pluginSlug, stepSlug, shouldSkip] = step.split("_");
          return {
            pluginSlug: pluginSlug!,
            stepSlug: stepSlug!,
            shouldSkip: shouldSkip === "true",
          };
        }),
    }),
    isActive: t.exposeBoolean("isActive"),
    firstStep: t.string({
      resolve: (routine) => routine.steps[0] ?? null,
      nullable: true,
      description:
        "Returns the first step in the routine. If there are no steps in the routine, it returns `null`.",
    }),
    done: t.boolean({
      description:
        "Whether the routine was done for the day. This can be null if the routine is queried outside of a day.",
      nullable: true,
      resolve: async (routine) => {
        if (!("_done" in routine) || typeof routine._done !== "boolean") return null;
        return routine._done;
      },
    }),
  }),
});

export const RoutineStepType = builder.objectType(
  builder.objectRef<{
    pluginSlug: string;
    stepSlug: string;
    shouldSkip: boolean;
  }>("RoutineStep"),
  {
    description: "A step in a routine. To know which plugin the step belongs to, see `pluginSlug`.",
    fields: (t) => ({
      pluginSlug: t.exposeString("pluginSlug", {
        description: "The slug of the plugin that the step belongs to.",
      }),
      stepSlug: t.exposeString("stepSlug", { description: "The slug of the step." }),
      shouldSkip: t.exposeBoolean("shouldSkip", {
        description:
          "Whether the step should be skipped if the previous routine was done (i.e. routine.done = true).",
      }),
    }),
  }
);

// --------------- Routine query types ---------------

builder.queryField("routines", (t) =>
  t.prismaField({
    type: ["Routine"],
    description: "Get all routines.",
    resolve: prisma.routine.findMany,
  })
);

// --------------- Routine mutation types ---------------

builder.mutationField("completeRoutine", (t) =>
  t.fieldWithInput({
    type: "Boolean",
    input: {
      routineId: t.input.globalID({
        description: "The ID of the routine that was completed.",
        required: true,
      }),
      date: t.input.field({
        type: "Date",
        description: "The date the routine was completed.",
        required: true,
      }),
    },
    resolve: async (_, args) => {
      try {
        await prisma.day.update({
          where: { date: args.input.date },
          data: { routinesCompleted: { connect: { id: parseInt(args.input.routineId.id) } } },
        });
      } catch (e) {
        new GraphQLError((e as Error).message);
      }
      return true;
    },
  })
);
