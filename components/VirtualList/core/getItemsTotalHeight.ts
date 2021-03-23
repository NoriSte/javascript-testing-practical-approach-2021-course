type Params = {
  itemsHeights: number[]
}

type Result = number

export const getItemsTotalHeight = ({ itemsHeights }: Params): Result =>
  itemsHeights.reduce((totalHeight, height) => totalHeight + height, 0)
