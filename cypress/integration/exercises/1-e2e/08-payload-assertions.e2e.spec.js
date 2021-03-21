/// <reference types="Cypress" />

/**
 * Main goals
 * - Assert about the request payload
 *
 * * Additional goals:
 * - Check even the response status
 */

context('The sign up page', () => {
  beforeEach(() => {
    // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
    cy.viewport(600, 900)
    cy.visit('/register')
  })

  it('Should allow registering and redirects the user to the home page', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.findByPlaceholderText('Username').type(`foo${random}`)
    cy.findByPlaceholderText('Email').type(`foo${random}@bar.com`)
    cy.findByPlaceholderText('Password').type('baz')

    cy.intercept('POST', '**/api/users').as('signup-request')

    cy.get('form').within(() => cy.findByText('Sign up').click())

    cy.wait('@signup-request')
      .its('request.body')
      // asserting on request payload allows excluding some error factors in case the test fails
      .should('deep.equal', {
        user: {
          username: `foo${random}`,
          email: `foo${random}@bar.com`,
          password: 'baz',
        },
      })

    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })

  it.only('Playground: assert about the response status', () => {
    const random = Math.round(Math.random() * 1000000)

    cy.findByPlaceholderText('Username').type(`foo${random}`)
    cy.findByPlaceholderText('Email').type(`foo${random}@bar.com`)
    cy.findByPlaceholderText('Password').type('baz')

    cy.intercept('POST', '**/api/users').as('signup-request')

    cy.get('form').within(() => cy.findByText('Sign up').click())

    cy.wait('@signup-request').then(interception => {
      // assert about the request payload
      expect(interception.request.body).to.deep.eq({
        user: {
          username: `foo${random}`,
          email: `foo${random}@bar.com`,
          password: 'baz',
        },
      })

      // assert about the response status code
      expect(interception.response.statusCode).to.eq(200)
    })

    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })
})
