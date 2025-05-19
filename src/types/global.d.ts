
// Global type definitions
interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

interface JQueryStatic {
  fn: JQueryFn;
  (selector: string | Element | Document): JQuery;
}

interface JQueryFn {
  vectorMap: any;
}

interface JQuery {
  vectorMap: (options?: any) => any;
}
