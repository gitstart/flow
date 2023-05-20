import { installServerPlugin } from "../utils/getPlugins";
import { prisma } from "../utils/prisma";
import { builder } from "./builder";

const SettingKeys = {
  INSTALLED_PLUGINS: "installed-plugins",
};

type PluginInstallation = {
  /** The plugin's slug */
  slug: string;
  /** The plugin's URL. It can be jsdelivr URL or anything that servers application/javascript static files. */
  url: string;
};

export const SettingType = builder.prismaNode("Store", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    key: t.exposeString("key"),
    value: t.expose("value", { type: "JSON" }),
    pluginSlug: t.exposeString("pluginSlug", { nullable: true }),
  }),
});

// --------------- Setting query types ---------------

builder.queryField("store", (t) =>
  t.prismaConnection({
    type: "Store",
    cursor: "id",
    description: "Get all store items. The args (first, last, after, before) don't work yet.",
    // TODO: add pagination. See https://github.com/devoxa/prisma-relay-cursor-connection/blob/936a800b8ec4cf62b644bce4c0c0fdf7a90f5e7c/src/index.ts#L12 or https://gist.github.com/ctrlplusb/17b5a1bd1736b5ba547bb15b3dd5be29#file-findmanycursor-ts
    resolve: (query) => {
      return prisma.store.findMany({
        ...query,
        where: { isSecret: false, isServerOnly: false },
      });
    },
  })
);

builder.queryField("installedPlugins", (t) =>
  t.field({
    type: [PluginInstallationType],
    description: "Get all installed plugins.",
    resolve: async () => {
      const setting = await prisma.store.findFirst({
        where: {
          key: SettingKeys.INSTALLED_PLUGINS,
          isSecret: false,
          isServerOnly: false,
          pluginSlug: null,
        },
      });
      if (!setting) {
        return [];
      } else {
        return setting.value as PluginInstallation[];
      }
    },
  })
);

const PluginInstallationType = builder.objectType(
  builder.objectRef<PluginInstallation>("PluginInstallation"),
  {
    fields: (t) => ({
      slug: t.exposeString("slug"),
      url: t.exposeString("url"),
    }),
  }
);

// --------------- Setting mutation types ---------------

builder.mutationField("createStoreItem", (t) =>
  t.prismaFieldWithInput({
    type: "Store",
    description: "Create a store item.",
    input: {
      key: t.input.string({ required: true }),
      value: t.input.field({ type: "JSON", required: true }),
      pluginSlug: t.input.string({ required: true }),
    },
    resolve: (query, _, args) => {
      return prisma.store.create({
        ...query,
        data: {
          key: args.input.key,
          value: args.input.value,
          pluginSlug: args.input.pluginSlug,
          isSecret: false,
          isServerOnly: false,
        },
      });
    },
  })
);

builder.mutationField("installPlugin", (t) =>
  t.fieldWithInput({
    type: [PluginInstallationType],
    description: "Install a plugin.",
    input: {
      url: t.input.string({ required: true }),
      slug: t.input.string({ required: true }),
    },
    resolve: async (_, args) => {
      const currSetting = await prisma.store.findFirst({
        where: {
          key: SettingKeys.INSTALLED_PLUGINS,
          isSecret: false,
          isServerOnly: false,
          pluginSlug: null,
        },
      });
      const installedPluginsSet = new Set((currSetting?.value ?? []) as PluginInstallation[]);
      installedPluginsSet.add({ slug: args.input.slug, url: args.input.url });

      await installServerPlugin({
        url: args.input.url,
        pluginSlug: args.input.slug,
      });

      const newSetting = await prisma.store.upsert({
        where: {
          key: SettingKeys.INSTALLED_PLUGINS,
        },
        update: {
          value: Array.from(installedPluginsSet),
        },
        create: {
          key: SettingKeys.INSTALLED_PLUGINS,
          value: Array.from(installedPluginsSet),
          isSecret: false,
          isServerOnly: false,
        },
      });
      return newSetting.value as PluginInstallation[];
    },
  })
);
