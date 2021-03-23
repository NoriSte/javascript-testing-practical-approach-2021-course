import { Item, ItemWithPosition, MaintainScrollOption } from '../typings';
declare type Params<T extends Item> = {
    newItems: ItemWithPosition<T>[];
    actualScroll: number;
    scrollHeight: number;
    oldStringifiedIds: string;
    oldVisibleItems: ItemWithPosition<T>[];
    updateScrollModeOnDataChange: MaintainScrollOption;
};
export declare const getNewScrollValue: <T extends Item>(params: Params<T>) => number;
export {};
