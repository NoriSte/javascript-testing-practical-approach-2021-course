import * as React from "react";
import * as ReactScrollbar from "react-smooth-scrollbar";
import { useCallback, useMemo, useRef, useState } from "react";
import useDidUpdate from "../hooks/useDidUpdate";
import usePreviousValue from "../hooks/usePreviousValue";
import { getItemsHeights } from "./core/getItemsHeights";
import { getItemsInterestedByScroll } from "./core/getItemsInterestedByScroll";
import { getItemsTotalHeight } from "./core/getItemsTotalHeight";
import { getItemsWithPosition } from "./core/getItemsWithPosition";
import { getNewScrollValue } from "./core/getNewScrollValue";
import { getStringifiedItemIds } from "./core/stringifiedItemIdsHelpers";
import { ItemsRenderer } from "./ItemsRenderer";
const noop = () => { };
export const VirtualList = (props) => {
    const { items, getItemHeights, RenderItem, listHeight, buffer = 0, updateScrollModeOnDataChange = "none", selectedItemIds = [], onSelect, } = props;
    const smoothScrollbarRef = useRef();
    const [scrollY, setScrollY] = useState(0);
    // To avoid unnecessary calculations in case of a high number of items, an array of items with
    // their position is stored and used from now on
    const [itemsWithPosition, itemsTotalHeight] = useMemo(() => {
        const calculatedItemsHeights = getItemsHeights({ items, getItemHeights });
        return [
            getItemsWithPosition({
                items,
                itemsHeights: calculatedItemsHeights,
            }),
            getItemsTotalHeight({
                itemsHeights: calculatedItemsHeights,
            }),
        ];
    }, [items, getItemHeights]);
    // The items to be rendered (both the visible ones and the buffered ones) are stored
    const visibleItems = useMemo(() => getItemsInterestedByScroll({
        itemsWithPosition,
        scrollY,
        listHeight,
        itemsTotalHeight,
        buffer,
    }), [itemsWithPosition, listHeight, itemsTotalHeight, buffer, scrollY]);
    // When the items update, the list tries to update the scroll position to maintain the old visible
    // items in the same position. To avoid to refer the old items array (which could be huge) a
    // string representation is used
    const oldStringifiedIds = usePreviousValue(getStringifiedItemIds(itemsWithPosition));
    const oldVisibleItems = usePreviousValue(visibleItems);
    useDidUpdate(() => {
        var _a;
        if (oldVisibleItems && oldStringifiedIds) {
            (_a = smoothScrollbarRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, getNewScrollValue({
                newItems: itemsWithPosition,
                actualScroll: scrollY,
                scrollHeight: listHeight,
                oldStringifiedIds,
                oldVisibleItems,
                updateScrollModeOnDataChange,
            }));
        }
    }, [items]);
    // Children and refs
    const handleOnScroll = useCallback(({ offset: { y } }) => setScrollY(y), []);
    const setRef = useCallback((params) => { var _a; return (smoothScrollbarRef.current = (_a = params === null || params === void 0 ? void 0 : params.scrollbar) !== null && _a !== void 0 ? _a : undefined); }, []);
    return (React.createElement(ReactScrollbar, { style: { height: listHeight, width: "100%" }, onScroll: handleOnScroll, ref: setRef, alwaysShowTracks: true, "data-testid": "VirtualList" },
        React.createElement("div", { style: {
                height: itemsTotalHeight,
            } },
            React.createElement(ItemsRenderer, { selectedItemIds: selectedItemIds, onSelect: onSelect || noop, visibleItems: visibleItems, itemsWithPosition: itemsWithPosition, RenderItem: RenderItem }))));
};
VirtualList.displayName = "VirtualList";
//# sourceMappingURL=VirtualList.js.map