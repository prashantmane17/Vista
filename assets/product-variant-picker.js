class ProductVariantPicker extends HTMLElement {
  constructor() {
    super();
    this.form = null;
    this.idInput = null;
    this.submitButton = null;
    this.price = null;
    this.variants = [];
    this.onChange = this.onChange.bind(this);
  }

  connectedCallback() {
    if (this.initialized) return;

    this.form = this.closest('form[action*="/cart/add"]');
    this.idInput = this.form?.querySelector('[name="id"][data-product-variant-id]');
    this.submitButton = this.form?.querySelector('[data-product-submit]');
    this.price = this.form?.querySelector('[data-product-price]');
    this.variants = this.getVariants();
    this.initialized = true;

    this.addEventListener('change', this.onChange);
    this.updateOptions();
    this.updateProduct();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.onChange);
    this.initialized = false;
  }

  onChange() {
    this.updateOptions();
    this.updateProduct();
  }

  getVariants() {
    const script = this.querySelector('[data-variant-json]');

    if (!script) return [];

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.warn('Invalid product variant JSON:', error);
      return [];
    }
  }

  getSelectedOptions() {
    const selected = [];

    this.querySelectorAll('[data-option-index]').forEach((field) => {
      const index = Number(field.getAttribute('data-option-index'));

      if (field.matches('select')) {
        selected[index] = field.value;
        return;
      }

      if (field.matches('input:checked')) {
        selected[index] = field.value;
      }
    });

    return selected;
  }

  getSelectedVariant() {
    const selected = this.getSelectedOptions();

    return this.variants.find((variant) => {
      return variant.options.every((option, index) => option === selected[index]);
    });
  }

  updateProduct() {
    const variant = this.getSelectedVariant();

    this.updateForm(variant);
    this.updateSubmitButton(variant);
    this.updatePrice(variant);
    this.updateUrl(variant);
  }

  updateForm(variant) {
    if (!this.idInput || !variant) return;

    this.idInput.value = variant.id;
    this.idInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateSubmitButton(variant) {
    if (!this.submitButton) return;

    const addText = this.submitButton.getAttribute('data-add-text') || 'Add to cart';

    if (!variant) {
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Unavailable';
      return;
    }

    if (!variant.available) {
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Sold out';
      return;
    }

    this.submitButton.disabled = false;
    this.submitButton.textContent = addText;
  }

  updatePrice(variant) {
    if (!this.price || !variant || typeof Shopify === 'undefined' || !Shopify.formatMoney) return;

    this.price.innerHTML = Shopify.formatMoney(variant.price);
  }

  updateUrl(variant) {
    if (!variant || !window.history.replaceState) return;

    const url = this.getAttribute('data-product-url');
    if (!url) return;

    window.history.replaceState({}, '', `${url}?variant=${variant.id}`);
  }

  updateOptions() {
    const selected = this.getSelectedOptions();
    const hideUnavailable = this.getAttribute('data-hide-unavailable') === 'true';

    this.querySelectorAll('[data-option-index]').forEach((field) => {
      if (field.matches('fieldset')) return;

      const index = Number(field.getAttribute('data-option-index'));

      if (field.matches('select')) {
        Array.from(field.options).forEach((option) => {
          this.updateChoice(option, index, option.value, selected, hideUnavailable);
        });
        return;
      }

      this.updateChoice(field, index, field.value, selected, hideUnavailable);
    });
  }

  updateChoice(choice, index, value, selected, hideUnavailable) {
    const nextSelection = [...selected];
    nextSelection[index] = value;

    const matches = this.variants.filter((variant) => {
      return variant.options.every((option, optionIndex) => option === nextSelection[optionIndex]);
    });

    const exists = matches.length > 0;
    const available = matches.some((variant) => variant.available);
    const item = choice.closest('[data-variant-choice]');
    const label = item?.querySelector('label');
    const state = item?.querySelector('[data-state-text]');

    choice.disabled = !exists;
    choice.hidden = hideUnavailable && !exists;
    if (item) item.hidden = hideUnavailable && !exists;
    if (label) label.classList.toggle('is-sold-out', exists && !available);
    if (label) label.classList.toggle('is-unavailable', !exists);
    if (state) state.textContent = !exists ? 'Unavailable' : exists && !available ? 'Sold out' : '';

    if (choice.matches('option')) {
      if (!choice.dataset.label) choice.dataset.label = choice.textContent.trim();
      choice.textContent = !exists
        ? `${choice.dataset.label} - Unavailable`
        : exists && !available
          ? `${choice.dataset.label} - Sold out`
          : choice.dataset.label;
    }
  }
}

if (!customElements.get('product-variant-picker')) {
  customElements.define('product-variant-picker', ProductVariantPicker);
}

document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelectorAll('product-variant-picker').forEach((picker) => {
    if (picker.connectedCallback) picker.connectedCallback();
  });
});

document.addEventListener('shopify:section:unload', (event) => {
  event.target.querySelectorAll('product-variant-picker').forEach((picker) => {
    if (picker.disconnectedCallback) picker.disconnectedCallback();
  });
});

document.addEventListener('shopify:block:select', (event) => {
  event.target.closest('product-variant-picker')?.updateOptions();
});

document.addEventListener('shopify:block:deselect', (event) => {
  event.target.closest('product-variant-picker')?.updateOptions();
});
