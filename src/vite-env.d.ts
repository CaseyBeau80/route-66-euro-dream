
/// <reference types="vite/client" />

// Declare jQuery types for window object
interface Window {
  jQuery: any;
  $: any;
}

// Extend JQuery interface for vectorMap
interface JQuery {
  vectorMap(options: any): any;
}
