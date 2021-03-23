import { ItemsHeightsGetter, Item } from '../typings';
declare type Params<T extends Item> = {
    items: T[];
    getItemHeights: ItemsHeightsGetter<T>;
};
export declare const getItemsHeights: <T extends Item>({ items, getItemHeights }: Params<T>) => number[];
export {};
