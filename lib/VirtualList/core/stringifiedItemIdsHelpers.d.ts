import { Item, ItemWithPosition } from '../typings';
export declare const idSeparator = "/@@/";
export declare const getStringifiedItemIds: <T extends Item>(items: ItemWithPosition<T>[]) => string;
export declare const placeSeparatorAtEnds: (stringifiedIds: string) => string;
export declare const getIdsFromStringifiedIds: (stringifiedIds: string) => string[];
export declare const removeSeparators: (id: string) => string;
