/// <reference types="Cypress" />

/**
 * Main goals
 * - Click the button
 * - Sleep the test 10 seconds
 * - Assert that everything works
 * - Check that the test works if launched more times
 *
 * Additional goals:
 * - Avoid unnecessary waiting
 */

context('The sign up page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
    cy.visit('/register')
  })

  it('Should allow registering and redirects the user to the home page', () => {
    const random = Math.round(Math.random() * 1000000)

    // this is an E2E test, hence the back-end is a real one. The same user can't be registered more
    // than once, we need to generate random users
    cy.get('.form-control').eq(0).type(`foo${random}`)
    cy.get('.form-control').eq(1).type(`foo${random}@bar.com`)
    cy.get('.form-control').eq(2).type('baz')

    cy.get('button').click()

    // waiting for the redirect to the home page
    cy.wait(10000)

    cy.location().its('pathname').should('eq', '/')
  })

  it('Playground: avoid unnecessary timeout', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.get('.form-control').eq(0).type(`foo${random}`)
    cy.get('.form-control').eq(1).type(`foo${random}@bar.com`)
    cy.get('.form-control').eq(2).type('baz')

    cy.get('button').click()

    cy.location()
      // if `should` fails, it retries the previous, side-effects free, command
      .its('pathname', { timeout: 10000 })
      .should('eq', '/')
  })
})
