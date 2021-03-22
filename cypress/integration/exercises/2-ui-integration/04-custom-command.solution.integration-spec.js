/// <reference types="Cypress" />

/**
 * Main goals
 * - Create a custom command that get the user authenticated
 */

const headers = { 'Access-Control-Allow-Origin': '*' }

Cypress.Commands.add('visitAuthenticated', { prevSubject: 'optional' }, function (_subject, path) {
  // set up the jwt leveraging the fixture
  cy.fixture('users/signup')
    .its('user')
    // check the fixture content in order to have more direct feedback in case of failures
    .should(
      user => expect(user).to.have.property('token').and.to.be.a('string').and.not.to.be.empty,
    )
    .then(user => localStorage.setItem('jwt', user.token))

  cy.intercept('GET', '**/api/user', { fixture: 'users/user', headers }).as('user-request')
  cy.visit(path)
  cy.wait('@user-request')

  cy.findByText('New Post').should('be.visible')
})

beforeEach(() => {
  // adapt the viewport, allows the instructor to have more vertical windows when sharing the screen
  cy.viewport(600, 900)
})

context('The home page', () => {
  it('Should work', () => {
    cy.intercept('GET', '**/api/articles/feed**', {
      fixture: 'articles/empty-articles',
      headers,
    }).as('feed-request')
    cy.intercept('GET', '**/api/tags', { fixture: 'tags/empty-tags', headers }).as('tags-request')

    cy.visitAuthenticated('/')

    cy.wait(['@tags-request', '@feed-request'])

    cy.findByText('No articles are here... yet.').should('be.visible')
  })
})

context('The create new post page', () => {
  it('Should work', () => {
    cy.visitAuthenticated('/editor')
    cy.findByText('New Post').should('be.visible')
  })
})
