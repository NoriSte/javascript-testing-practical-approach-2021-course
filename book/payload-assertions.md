# Asserting on payloads

Here we are again: before summing up all the improvements we made to the original test, we need to speak about AJAX payloads assertions. The original [list of problems](utility-in-case-of-failure.md#error-feedback) listed two possible errors related to payloads

- the AJAX call has the wrong request payload

- the API returns the wrong payload

Both of them could break the app without any meaningful feedback at the moment. Cypress provides us all the APIs to check them.

First of all, the request payload looks like this (I found it inspecting the front-end requests)

```json
{
  "user": {
    "username": "Tester92306",
    "email": "user+92306@realworld.io",
    "password": "mysupersecretpassword"
  }
}
```

and the response payload looks like the following

```json
{
  "user": {
    "username": "tester92306",
    "email": "user+92306@realworld.io",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzA5NmY3MWM2YTQ5MDVjM2VhMGM3NSIsInVzZXJuYW1lIjoidGVzdGVyOTIzMDYiLCJleHAiOjE1NzI4NDczNjcsImlhdCI6MTU2NzY1OTc2N30.uT9qGkT4FPCHwkV2A_7rbRFb_YqJN3cyncdbKOC3xNY"
  }
}
```

We note that:

- the `username` property are the same but the second one is converted to lower case

- the `email` is obviously the same

- the `token` is a string that changes everytime

Asserting about them means checking that:

- the request payload contains a `user` object that contains the data used to fill the form

- the response payload contains both the `email` and the `username`, the `token` is a string that's 200-210 characters long (it's a JSON Web Token)

Do we need to verify the `token` is syntactically correct?
<br />
The right question is: does the front-end app parse and use it? **Does the front-end break if the token is not valid**? If the answer is Yes, assert about it! Otherwise, it's not necessary! Soft assertions ("it's not empty") do not cost but deep checks (decrypting it and checking the content) do not make sense if you think about how the front-end consumes it.

Starting from the most recent test

<i>File: cypress/integration/examples/signup/signup-6-ajax-request-waiting.e2e.spec.js</i>
[include](../cypress/integration/examples/signup/signup-6-ajax-request-waiting.e2e.spec.js)

The `cy.wait("@signup-request")` call yields the whole XHR object. We can inspect its content doing

```javascript
cy.wait("@signup-request").should(interception => {
  console.log(JSON.stringify(interception));
});
```

the result is the following

```json
{
  "id":"interceptedRequest13",
  "request":{
     "headers":{
        "host":"localhost:3100",
        "proxy-connection":"keep-alive",
        "content-length":"102",
        "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/6.0.1 Chrome/87.0.4280.67 Electron/11.0.2 Safari/537.36",
        "content-type":"application/json",
        "accept":"*/*",
        "origin":"http://localhost:4100",
        "sec-fetch-site":"same-site",
        "sec-fetch-mode":"cors",
        "sec-fetch-dest":"empty",
        "referer":"http://localhost:4100/register",
        "accept-encoding":"gzip, deflate, br",
        "accept-language":"en-GB"
     },
     "url":"http://localhost:3100/api/users",
     "method":"POST",
     "httpVersion":"1.1",
     "body":{
        "user":{
           "username":"Tester92306",
           "email":"user+92306@realworld.io",
           "password":"mysupersecretpassword"
        }
     }
  },
  "state":"Complete",
  "requestWaited":true,
  "responseWaited":true,
  "log":{
     "name":"interception",
     "displayName":"req",
     "alias":"signup-request",
     "aliasType":"route",
     "type":"parent",
     "event":true,
     "method":"POST",
     "timeout":4000,
     "message":"",
     "id":14,
     "state":"passed",
     "instrument":"command",
     "url":"http://localhost:4100/register",
     "hookId":"r3",
     "testId":"r3",
     "testCurrentRetry":0,
     "viewportWidth":1000,
     "viewportHeight":660,
     "wallClockStartedAt":"2020-12-04T07:33:22.807Z",
     "chainerId":"chainer131",
     "ended":true,
     "consoleProps":{
        "Event":"interception",
        "Alias":"signup-request",
        "Method":"POST",
        "URL":"http://localhost:3100/api/users",
        "Matched":{
           "method":"POST",
           "url":"**/api/users"
        },
        "Snapshot":"The snapshot is missing. Displaying current state of the DOM."
     },
     "renderProps":{
        "indicator":"successful",
        "message":"http://localhost:3100/api/users Complete"
     }
  },
  "response":{
     "headers":{
        "x-powered-by":"Express",
        "access-control-allow-origin":"*",
        "vary":"X-HTTP-Method-Override",
        "content-type":"application/json; charset=utf-8",
        "content-length":"281",
        "etag":"W/\"119-wS6/hxBFrobqUXvmDtTbBGkoQM0\"",
        "date":"Fri, 04 Dec 2020 07:33:24 GMT",
        "connection":"keep-alive"
     },
     "url":"http://localhost:3100/api/users",
     "method":null,
     "httpVersion":"1.1",
     "statusCode":200,
     "statusMessage":"OK",
     "body":{
        "user":{
           "username":"tester92306",
           "email":"user+92306@realworld.io",
           "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYzllNjQ0MzEyZjMxNWEyY2M4M2RjOCIsInVzZXJuYW1lIjoidGVzdGVyODgwMiIsImV4cCI6MTYxMjI1MTIwNCwiaWF0IjoxNjA3MDY3MjA0fQ.wLPhLQY9CAwAMQpriV_nlmW-3wg8QsQBYCjy0wwanKU"
        }
     }
  }
}
```

