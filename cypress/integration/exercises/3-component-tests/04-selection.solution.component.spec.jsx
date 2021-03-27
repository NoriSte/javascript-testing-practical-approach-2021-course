/// <reference types="Cypress" />
/// <reference types="cypress-wait-until" />

/**
 * Main goals
 * - Test that clicking on an item select it
 */

import React from 'react'
import { mount } from '@cypress/react'
import { VirtualList } from '../../../../components/VirtualList/VirtualList'

// The item renderer to be passed to the list
const createRenderItem = ({ height }) => ({ item, onClick }) => {
  // the colors are helpful to easily distinguish the rows
  const backgroundColor = parseInt(item.id.toString()) % 2 ? '#DDD' : '#EEE'

  return (
    <div
      style={{ height, backgroundColor, fontSize: 15, fontFamily: 'arial' }} // the item must call the onClick callback to get the selection work
      onClick={event => {
        onClick({ item, event })
      }}
    >
      {item.name}
    </div>
  )
}

describe('VirtualList', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(300, 300)
  })

  it('Should select an item when the item is clicked', () => {
    // ------------------------------------------
    // Arrange

    // creating the stub
    // a stub is needed to intercept the call the VirtualList does
    const onSelectStub = cy.stub().as('onSelect')

    // creating the data
    const itemHeight = 30
    const listHeight = 90
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]

    // mounting the component
    mount(
      <VirtualList
        items={items}
        getItemHeights={() => itemHeight}
        RenderItem={createRenderItem({ height: itemHeight })}
        listHeight={listHeight}
        onSelect={onSelectStub}
      />,
    )

    // ------------------------------------------
    // Act
    cy.findByText('Item 1').click()

    // ------------------------------------------
    // Assert (cy.wrap(onSelectStub) would do the same)
    cy.get('@onSelect').should(stub => {
      expect(stub).to.have.been.calledOnce

      // see
      // https://sinonjs.org/releases/latest/assertions/
      // https://sinonjs.org/releases/latest/matchers/
      expect(stub).to.have.been.calledWith(Cypress.sinon.match({ newSelectedIds: [1] }))

      // Sinon matchers allow to assert about partials of the params
      expect(stub).to.have.been.calledWith(Cypress.sinon.match({ item: { id: 1, name: 'Item 1' } }))
    })
  })
})
