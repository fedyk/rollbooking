"use strict";

function toggleDay(dayId) {
  dayId = Number(dayId)

  if (Number.isNaN(dayId)) {
    throw new RangeError("`dayId` should be a valid number")
  }

  const fieldset = document.getElementById(getFieldsetId(dayId))

  if (!fieldset) {
    throw new Error("`fieldset` can't be empty")
  }

  if (event.target.checked) {
    fieldset.classList.remove("d-none")
  }
  else {
    fieldset.classList.add("d-none")
  }
}

/**
 * Update UI after time has changed
 * @param {Event} event 
 */
function handleChangeTime(event) {
  const parent = findParentInlineForm(event.target)

  if (!(parent instanceof HTMLElement)) {
    throw new Error("`parent` can't be empty")
  }

  const openTimeInput = findOpenTimeInput(parent)
  const closeTimeInput = findCloseTimeInput(parent)
  const closeButton = findCloseButton(parent)
  const addButton = findAddButton(parent)

  if (!(openTimeInput instanceof HTMLInputElement)) {
    throw new Error("`openTimeInput` should be instance of HTMLInputElement")
  }

  if (!(closeTimeInput instanceof HTMLInputElement)) {
    throw new Error("`closeTimeInput` should be instance of HTMLInputElement")
  }

  if (!(closeButton instanceof HTMLButtonElement)) {
    throw new Error("`closeButton` should be instance of HTMLButtonElement")
  }

  if (!(addButton instanceof HTMLButtonElement)) {
    throw new Error("`addButton` should be instance of HTMLButtonElement")
  }

  if (openTimeInput.value && closeTimeInput.value) {
    addButton.classList.remove("invisible")
  }
  else {
    addButton.classList.add("invisible")
  }
}

/** @param event {Event} */
function handleAddHours(event) {
  const currParent = findParentInlineForm(event.target)

  if (!(currParent instanceof HTMLElement)) {
    throw new Error("`parent` can't be empty")
  }

  const index = Number(currParent.dataset.index)

  if (Number.isNaN(index)) {
    throw new RangeError("`index` should be a number")
  }

  const nextParent = currParent.cloneNode(true)
  const nextIndex = index + 1

  nextParent.setAttribute("index", nextIndex)

  const openTimeInput = findOpenTimeInput(nextParent)
  const closeTimeInput = findCloseTimeInput(nextParent)
  const closeButton = findCloseButton(nextParent)
  const currAddButton = findAddButton(currParent)
  const nextAddButton = findAddButton(nextParent)

  if (!(openTimeInput instanceof HTMLInputElement)) {
    throw new Error("`openTimeInput` should be instance of HTMLInputElement")
  }

  if (!(closeTimeInput instanceof HTMLInputElement)) {
    throw new Error("`closeTimeInput` should be instance of HTMLInputElement")
  }

  if (!(closeButton instanceof HTMLButtonElement)) {
    throw new Error("`closeButton` should be instance of HTMLButtonElement")
  }

  if (!(currAddButton instanceof HTMLButtonElement)) {
    throw new Error("`currAddButton` should be instance of HTMLButtonElement")
  }

  if (!(nextAddButton instanceof HTMLButtonElement)) {
    throw new Error("`nextAddButton` should be instance of HTMLButtonElement")
  }

  // reset values
  openTimeInput.value = ""
  closeTimeInput.value = ""

  // update index in input's names
  openTimeInput.name = openTimeInput.name.replace(`[${index}]`, `[${nextIndex}]`)
  closeTimeInput.name = closeTimeInput.name.replace(`[${index}]`, `[${nextIndex}]`)

  // update visibility for close button
  closeButton.classList.remove("invisible")

  // update visibility for add button
  currAddButton.classList.add("invisible")
  nextAddButton.classList.add("invisible")

  // append as a child
  currParent.parentElement.appendChild(nextParent)
}

function handleRemoveHours(event) {
  const currParent = findParentInlineForm(event.target)

  if (!(currParent instanceof HTMLElement)) {
    throw new Error("`parent` can't be empty")
  }

  const lastSibling = findLastSiblingInlineForm(currParent)

  if (lastSibling) {
    const addButton = findAddButton(lastSibling)

    if (addButton) {
      addButton.classList.remove("invisible")
    }
  }

  currParent.parentElement.removeChild(currParent)
}

function getFieldsetId(dayId) {
  return "fieldset_" + dayId
}

function findParentInlineForm(el) {
  while (el.parentElement) {
    el = el.parentElement

    if (el.dataset.el === "inline-form") {
      return el
    }
  }
}

/**
 * @param {HTMLElement} inlineForm 
 * @returns {HTMLElement} 
 */
function findLastSiblingInlineForm(inlineForm) {
  var nodes = inlineForm.parentElement.childNodes
  var i = nodes.length - 1;
  var node

  while (node = nodes[i--]) {
    if (node.nodeType === 1 && node !== inlineForm && node.dataset.el === "inline-form") {
      return node;
    }
  }
}

function findOpenTimeInput(parent) {
  return parent.querySelector("[data-el=open-time]")
}

function findCloseTimeInput(parent) {
  return parent.querySelector("[data-el=close-time]")
}

function findCloseButton(parent) {
  return parent.querySelector("[data-el=close-btn]")
}

function findAddButton(parent) {
  return parent.querySelector("[data-el=add-btn]")
}
