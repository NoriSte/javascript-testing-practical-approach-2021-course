type Params = {
  y: number
  height: number
  scrollY: number
  scrollHeight: number
}

type Result =
  | 'hidden-at-top'
  | 'hidden-at-bottom'
  | 'fully-visible'
  | 'partially-visible'
  | 'partially-visible-at-top'
  | 'partially-visible-at-bottom'

export const getScrollIntersectionType = (params: Params): Result => {
  const { y: itemTop, height, scrollY: scrollTop, scrollHeight } = params
  const scrollBottom = scrollTop + scrollHeight
  const itemBottom = itemTop + height
  let result: Result

  if (scrollBottom <= itemTop) {
    result = 'hidden-at-bottom'
  } else if (scrollTop >= itemBottom) {
    result = 'hidden-at-top'
  } else {
    const isItemFullyShowable = scrollHeight >= height
    if (isItemFullyShowable) {
      if (scrollBottom > itemTop && scrollBottom < itemBottom) {
        result = 'partially-visible-at-bottom'
      } else if (scrollTop > itemTop && scrollTop < itemBottom) {
        result = 'partially-visible-at-top'
      } else {
        result = 'fully-visible'
      }
    } else {
      if (scrollTop < itemTop && scrollBottom > itemTop) {
        result = 'partially-visible-at-bottom'
      } else if (scrollTop < itemBottom && scrollBottom > itemBottom) {
        result = 'partially-visible-at-top'
      } else {
        result = 'partially-visible'
      }
    }
  }

  return result
}
