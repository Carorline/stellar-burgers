const baseUrl = Cypress.env('api');

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', `${baseUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
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
      .contains('Хрустящие минеральные кольца')
      .should('not.exist');
    cy.get('[data-cy=main_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=souce_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Хрустящие минеральные кольца')
      .should('exist');
  });
});
