import { ItemWithPosition, Item } from '../typings';
declare type Params<T extends Item> = {
    itemsWithPosition: ItemWithPosition<T>[];
    scrollY: number;
    buffer: number;
    listHeight: number;
    itemsTotalHeight: number;
};
declare type Result<T extends Item> = ItemWithPosition<T>[];
export declare const getItemsInterestedByScroll: <T extends Item>(params: Params<T>) => Result<T>;
export {};
