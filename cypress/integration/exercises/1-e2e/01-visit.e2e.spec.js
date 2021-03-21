/// <reference types="Cypress" />

/**
 * Main goals
 * - Visit the home page of the site
 *
 * Additional goals
 * - Change the viewport size
 * - Change the viewport once for all the tests
 */

context('The site', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
  })

  it('Should work', () => {
    // thanks to cypress.json, the url could be simply '/'
    cy.visit('http://localhost:4100')
  })
})
