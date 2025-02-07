import { builder, u } from "./builder";
import { prisma } from "../utils/prisma";
import { startOfDayScheduledAt, endOfDayScheduledAt } from "../utils/getDays";
import { InputFieldRef, InputShapeFromFields } from "@pothos/core";
import { ColorEnum } from "./Color";
import { ItemPluginDataInput } from "./ItemPluginData";

// -------------- Item types --------------

export const ItemType = builder.prismaNode("Item", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    title: t.exposeString("title"),
    isRelevant: t.exposeBoolean("isRelevant"),
    scheduledAt: t.expose("scheduledAt", { type: "DateTime", nullable: true }),
    durationInMinutes: t.exposeInt("durationInMinutes", { nullable: true }),
    isAllDay: t.exposeBoolean("isAllDay", { nullable: true }),
    color: t.expose("color", { type: ColorEnum, nullable: true }),
    pluginDatas: t.relation("pluginDatas"),
  }),
});

// --------------- Item query types ---------------

builder.queryField("items", (t) =>
  t.prismaConnection({
    type: "Item",
    cursor: "id",
    description: `Get all external items. Useuful to get list of items for a specific day to show in a calendar.
By default, only items where \`isRelevant\` is true.
Pass the \`where\` argument to override these defaults.`,
    args: { where: t.arg({ type: ItemWhereInput, required: false }) },
    resolve: (query, _, args) => {
      return prisma.item.findMany({
        ...query,
        where: createItemWhere(args.where ?? {}),
      });
    },
  })
);

export const createItemWhere = (
  where: InputShapeFromFields<{
    isRelevant: InputFieldRef<boolean | null | undefined, "InputObject">;
    scheduledFor: InputFieldRef<Date | null | undefined, "InputObject">;
  }>
) => {
  const scheduledFor = where.scheduledFor;
  return {
    isRelevant: where.isRelevant ?? true,
    ...(scheduledFor
      ? {
          scheduledAt: {
            gte: startOfDayScheduledAt(scheduledFor),
            lte: endOfDayScheduledAt(scheduledFor),
          },
        }
      : { scheduledAt: null }),
  };
};

export const ItemWhereInput = builder.inputType("ItemWhereInput", {
  fields: (t) => ({
    isRelevant: t.boolean({
      required: false,
      description: `If set to true, it will return items where isRelevant is true.`,
      defaultValue: true,
    }),
    scheduledFor: t.field({
      type: "Date",
      required: false,
      description: `If set to true, it will return items where scheduledAt is today or null.`,
    }),
  }),
});

// --------------- Item mutation types ---------------

builder.mutationField("createItem", (t) =>
  t.prismaFieldWithInput({
    type: "Item",
    description: `Create an item.`,
    input: {
      title: t.input.string({ required: true, description: `The title of the item.` }),
      isRelevant: t.input.boolean({
        required: false,
        description: `If set to true, it will return items where \`isRelevant\` is true. 

\`isRelevant\` is used in the List component to only show relevant items. If the item becomes irrelevant (e.g. because the trello task was already completed), you can update the item to make this \`isRelevant = false\``,
      }),
      scheduledAt: t.input.field({ type: "DateTime", required: false }),
      durationInMinutes: t.input.int({ required: false }),
      isAllDay: t.input.boolean({ required: false }),
      color: t.input.field({ type: ColorEnum, required: false }),
      listId: t.input.globalID({ required: false }),
      pluginDatas: t.input.field({ type: [ItemPluginDataInput], required: false }),
    },
    resolve: (query, _, { input }) => {
      return prisma.item.create({
        ...query,
        data: {
          title: input.title,
          isRelevant: u(input.isRelevant),
          scheduledAt: u(input.scheduledAt),
          durationInMinutes: u(input.durationInMinutes),
          isAllDay: u(input.isAllDay),
          color: u(input.color),
          list:
            input.listId && input.listId.typename === "List"
              ? { connect: { id: parseInt(input.listId.id) } }
              : undefined,
          ...(input.pluginDatas
            ? {
                pluginDatas: {
                  createMany: {
                    data: input.pluginDatas,
                  },
                },
              }
            : {}),
        },
      });
    },
  })
);
