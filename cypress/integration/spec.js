describe('Login page', () => {
	beforeEach(() => {
		cy.visit('/login')
	});

	it('has username and password inputs', () => {
		let usernameInput = cy.get('input[name="username"]');
		let passwordInput = cy.get('input[name="username"]');
		
		expect(usernameInput).to.exist
		expect(passwordInput).to.exist
	});

	it('has login button, disabled', () => {
		let primaryButton = cy.get('.btn.btn-primary');
		expect(primaryButton).to.exist;

		primaryButton.contains("Iniciar sesión")
		primaryButton.should('be.disabled')
	});

	it('enables login button', () => {

		let usernameInput = cy.get('input[name="username"]');
		usernameInput.type('user1')

		let passwordInput = cy.get('input[name="password"]');
		passwordInput.type('pass1')

		let primaryButton = cy.get('.btn.btn-primary');
		expect(primaryButton).to.exist;

		primaryButton.should('not.be.disabled')
	})
});