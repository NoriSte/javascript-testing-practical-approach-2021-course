/// <reference types="Cypress" />

import jestExpect from 'expect'

/**
 * Main goals
 * - Leverage the app action exposed by the React application
 */

Cypress.Commands.add('register', { prevSubject: 'optional' }, function (_subject) {
  cy.visit('/register')

  const random = Math.round(Math.random() * 1000000)
  const credentials = {
    username: `foo${random}`,
    email: `foo${random}@bar.com`,
    password: 'baz',
  }

  cy.intercept('POST', '**/api/users').as('signup-request')

  cy.window().its('appActions').invoke('signup', credentials)

  cy.wait('@signup-request').then(interception => {
    // ... all the payload assertions are skipped for brevity...
  })

  cy.findByText('New Post', { timeout: 10000 }).should('be.visible')
})

context('The New Post page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
  })

  it('Should exist', () => {
    cy.register()
    cy.visit('/editor')
  })
})