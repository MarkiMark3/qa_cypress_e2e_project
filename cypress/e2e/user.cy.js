/// <reference types='cypress' />
/// <reference types='../support' />

import { faker } from '@faker-js/faker';
import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();
const title = faker.lorem.word();
const about = faker.lorem.words();
const article = faker.lorem.text();

describe('User', () => {
  let user1;
  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      user1 = generateUser;
    });
    cy.register();
    signInPage.visit();
    signInPage.typeEmail('riot@qa.team');
    signInPage.typePassword('12345Qwert!');
    signInPage.clickSignInBtn();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.newArticle(title, about, article);
  });

  it('should be able to follow the another user', () => {
    signInPage.visit();
    cy.register(user1.email, user1.username, user1.password);
    signInPage.typeEmail(user1.email);
    signInPage.typePassword(user1.password);
    signInPage.clickSignInBtn();
    cy.contains('a', 'Your Feed').click();
    cy.get('.author').click();
  });
});