Let's assert about the payloads: we could chain assertions (the same we did with the `.should("be.visible")` assertion) to the AJAX request waiting. Beginning with the `username` property

```diff
it("The happy path should work", () => {
+   const random = Math.floor(Math.random() * 100000);
+   const user = {
+     username: `Tester${random}`,
+     email: `user+${random}@realworld.io`,
+     password: "mysupersecretpassword"
+   };

    // set up AJAX call interception
    cy.intercept("POST", "**/api/users").as("signup-request");

    cy.visit(paths.register);

    // form filling
-   const random = Math.floor(Math.random() * 100000);
    cy.findByPlaceholderText(strings.username).type(`Tester${random}`);
    cy.findByPlaceholderText(strings.email).type(`user+${random}@realworld.io`);
    cy.findByPlaceholderText(strings.password).type("mysupersecretpassword");

    // form submit...
    cy.get("form")
      .within(() => cy.findByText(strings.signUp).click());
    // ... and AJAX call waiting
-   cy.wait("@signup-request");
+   cy.wait("@signup-request")
+     .its("request.body")
+     .should("have.property", "user")
+     .and("be.a", "object")
+     .should("have.property", "username", user.username);

    // end of the flow
    cy.findByText(noArticles).should("be.visible");
  });

```

We return on that later, but that's the actual feedback of the Test Runner

<div>
    <img src="../assets/images/payload-assertions/request-payload-assertion.png" alt="Request payload assertions" style="width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;" class="img-border"/>
</div>

<br /><br />Chaining the assertions this way is nice but it does not give us all the freedom we need. What I mean: I try to analyze the yielded subject for every line of code

```javascript
cy.wait("@signup-request") // yields the whole `interception` object
  .its("request.body") // yields `interception.request.body`
  .should("have.property", "user") // yields `interception.request.body.user`
  .and("be.a", "object") // (still) yields `interception.request.body.user`
  .should("have.property", "username", user.username) // yields `interception.request.body.user.username`
  // ... how we can assert about `interception.request.body.user.email`?
  .and("have.property", "email", user.email); // will fail because `interception.request.body.user.username` does not have an `email` property
```

Asserting directly on `cy.wait("@signup-request")` will not work, that's why we need to take advantage of another assertion syntax, the following one

```javascript
cy.wait("@signup-request").should(interception => {
  expect(interception.request.body)
    .to.have.property("user")
    .and.to.be.a("object");
  expect(interception.request.body.user).to.have.property("username", user.username);
  expect(interception.request.body.user).to.have.property("email", user.email);
});
```

this way you always have a reference the original `interception` object and its data. Since we have a list of all the things we need to assert about, writing all the assertions is easy:

