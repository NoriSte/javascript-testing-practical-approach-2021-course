import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { getUpdatedSelection } from './core/getUpdatedSelection';
import { RenderItemWrapper } from './RenderItemWrapper';
export const ItemsRenderer = (props) => {
    const { onSelect, RenderItem, visibleItems, selectedItemIds, itemsWithPosition } = props;
    const handleClick = useCallback(params => {
        const { item, event: modifiers } = params;
        onSelect({
            item,
            modifiers,
            newSelectedIds: getUpdatedSelection({
                items: itemsWithPosition,
                oldSelectedIds: selectedItemIds,
                clickedItemId: item.id,
                modifiers,
            }),
        });
    }, [itemsWithPosition, onSelect, selectedItemIds]);
    const children = useMemo(() => visibleItems.map(({ item, y }) => (React.createElement(RenderItemWrapper, { key: item.id, style: { top: y } },
        React.createElement(RenderItem, { item: item, selected: selectedItemIds.includes(item.id), onClick: handleClick })))), [visibleItems, selectedItemIds, handleClick]);
    return React.createElement(React.Fragment, null, children);
};
ItemsRenderer.displayName = 'ItemsRenderer';
//# sourceMappingURL=ItemsRenderer.js.map