/// <reference types="Cypress" />

context('The custom command could be run before the test code', () => {
  it('Should leverage the custom authentication command to navigate the home page', () => {
    cy.intercept('GET', '**/api/tags', { fixture: 'fixture: 'private/tags/empty-tags' }).as(
      'get-tags',
    )
    cy.intercept('GET', '**/api/articles/feed**', {
      fixture: 'private/articles/empty-articles',
    }).as('get-feed')

    cy.authenticateAndVisitIntegration('/')

    cy.wait(['@get-tags', '@get-feed'])
  })

  it('Should leverage the custom authentication command to navigate the editor page', () => {
    cy.authenticateAndVisitIntegration('/editor')
    // the rest of the code
  })
})
