context('Headless browser', () => {
  it('Must visit the site and take a screenshot', () => {
    cy.visit('https://reactjs.org/')
    cy.screenshot()
  })
})
