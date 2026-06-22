/**
 * Core Base Class for Theme JavaScript
 */
export class CoreBase {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('Shopify Theme Core Initialized');
  }
}
