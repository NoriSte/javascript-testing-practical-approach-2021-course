import { ItemWithPosition, Item } from '../typings'

type Params<T extends Item> = {
  items: T[]
  itemsHeights: number[]
}

type Result<T extends Item> = ItemWithPosition<T>[]

export const getItemsWithPosition = <T extends Item>(params: Params<T>): Result<T> => {
  const { items, itemsHeights } = params
  const itemsWithPosition: ItemWithPosition<T>[] = []

  let scrollY = 0
  for (let i = 0, n = items.length; i < n; i++) {
    const itemWithPosition = {
      item: items[i],
      y: scrollY,
      height: itemsHeights[i],
    }
    itemsWithPosition.push(itemWithPosition)

    scrollY += itemWithPosition.height
  }

  return itemsWithPosition
}
