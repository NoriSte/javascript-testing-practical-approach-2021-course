import { Item, ItemId, ItemWithPosition, ModifierKeys } from '../typings'

type Params<T extends Item> = {
  items: ItemWithPosition<T>[]
  oldSelectedIds: ItemId[]
  clickedItemId: ItemId
  modifiers: ModifierKeys
}

export const getUpdatedSelection = <T extends Item>(params: Params<T>): ItemId[] => {
  const {
    items,
    oldSelectedIds,
    clickedItemId,
    modifiers: { altKey, ctrlKey, metaKey, shiftKey },
  } = params

  let newIds: ItemId[] = [...oldSelectedIds]

  if (ctrlKey || metaKey) {
    if (newIds.includes(clickedItemId)) {
      newIds = newIds.filter(id => id !== clickedItemId)
    } else {
      newIds.push(clickedItemId)
    }
  } else if (altKey) {
    newIds = newIds.filter(id => id !== clickedItemId)
  } else if (shiftKey) {
    const lastSelectedId =
      (!!newIds.length ? newIds[newIds.length - 1] : undefined) ?? clickedItemId

    const fromI = items.findIndex(({ item }) => item.id === lastSelectedId)
    const toI = items.findIndex(({ item }) => item.id === clickedItemId)
    const start = toI >= fromI ? fromI : toI
    const end = toI >= fromI ? toI : fromI
    const reverse = toI < fromI

    let selectedIds = items.slice(start, end + 1).map(({ item }) => item.id)
    selectedIds = reverse ? selectedIds.reverse() : selectedIds
    newIds = [...newIds, ...selectedIds]
  } else {
    newIds = [clickedItemId]
  }

  // removing duplicates
  newIds = newIds.filter((id, i) => newIds.lastIndexOf(id) === i)

  return newIds
}
