/// <reference types="Cypress" />

/**
 * Main goals
 * - Leverage Testing Library
 *
 * * Additional goals:
 * - Retrieve the button through its role
 */

context('The sign up page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
    cy.visit('/register')
  })

  it('Should allow registering and redirects the user to the home page', () => {
    const random = Math.round(Math.random() * 1000000)

    // retrieve elements from the page the same way the user does guarantees the highest possible
    // confidence
    cy.findByPlaceholderText('Username').type(`foo${random}`)
    cy.findByPlaceholderText('Email').type(`foo${random}@bar.com`)
    cy.findByPlaceholderText('Password').type('baz')

    cy.intercept('POST', 'http://localhost:3100/api/users').as('signup-request')

    cy.get('form').within(() => cy.findByText('Sign up').click())

    cy.wait('@signup-request')

    // from a user perspective, asserting about the content of the page is better than checking the
    // URL (because the redirect could happen but the page could be blank)
    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })

  it('Playground: retrieve button by role', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.findByPlaceholderText('Username').type(`foo${random}`)
    cy.findByPlaceholderText('Email').type(`foo${random}@bar.com`)
    cy.findByPlaceholderText('Password').type('baz')

    cy.intercept('POST', 'http://localhost:3100/api/users').as('signup-request')

    cy.findByRole('button', { name: 'Sign up' }).click()

    cy.wait('@signup-request')

    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })
})
