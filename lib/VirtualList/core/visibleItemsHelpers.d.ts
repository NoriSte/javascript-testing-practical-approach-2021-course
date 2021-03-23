import { Item, ItemWithPosition } from '../typings';
declare type Params<T extends Item> = {
    items: ItemWithPosition<T>[];
    scrollY: number;
    scrollHeight: number;
};
export declare const getFirstVisibleAtTopItem: <T extends Item>(params: Params<T>) => ItemWithPosition<T> | undefined;
export declare const getVisibleAtTopItemsOnly: <T extends Item>(params: Params<T>) => ItemWithPosition<T>[];
export {};
