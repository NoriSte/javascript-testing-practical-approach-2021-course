import { ItemWithPosition, Item } from '../typings';
declare type Params<T extends Item> = {
    items: T[];
    itemsHeights: number[];
};
declare type Result<T extends Item> = ItemWithPosition<T>[];
export declare const getItemsWithPosition: <T extends Item>(params: Params<T>) => Result<T>;
export {};
