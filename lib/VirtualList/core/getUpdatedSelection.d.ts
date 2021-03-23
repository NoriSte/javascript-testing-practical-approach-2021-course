import { Item, ItemId, ItemWithPosition, ModifierKeys } from '../typings';
declare type Params<T extends Item> = {
    items: ItemWithPosition<T>[];
    oldSelectedIds: ItemId[];
    clickedItemId: ItemId;
    modifiers: ModifierKeys;
};
export declare const getUpdatedSelection: <T extends Item>(params: Params<T>) => ItemId[];
export {};
