/// <reference types="react" />
export declare type ItemId = string | number;
export declare type Item = {
    id: ItemId;
};
export declare type ItemWithPosition<T extends Item> = {
    item: T;
    y: number;
    height: number;
};
export declare type OnClickHandlerParams<T extends Item> = {
    item: T;
    event: ModifierKeys;
};
export declare type RenderItemProps<T extends Item> = {
    item: T;
    selected: boolean;
    onClick: (params: OnClickHandlerParams<T>) => void;
};
export declare type ModifierKeys = {
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
};
export declare type OnSelectCallbackParams<T extends Item> = {
    item: T;
    modifiers: ModifierKeys;
    newSelectedIds: ItemId[];
};
export declare type OnSelectCallback<T extends Item> = (params: OnSelectCallbackParams<T>) => void;
export declare type Props<T extends Item> = {
    /**
     * The items list to be rendered, the VirtualList will render a `RenderItem` component for every item of this list.
     */
    items: T[];
    /**
     * The component that received every single item and renders it.
     */
    RenderItem: React.ComponentType<RenderItemProps<T>>;
    /**
     * A function that must return the height of every item.
     */
    getItemHeights: ItemsHeightsGetter<T>;
    /**
     * The height of the container list.
     */
    listHeight: number;
    /**
     * The amount of items to be rendered before and after the visible ones. It prevents the user from seeing an empty area in case of fast scrolling or poor render performance.
     */
    buffer?: number;
    /**
     * How the list behaves when the items change. It can try to keep the actual visible items when the ends of the items update.
     * @default 'none'
     * @see #MaintainScrollOption
     */
    updateScrollModeOnDataChange?: MaintainScrollOption;
    /**
     * The ids of the selected items
     */
    selectedItemIds?: ItemId[] | never;
    /**
     * The callback invoked at every selection update. It will receive the selection resulted from the item click (upporting keyboard modifiers) applied to the `selectedItems` arraylogger.log(
     * The external consumer can manually manage the selection because the callback receives the clicked item and the modifiers too.
     */
    onSelect?: OnSelectCallback<T>;
};
export declare type ItemsHeightsGetter<T extends Item> = (item: T, index: number, items: T[]) => number;
export declare type ItemScrollData<T extends Item> = ItemWithPosition<T>;
export declare type MaintainScrollOption = 'none' | EndsUpdateOptions;
export declare type EndsUpdateOptions = {
    addedAtTop?: boolean;
    removedFromTop?: boolean;
    addedAtBottom?: boolean;
    removedFromBottom?: boolean;
};
