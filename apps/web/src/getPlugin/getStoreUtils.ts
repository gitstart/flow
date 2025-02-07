import { fetchQuery, graphql } from "@flowdev/relay";
import { useAsyncLoader } from "../useAsyncLoader";
import { environment } from "../relay/environment";
import { getStoreUtilsGetQuery } from "../relay/__generated__/getStoreUtilsGetQuery.graphql";

export const getStoreUtils = (defaultSlug: string) => {
  /** The pluginSlug is optional. You can pass `null` if you want to get an item from flow (e.g. theme). */
  const get = async (keys?: string[], pluginSlug?: string | null) => {
    const data = await fetchQuery<getStoreUtilsGetQuery>(
      environment,
      graphql`
        query getStoreUtilsGetQuery($input: QueryStoreItemsInput!) {
          storeItems(input: $input) {
            key
            value
          }
        }
      `,
      {
        input: {
          keys,
          pluginSlug: pluginSlug === undefined ? defaultSlug : pluginSlug,
        },
      }
    ).toPromise();
    return Object.fromEntries(data?.storeItems.map((item) => [item.key, item.value]) ?? []);
  };

  return {
    get,
    useStore: (keys?: string[], pluginSlug?: string) => {
      return useAsyncLoader(async () => {
        return get(keys, pluginSlug);
      });
    },
  };
};
