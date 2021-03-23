import { EndsUpdateOptions, Item, ItemWithPosition } from '../typings';
declare type Params<T extends Item> = {
    actualScroll: number;
    scrollHeight: number;
    oldStringifiedIds?: string;
    newItems: ItemWithPosition<T>[];
    endsUpdateOptions: EndsUpdateOptions;
    oldVisibleItems: ItemWithPosition<T>[];
};
declare type Result<T extends Item> = {
    success: true;
    itemToMaintainVisible: ItemWithPosition<T>;
} | {
    success: false;
};
export declare const maintainScrollOnEndsUpdate: <T extends Item>(params: Params<T>) => Result<T>;
export {};
