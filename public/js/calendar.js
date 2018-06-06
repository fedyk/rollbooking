/**
 * Calendar related staff
 */

'use strict';

var calendar = (function() { 'use strict';

var MDCDialog = mdc.dialog.MDCDialog;
var MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
var MDCDialogUtil = mdc.dialog.util;
var MDCTextField = mdc.textField.MDCTextField;

/**
 * User Modal
 */
function WorkerDialog() {
	this.$dialog = document.querySelector('#worker-dialog')
	this.$nameField = this.$dialog.querySelector('#name-field')
	this.nameField = new MDCTextField(this.$nameField)
	this.$emailField = this.$dialog.querySelector('#email-field')
	this.emailField = new MDCTextField(this.$emailField)
	this.$roleField = this.$dialog.querySelector('#role-field')
	this.roleField = new MDCTextField(this.$roleField)
	this.dialog = new MDCDialog(this.$dialog)
}


WorkerDialog.prototype.show = function() {
	return this.dialog.show(),
		setTimeout(this.$nameField.focus.bind(this.$nameField), 200),
		this
}


WorkerDialog.prototype.destroy = function() {
	return this.dialog.destroy(),
		this.el = null,
		this.dialog = null,
		this
}

/**
 * Open simple modal for creating new user and assign in to salon
 */
function openWorkerDialog(event) {
	var dialog = new WorkerDialog();

	return dialog.show()
}

var calendar = {
	openWorkerDialog: openWorkerDialog
}

return calendar

})()
