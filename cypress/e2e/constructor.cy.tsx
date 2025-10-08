const apiUrl = Cypress.env('apiUrl');
const constructorBunUp = '[data-cy=bun_up_constructor]';
const constructorBunDown = '[data-cy=bun_down_constructor]';
const ingredientsBun = '[data-cy=bun_ingredients]';
const constructorIngredient = '[data-cy=ingredient_constructor]';
const ingredientsMain = '[data-cy=main_ingredients]';
const ingredientsSouce = '[data-cy=souce_ingredients]';
const modal = '[data-cy=modal]';
const closeButton = '[data-cy=close_button]';

describe('Страница конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    });
    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    });
    cy.intercept('POST', `${apiUrl}/orders`, { fixture: 'order.json' });

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );

    cy.setCookie('accessToken', 'Bearer access-token');

    cy.visit('/');
  });

  afterEach(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Тест добавления булки в конструктор', function () {
    cy.get(constructorBunUp)
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get(constructorBunDown)
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get(ingredientsBun).contains('Добавить').click();
    cy.get(constructorBunUp).contains('Краторная булка N-200i').should('exist');
    cy.get(constructorBunDown)
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Тест добавления ингредиента в конструктор', function () {
    cy.get(constructorIngredient)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get(constructorIngredient)
      .contains('Соус фирменный Space Sauce')
      .should('not.exist');
    cy.get(ingredientsMain).contains('Добавить').click();
    cy.get(constructorIngredient)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get(ingredientsSouce).contains('Добавить').click();
    cy.get(constructorIngredient)
      .contains('Соус фирменный Space Sauce')
      .should('exist');
  });

  it('Тест открытия модального окна ингредиента', function () {
    cy.get(modal).should('not.exist');
    cy.get(ingredientsBun).contains('Краторная булка N-200i').click();
    cy.get(modal).contains('Краторная булка N-200i').should('exist');
  });

  it('Тест закрытия модального окна с помощью крестика', function () {
    cy.get(ingredientsBun).contains('Краторная булка N-200i').click();
    cy.get(closeButton).click();
    cy.get(modal).should('not.exist');
  });

  it('Тест закрытия модального окна при клике на overlay', function () {
    cy.get(ingredientsBun).contains('Краторная булка N-200i').click();
    cy.get(modal).should('exist');
    cy.get('[data-cy=overlay]')
      .should('exist')
      .click('topRight', { force: true });
    cy.get(modal).should('not.exist');
  });

  it('Тест создания заказа', function () {
    cy.get(ingredientsBun).contains('Добавить').click();
    cy.get(ingredientsMain).contains('Добавить').click();
    cy.get(ingredientsSouce).contains('Добавить').click();

    cy.get('[data-cy=order_button]')
      .contains('Оформить заказ')
      .should('exist')
      .click();

    cy.get('[data-cy=order_number]').contains('593104').should('exist');

    cy.get(closeButton).click();
    cy.get(modal).should('not.exist');

    cy.get('[data-cy=constructor]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
    cy.get(constructorIngredient).should(
      'not.contain',
      'Соус фирменный Space Sauce'
    );
    cy.get(constructorIngredient).should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
