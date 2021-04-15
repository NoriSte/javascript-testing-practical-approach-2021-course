### Adding Cypress to an existing project

- npm install -D cypress

- add script to package.json
```json
"cy:open":"cypress open",
"cy:run":"cypress run"
```
- delete cypress/integration/examples

- create a smoke test
  - create cypres/integration/smoke.spec.js
```js
/// <reference types="Cypress" />

context('smoke', () => {
  it('Should work', ()=>{
    cy.visit('/')
  })
});
```

- edit cypress.json adding baseUrl

- install start-server-and test

- ass script to package.json
```json
"test": "start-server-and-test start http://localhost:4208 cy:run",
```


Now:
- launching `$ npm run cy:open` allows to use Cypress locally
- launching `$ npm test` allows to start the application and test it in CI
