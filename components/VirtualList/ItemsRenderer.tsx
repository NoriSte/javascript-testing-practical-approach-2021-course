import * as React from 'react'
import { useCallback, useMemo } from 'react'

import {
  Item,
  ItemWithPosition,
  RenderItemProps,
  ItemId,
  OnSelectCallback,
  OnClickHandlerParams,
} from './typings'

import { getUpdatedSelection } from './core/getUpdatedSelection'
import { RenderItemWrapper } from './RenderItemWrapper'

type ItemsRendererProps<T extends Item> = {
  selectedItemIds: ItemId[]
  onSelect: OnSelectCallback<T>
  visibleItems: ItemWithPosition<T>[]
  itemsWithPosition: ItemWithPosition<T>[]
  RenderItem: React.ComponentType<RenderItemProps<T>>
}

export const ItemsRenderer = <T extends Item>(props: ItemsRendererProps<T>) => {
  const { onSelect, RenderItem, visibleItems, selectedItemIds, itemsWithPosition } = props

  // The component updates the selection and the modifiers, but give its consumer all the necessary
  // data to manage the selection itself
  type HandleClick = (params: OnClickHandlerParams<T>) => any
  const handleClick = useCallback<HandleClick>(
    params => {
      const { item, event: modifiers } = params

      onSelect({
        item,
        modifiers,
        newSelectedIds: getUpdatedSelection({
          items: itemsWithPosition,
          oldSelectedIds: selectedItemIds,
          clickedItemId: item.id,
          modifiers,
        }),
      })
    },
    [itemsWithPosition, onSelect, selectedItemIds],
  )

  const children = useMemo(
    () =>
      visibleItems.map(({ item, y }) => (
        <RenderItemWrapper key={item.id} style={{ top: y }}>
          <RenderItem
            item={item}
            selected={selectedItemIds.includes(item.id)}
            onClick={handleClick}
          />
        </RenderItemWrapper>
      )),
    [visibleItems, selectedItemIds, handleClick],
  )

  return <>{children}</>
}

ItemsRenderer.displayName = 'ItemsRenderer'
