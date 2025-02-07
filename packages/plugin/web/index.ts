// ‼️ only import **types** from the @flowdev/web package, not runtime code otherwise it will be a cyclic dependency
import type { WebPluginOptions } from "@flowdev/web/src/getPlugin/getPluginOptions";
import type { PluginRoutineStepProps } from "@flowdev/web/src/components/RoutineStep";

export type { WebPluginOptions, PluginRoutineStepProps };

export type WebPluginRoutineStep = {
  /** The name of the step. */
  name: string;
  /** The description of the step. Showed in the settings view for the user to understand what the step is for. */
  description: string;
  /** The component to render for the step. */
  component: React.ComponentType<PluginRoutineStepProps>;
};

export type WebPlugin = (options: WebPluginOptions) => {
  /** The name of your plugin. */
  name: string;
  /** Routine steps the user can choose to add to their routines. */
  routineSteps?: {
    [stepSlug: string]: WebPluginRoutineStep;
  };
  /**
   * Setting the user can change about your plugin.
   *
   * Each key will match a store item in the database. In the example below, the key `my-plugin-setting` will be a row in the `Store` table.
   *
   * You can fetch this setting by using the `options.store` object. Either using the `get` method, or by using the `useStore` hook.
   * @example
   * ```
   * {
   *  "my-plugin-setting": {
   *    label: "My Plugin Setting",
   *    render: "textfield",
   *    ...
   *  }
   * }
   * ```
   */
  settings?: {
    [settingKey: string]: SettingField;
  };
};

export const definePlugin = (slug: string, plugin: WebPlugin) => ({ slug, plugin });

export type DefineWebPluginReturn = ReturnType<typeof definePlugin>;

// copied from prisma types
type JsonValue = string | number | boolean | { [Key in string]?: JsonValue } | Array<JsonValue>;

type SettingField =
  | TextfieldSetting
  | TextareaSetting
  | NumberSetting
  | CheckboxSetting
  | SelectSetting
  | CustomSetting;

type CommonSetting = {
  isSecret?: boolean;
  isServerOnly?: boolean;
  defaultValue?: JsonValue;
  validate?: ((value: JsonValue) => string | undefined)[];
};

type TextfieldSetting = CommonSetting & {
  type: "textfield";
  label: string;
  description?: string;
};

type TextareaSetting = CommonSetting & {
  type: "textarea";
  label: string;
  description?: string;
};

type NumberSetting = CommonSetting & {
  type: "number";
  label: string;
  description?: string;
};

type CheckboxSetting = CommonSetting & {
  type: "checkbox";
  label: string;
  description?: string;
};

type SelectSetting = CommonSetting & {
  type: "select";
  label: string;
  description?: string;
  options: Array<{ label: string; value: JsonValue }>;
};

type CustomSetting = CommonSetting & {
  type: "custom";
  render: (props: { onUpdate: (value: JsonValue) => void; value: JsonValue }) => JSX.Element;
};
