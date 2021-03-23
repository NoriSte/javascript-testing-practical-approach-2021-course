/// <reference types="Cypress" />

/**
 * Main goals
 * - Intercept the XHR request
 * - Wait for the XHR request
 *
 * Additional goals:
 * - Leverage glob search to avoid hardcoding the server host
 */

context('The sign up page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
    cy.visit('/register')
  })

  it('Should allow registering and redirects the user to the home page', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.get('.form-control').eq(0).type(`foo${random}`)
    cy.get('.form-control').eq(1).type(`foo${random}@bar.com`)
    cy.get('.form-control').eq(2).type('baz')

    cy.intercept('POST', 'http://localhost:3100/api/users').as('signup-request')

    cy.get('button').click()
    cy.wait('@signup-request')

    cy.location().its('pathname').should('eq', '/')
  })

  it('Playground: avoid hardcoding the server host', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.get('.form-control').eq(0).type(`foo${random}`)
    cy.get('.form-control').eq(1).type(`foo${random}@bar.com`)
    cy.get('.form-control').eq(2).type('baz')

    cy.intercept('POST', '**/api/users').as('signup-request')

    cy.get('button').click()
    cy.wait('@signup-request')

    cy.location().its('pathname').should('eq', '/')
  })
})