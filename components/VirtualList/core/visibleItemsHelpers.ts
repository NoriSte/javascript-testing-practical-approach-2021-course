import { Item, ItemWithPosition } from '../typings'
import { getScrollIntersectionType } from './getScrollIntersectionType'

type Params<T extends Item> = {
  items: ItemWithPosition<T>[]
  scrollY: number
  scrollHeight: number
}

export const getFirstVisibleAtTopItem = <T extends Item>(
  params: Params<T>,
): ItemWithPosition<T> | undefined => {
  const { items, scrollY, scrollHeight } = params

  return items.find(item => {
    const scrollIntersectionType = getScrollIntersectionType({
      y: item.y,
      height: item.height,
      scrollY,
      scrollHeight,
    })

    return (
      scrollIntersectionType === 'fully-visible' ||
      scrollIntersectionType === 'partially-visible-at-top'
    )
  })
}

export const getVisibleAtTopItemsOnly = <T extends Item>(
  params: Params<T>,
): ItemWithPosition<T>[] => {
  const { items, scrollY, scrollHeight } = params

  return items.filter(item => {
    const scrollIntersectionType = getScrollIntersectionType({
      y: item.y,
      height: item.height,
      scrollY,
      scrollHeight,
    })

    return (
      scrollIntersectionType === 'fully-visible' ||
      scrollIntersectionType === 'partially-visible-at-top'
    )
  })
}
