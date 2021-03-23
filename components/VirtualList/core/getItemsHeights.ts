import { ItemsHeightsGetter, Item } from '../typings'

type Params<T extends Item> = {
  items: T[]
  getItemHeights: ItemsHeightsGetter<T>
}

export const getItemsHeights = <T extends Item>({ items, getItemHeights }: Params<T>): number[] =>
  items.map((...params) => getItemHeights(...params))
