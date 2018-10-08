/**
 * Missed utils for mdc
 */
ready(function() {
  initializeComponents('.mdc-text-field', mdc.textField.MDCTextField);
  initializeComponents('.mdc-form-field', mdc.formField.MDCFormField);
  initializeComponents('.mdc-checkbox', mdc.checkbox.MDCCheckbox);
  initializeComponents('.mdc-notched-outline', mdc.notchedOutline.MDCNotchedOutline);
  initializeComponents('.mdc-select', mdc.select.MDCSelect);

  /**
   * @param {string} selector 
   * @param {MDCComponent} Component 
   */
  function initializeComponents(selector, Component) {
    var elements = document.querySelectorAll(selector);

    for (var i = 0; i < elements.length; i++) {
      elements[i].__mdc = new Component(elements[i]);
    }
  }
});
