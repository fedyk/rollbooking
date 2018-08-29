/**
 * Calendar related staff
 */

'use strict';

var calendar = (function() { 'use strict';

/**
 * Main namespace
 */
var calendar = {};

var MDCRipple = mdc.ripple.MDCRipple;
var MDCDialog = mdc.dialog.MDCDialog;
var MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
var MDCDialogUtil = mdc.dialog.util;
var MDCTextField = mdc.textField.MDCTextField;
var MDCMenu = mdc.menu.MDCMenu;

/**
 * Salon Users List Module
 */
function SalonUsers(root) {

	/**
	 * @type {HTMLDivElement}
	 */
	this.root_ = root;

	/**
	 * @type {MDCMenu[]}
	 */
	this.menus_ = [];
}

/**
 * Reset list content
 * @param {string} html 
 * @return {SalonUsers}
 */
SalonUsers.prototype.resetContent = function(html) {
	return this.root_.innerHTML = html,
		this;
}

function getSalonUsersSingleton() {
	return getSalonUsersSingleton.$instance
		? getSalonUsersSingleton.$instance
		: getSalonUsersSingleton.$instance = new SalonUsers(document.querySelector('#salon-users'));
}

// Expose UserDialog as a singleton
Object.defineProperty(calendar, 'salonUsers', {
	get: getSalonUsersSingleton
});


/**
 * User Modal Modal
 */
function UserDialog(root, foundation) {
	MDCDialog.call(this, root, foundation);
}

UserDialog.prototype = Object.create(MDCDialog.prototype);
UserDialog.prototype.constructor = UserDialog;

Object.defineProperty(UserDialog.prototype, 'form_', {
	get: function() {
		return this.root_.querySelector('form');
	}
});

Object.defineProperty(UserDialog.prototype, 'nameField_', {
	get: function() {
		return this.root_.querySelector('#name-field');
	}
});

Object.defineProperty(UserDialog.prototype, 'nameFieldInput_', {
	get: function() {
		return this.root_.querySelector('#name-field-input');
	}
});

Object.defineProperty(UserDialog.prototype, 'emailField_', {
	get: function() {
		return this.root_.querySelector('#email-field');
	}
})

Object.defineProperty(UserDialog.prototype, 'emailFieldInput_', {
	get: function() {
		return this.root_.querySelector('#email-field-input');
	}
});

Object.defineProperty(UserDialog.prototype, 'roleField_', {
	get: function() {
		return this.root_.querySelector('#role-field');
	}
});

Object.defineProperty(UserDialog.prototype, 'roleFieldInput_', {
	get: function() {
		return this.root_.querySelector('#role-field-input');
	}
});


Object.defineProperty(UserDialog.prototype, 'nameHelperText_', {
	get: function() {
		return this.root_.querySelector('#name-helper-text');
	}
});

Object.defineProperty(UserDialog.prototype, 'emailHelperText_', {
	get: function() {
		return this.root_.querySelector('#email-helper-text');
	}
});

Object.defineProperty(UserDialog.prototype, 'saveButton_', {
	get: function() {
		return this.root_.querySelector('.mdc-dialog__footer__button--save');
	}
});

Object.defineProperty(UserDialog.prototype, 'deleteButton_', {
	get: function() {
		return this.root_.querySelector('.mdc-dialog__footer__button--delete');
	}
});

Object.defineProperty(UserDialog.prototype, 'roleHelperText_', {
	get: function() {
		return this.root_.querySelector('#role-helper-text');
	}
});

/**
 * Change default focus trap and some UI preparation
 */
UserDialog.prototype.initialize = function() {
	this.focusTrap_ = MDCDialogUtil.createFocusTrapInstance(this.dialogSurface_, this.nameFieldInput_);
	this.nameMaterialField = new MDCTextField(this.nameField_);
	this.emailMaterialField = new MDCTextField(this.emailField_)
	this.roleMaterialField = new MDCTextField(this.roleField_)

	this.footerBtnRipples_ = [];

	var footerBtns = this.root_.querySelectorAll('.mdc-dialog__footer__button');

  for (var i = 0, footerBtn; footerBtn = footerBtns[i]; i++) {
		this.footerBtnRipples_.push(new MDCRipple(footerBtn));
	}
}

/**
 * Handle form submit
 * @param {Event} event 
 */
UserDialog.prototype.onSubmit = function(event) {
	var this_ = this;

	event.preventDefault();

	if (!this.emailFieldInput_.value || !validateEmail(this.emailFieldInput_.value)) {
		return this.emailField_.classList.add('mdc-text-field--invalid'),
			this.emailHelperText_.innerText = 'Invalid email';
	}

	var form = this.form_;
	var body = new FormData(this.form_);

	this.saveButton_.disabled = true;

	fetch(form.action, {
		credentials: 'same-origin',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: this.nameFieldInput_.value,
			email: this.emailFieldInput_.value,
			role: this.roleFieldInput_.value
		})
	})
	.then(fetchCheckStatus)
	.then(fetchParseJSONMeta)
	.then(function(resp) {
		var error = resp && resp.meta && resp.meta[0];

		if(error) {
			alert(resp.meta[0])
		}
		else {
			calendar.salonUsers.resetContent(resp.body);
			this_.form_.reset();
			this_.close();
		}

		this_.saveButton_.disabled = false;
		
	})
	.catch(function(error) {
		alert(error)
		this_.saveButton_.disabled = false;
	})
}
/**
 * Delete user from salon
 * @param {Event} event 
 */
