import { Item, ItemWithPosition } from '../typings'

export const idSeparator = '/@@/'

export const getStringifiedItemIds = <T extends Item>(items: ItemWithPosition<T>[]): string =>
  placeSeparatorAtEnds(items.map(item => item.item.id.toString()).join(idSeparator))

export const placeSeparatorAtEnds = (stringifiedIds: string) =>
  `${stringifiedIds.startsWith(idSeparator) ? '' : idSeparator}${stringifiedIds}${
    stringifiedIds.endsWith(idSeparator) ? '' : idSeparator
  }`.trim()

export const getIdsFromStringifiedIds = (stringifiedIds: string): string[] =>
  stringifiedIds.split(idSeparator).filter(id => id !== '')

export const removeSeparators = (id: string): string => id.replace(new RegExp(idSeparator, 'g'), '')
