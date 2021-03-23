import * as React from 'react';
import { Item, ItemWithPosition, RenderItemProps, ItemId, OnSelectCallback } from './typings';
declare type ItemsRendererProps<T extends Item> = {
    selectedItemIds: ItemId[];
    onSelect: OnSelectCallback<T>;
    visibleItems: ItemWithPosition<T>[];
    itemsWithPosition: ItemWithPosition<T>[];
    RenderItem: React.ComponentType<RenderItemProps<T>>;
};
export declare const ItemsRenderer: {
    <T extends Item>(props: ItemsRendererProps<T>): JSX.Element;
    displayName: string;
};
export {};
