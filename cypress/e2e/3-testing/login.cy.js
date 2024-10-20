// The user can log in with valid credentials

describe('Login function', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Should store a token when logging in with valid credentials', () => {
    cy.intercept(
      'POST',
      'https://nf-api.onrender.com/api/v1/social/auth/login',
      {
        statusCode: 200,
        body: {
          accessToken: 'test-token',
          name: 'test',
        },
      },
    ).as('login');

    cy.intercept(
      'GET',
      'https://nf-api.onrender.com/api/v1/social/profiles/test?&_followers=true&_posts=true&_following=true',
      {
        statusCode: 200,
        body: {
          name: 'test',
          email: 'testing@stud.noroff.no',
          banner: null,
          avatar: null,
          followers: [],
          following: [],
          posts: [],
          _count: {
            posts: 0,
            followers: 0,
            following: 0,
          },
        },
      },
    ).as('getProfile');

    cy.visit('http://localhost:8080/');

    cy.wait(1000).then(() => {
      cy.contains('#registerForm button', 'Login').click();

      cy.wait(1000).then(() => {
        cy.get('#loginModal input[id="loginEmail"]').type(
          'testing@stud.noroff.no',
        );
        cy.get('#loginModal input[id="loginPassword"]').type('testing123');
        cy.get('#loginModal button[type="submit"]').click();

        cy.wait('@login').then(() => {
          cy.wait(1000).then(() => {
            const token = JSON.parse(localStorage.getItem('token'));
            expect(token).to.equal('test-token');
          });
        });
      });
    });
  });

  it('Should display error when loggin in with invalid credentials', () => {
    cy.visit('http://localhost:8080/');

    cy.wait(1000).then(() => {
      cy.contains('#registerForm button', 'Login').click();

      cy.wait(1000).then(() => {
        cy.get('#loginModal input[id="loginEmail"]').type(
          'testing@invalid.email',
        );
        cy.get('#loginModal input[id="loginPassword"]').type('testing123');
        cy.get('#loginModal button[type="submit"]').click();

        cy.wait(100).then(() => {
          cy.get('#loginModal input[id="loginEmail"]').then(($input) => {
            expect($input[0].validity.valid).to.equal(false);
          });
        });
      });
    });
  });

  it('Should remove token when logging out', () => {
    cy.intercept(
      'POST',
      'https://nf-api.onrender.com/api/v1/social/auth/login',
      {
        statusCode: 200,
        body: {
          accessToken: 'test-token',
          name: 'test',
        },
      },
    ).as('login');

    cy.intercept(
      'GET',
      'https://nf-api.onrender.com/api/v1/social/profiles/test?&_followers=true&_posts=true&_following=true',
      {
        statusCode: 200,
        body: {
          name: 'test',
          email: 'testing@stud.noroff.no',
          banner: null,
          avatar: null,
          followers: [],
          following: [],
          posts: [],
          _count: {
            posts: 0,
            followers: 0,
            following: 0,
          },
        },
      },
    ).as('getProfile');

    cy.visit('http://localhost:8080/');

    cy.wait(500).then(() => {
      cy.contains('#registerForm button', 'Login').click();

      cy.wait(500).then(() => {
        cy.get('#loginModal input[id="loginEmail"]').type(
          'testing@stud.noroff.no',
        );
        cy.get('#loginModal input[id="loginPassword"]').type('testing123');
        cy.get('#loginModal button[type="submit"]').click();

        cy.wait('@login').then(() => {
          cy.wait(500).then(() => {
            cy.contains('button', 'Logout').click();
            cy.wait(500).then(() => {
              const token = JSON.parse(localStorage.getItem('token'));
              expect(token).to.equal(null);
            });
          });
        });
      });
    });
  });
});