- request payload assertions

```javascript
expect(interception.request.body)
  .to.have.property("user")
  .and.to.be.a("object");
let payload = interception.request.body.user;
expect(payload).to.have.property("username", user.username);
expect(payload).to.have.property("email", user.email);
expect(payload).to.have.property("password", user.password);
```

- response payload assertions

```javascript
expect(interception.response.body)
  .to.have.property("user")
  .and.to.be.a("object");
payload = interception.response.body.user;
expect(payload).to.have.property("username", user.username.toLowerCase());
expect(payload).to.have.property("email", user.email);
expect(payload)
  .to.have.property("token")
  .and.to.be.a("string").and.not.to.be.empty;
```

- response status assertion (it's important too)

```javascript
expect(interception.response.statusCode).to.equal(200);
```

The whole file is the following

<i>File: cypress/integration/examples/signup/signup-7-ajax-payload-assertion.e2e.spec.js</i>
[include](../cypress/integration/examples/signup/signup-7-ajax-payload-assertion.e2e.spec.js)

You can read more about the Cypress assertions in the [official documentation](https://docs.cypress.io/guides/references/assertions.html).

In the next screenshot you can find (one of) the result of so much assertions: a punctual feedback in case of an error with the AJAX request

<div>
    <img src="../assets/images/feedback-in-case-of-failure/request-payload-error.png" alt="Request payload error" style="width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;" class="img-border"/>
</div>

### Smarter assertions

The assertions show above are precise but not so smart. Their feedback is not smart neither, take a look at the next screenshot

<div>
    <img src="../assets/images/payload-assertions/extremely-long-feedback.png" alt="Extremely long feedback" style="width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;" class="img-border"/>
</div>
<br /><br />
We can maintain all the usefulness of the feedback while making them a little smarter leveraging one of the combinations offered by Cypress to write assertions. The next code asserts the same things in a more concise mode and with more concise feedback too

```javascript
cy.wait("@signup-request").should(interception => {
  expect(interception.request.body).deep.equal({
    user: {
      username: user.username,
      email: user.email,
      password: user.password
    }
  });

  expect(interception.response.statusCode).to.equal(200);

  cy.wrap(interception.response.body)
    .should("have.property", "user")
    .and(
      user =>
        expect(user)
          .to.have.property("token")
          .and.to.be.a("string").and.not.to.be.empty
    )
    .and("deep.include", {
      username: user.username.toLowerCase(),
      email: user.email
    });
});
```

<div>
    <img src="../assets/images/payload-assertions/concise-feedback.png" alt="More concise feedback" style="width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;" class="img-border"/>
</div>
<br /><br />

You can find the whole test code in the _signup-8-simpler-assertions.e2e.spec.js_ file.

### Chai plugins

For the sake of curiosity, we can condense the previous assertions again. For example, with the [`chai-subset`](https://www.npmjs.com/package/chai-subset) plugin ([Chai](https://www.chaijs.com) is a famous assertion library included by Cypress) we can write a giant assertion that checks everything: the status and the payloads

```javascript
cy.wait("@signup-request").should(interception => {
  expect(interception).to.containSubset({
    request: {
      body: {
        user: {
          username: user.username,
          email: user.email,
          password: user.password
        }
      }
    },
    response: {
      statusCode: 200,
      body: {
        user: {
          username: user.username.toLowerCase(),
          email: user.email
        }
      }
    }
  });
});
```

but it's not recommended because, in case of failure, the feedback is too much generic:

<div>
    <img src="../assets/images/feedback-in-case-of-failure/chai-subset-error.png" alt="Chai subset error" style="width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;" class="img-border"/>
</div>
<br /><br />

If you'd like to know how you can install a Chai plugin and use it in Cypress:

- open the `cypress/support/index.js` file

- import the plugin with `import chaiSubset from "chai-subset";`

- add it to Chai with `chai.use(chaiSubset);`

The test code is in the _signup-9-chai-plugin.e2e.spec.js_ file.

<p style='text-align: right;'>Author: <a href="about-us.md#stefano-magni">Stefano Magni</a></p>