UserDialog.prototype.onDelete = function() {
	var that = this;
	var userId = that.deleteButton_.getAttribute('data-user-id');
	var salonId = that.deleteButton_.getAttribute('data-salon-id');

	if (!userId) {
		alert('Ops, something goes wrong: user id is missed');
	}

	if (!salonId) {
		alert('Ops, something goes wrong: salon id is missed');
	}

	if (!confirm('Are you sure?')) {
		return;
	}

	this.deleteButton_.disabled = true;

	return fetch('/schedule/' + salonId + '/remove-user/' + userId, {
		credentials: 'same-origin',
		method: 'POST',
	})
	.then(fetchCheckStatus)
	.then(fetchParseJSONMeta)
	.then(function(resp) {
		var error = resp && resp.meta && resp.meta[0];

		if(error) {
			alert(resp.meta[0])
		}
		else {
			calendar.salonUsers.resetContent(resp.body);
			that.form_.reset();
			that.close();
		}

		that.deleteButton_.disabled = false;
	})
	.catch(function(error) {
		alert(error)
		that.deleteButton_.disabled = false;
	})
}

/**
 * Change default focus trap and some UI preparation
 * @param {string} userId
 * @param {string} salonId
 * @return {Promise}
 */
UserDialog.prototype.inviteUser = function(salonId) {
	this.form_.action = '/schedule/' + salonId + '/invite-user'
	this.nameMaterialField.value = ''
	this.emailMaterialField.value = ''
	this.emailMaterialField.disabled = false;
	this.roleMaterialField.value = ''
	this.deleteButton_.style.display = 'none'
	this.show()
}

/**
 * Change default focus trap and some UI preparation
 * @param {string} userId
 * @param {string} salonId
 * @return {Promise}
 */
UserDialog.prototype.editUser = function(userId, salonId) {
	var that = this;

	return fetch('/schedule/' + salonId + '/user-details/' + userId, {
		credentials: 'same-origin',
		method: 'GET',
	})
	.then(fetchCheckStatus)
	.then(fetchParseJSON).then(function(data) {
		that.nameMaterialField.value = data.details.name;
		that.emailMaterialField.value = data.details.email;
		that.emailMaterialField.disabled = true; // disable email editing for now
		that.roleMaterialField.value = data.details.role;
		that.deleteButton_.style.display = 'block';
		that.deleteButton_.setAttribute('data-user-id', userId);
		that.deleteButton_.setAttribute('data-salon-id', salonId);
		that.form_.action = ('/schedule/' + salonId + '/user-details/' + userId);
		that.show()
	})
	.catch(function(error) {
		alert(error);
	})
}

/**
 * Get instance of UserDialog
 * @returns {UserDialog}
 */
function userDialogSingleton() {
	if (!userDialogSingleton.$instance) {
		var root = document.querySelector('#user-dialog');

		if (!root) {
			throw new Error('#user-dialog does not exist in DOM. Please check `calendar.html` view');
		}

		userDialogSingleton.$instance = new UserDialog(root);
	}

	return userDialogSingleton.$instance;
}


/**
 * Event Dialog
 * Implemented as a factory
 */
function EventDialog() {
	const $$root = document.querySelector('#event-dialog');
	const dialog = new MDCDialog($$root)

	return {
		createEvent: createEvent,
	}

	function createEvent(params) {
		dialog.show()
	}
}

// Expose UserDialog as a singleton
Object.defineProperty(calendar, 'userDialog', {
	get: userDialogSingleton
});

// Expose EventDialog as a singleton
let eventDialogSingleton;
Object.defineProperty(calendar, 'eventDialog', {
	get: function() {
		return eventDialogSingleton || (eventDialogSingleton = EventDialog())
	}
});

return calendar

})()
