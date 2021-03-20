/// <reference types="Cypress" />

import jestExpect from 'expect'

/**
 * Main goals
 * - Assert about the response status code
 * - Assert about the response payload
 *
 * * Additional goals:
 * - Leverage Jest' expect instead of Cypress' expect (FYI: Cypress' expect is Chai' expect)
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

    cy.intercept('POST', 'http://localhost:3100/api/users').as('signup-request')

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

      // assert about the response payload
      const responseBody = interception.response.body
      expect(responseBody.user).to.have.property('username', `foo${random}`)
      expect(responseBody.user).to.have.property('email', `foo${random}@bar.com`)
      // we can't assert about the payload content because it's randomic
      expect(responseBody.user).to.have.property('token').and.to.be.a('string').and.not.to.be.empty
    })

    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })

  it(`Playground: assert using Jest' expect the response status`, () => {
    const random = Math.round(Math.random() * 1000000)

    cy.findByPlaceholderText('Username').type(`foo${random}`)
    cy.findByPlaceholderText('Email').type(`foo${random}@bar.com`)
    cy.findByPlaceholderText('Password').type('baz')

    cy.intercept('POST', 'http://localhost:3100/api/users').as('signup-request')

    cy.get('form').within(() => cy.findByText('Sign up').click())

    cy.wait('@signup-request').then(interception => {
      // assert about the request payload
      jestExpect(interception.request.body).toEqual({
        user: {
          username: `foo${random}`,
          email: `foo${random}@bar.com`,
          password: 'baz',
        },
      })

      // assert about the response status code
      jestExpect(interception.response.statusCode).toBe(200)

      // assert about the response payload
      jestExpect(interception.response.body).toEqual({
        user: {
          username: `foo${random}`,
          email: `foo${random}@bar.com`,
          token: jestExpect.any(String),
        },
      })
    })

    cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
  })
})
