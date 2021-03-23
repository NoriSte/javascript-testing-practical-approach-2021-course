/// <reference types="Cypress" />

/**
 * Main goals
 * - Compile all the registration form
 *
 * Additional goals:
 * - Leverage cy.get' aliases
 * - Limit the scope of cy.get by searching only within the form
 */

context('The sign up page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
    cy.visit('/register')
  })

  it('Should allow typing into the input fields', () => {
    cy.get('.form-control').eq(0).type('Foo')
    cy.get('.form-control').eq(1).type('Bar')
    cy.get('.form-control').eq(2).type('Baz')
  })

  it('Playground: limit the scope of cy.get by running it within the form', () => {
    cy.visit('/register')

    // within restricts the cy.get boundaries
    cy.get('form').within(() => {
      // `as` allow avoiding re-writing the selector
      cy.get('.form-control').as('inputFields')

      cy.get('@inputFields').eq(0).type('Foo')
      cy.get('@inputFields').eq(1).type('Bar')
      cy.get('@inputFields').eq(2).type('Baz')
    })
  })
})
