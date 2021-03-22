/// <reference types="Cypress" />

import jestExpect from 'expect'

/**
 * Main goals
 * - Write a custom command that abstracts away the authentication code
 *
 * * Additional goals:
 * - Control logging instead of using Cypress' default one
 */

Cypress.Commands.add('register', { prevSubject: 'optional' }, function (_subject) {
  cy.visit('/register')

  const random = Math.round(Math.random() * 1000000)

  cy.findByPlaceholderText('Username', { log: false }).type(`foo${random}`, { delay: 0 })
  cy.findByPlaceholderText('Email', { log: false }).type(`foo${random}@bar.com`, { delay: 0 })
  cy.findByPlaceholderText('Password', { log: false }).type('baz', { delay: 0 })

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

    // assert about the response payload
    const responseBody = interception.response.body
    expect(responseBody.user).to.have.property('username', `foo${random}`)
    expect(responseBody.user).to.have.property('email', `foo${random}@bar.com`)
    // we can't assert about the payload content because it's randomic
    expect(responseBody.user).to.have.property('token').and.to.be.a('string').and.not.to.be.empty
  })

  cy.findByText('No articles are here... yet.', { timeout: 10000 }).should('be.visible')
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
