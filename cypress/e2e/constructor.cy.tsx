const apiUrl = Cypress.env('apiUrl');

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
    cy.get('[data-cy=bun_up_constructor]')
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get('[data-cy=bun_down_constructor]')
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get('[data-cy=bun_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=bun_up_constructor]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=bun_down_constructor]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Тест добавления ингредиента в конструктор', function () {
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Соус фирменный Space Sauce')
      .should('not.exist');
    cy.get('[data-cy=main_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=souce_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Соус фирменный Space Sauce')
      .should('exist');
  });

  it('Тест открытия модального окна ингредиента', function () {
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=modal]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Тест закрытия модального окна с помощью крестика', function () {
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=close_button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Тест закрытия модального окна при клике на overlay', function () {
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=overlay]')
      .should('exist')
      .click('topRight', { force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Тест создания заказа', function () {
    cy.get('[data-cy=bun_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=main_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=souce_ingredients]').contains('Добавить').click();

    cy.get('[data-cy=order_button]')
      .contains('Оформить заказ')
      .should('exist')
      .click();

    cy.get('[data-cy=order_number]').contains('593104').should('exist');

    cy.get('[data-cy=close_button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=constructor]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy=ingredient_constructor]').should(
      'not.contain',
      'Соус фирменный Space Sauce'
    );
    cy.get('[data-cy=ingredient_constructor]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
