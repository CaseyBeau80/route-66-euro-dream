
interface JQuery {
  vectorMap: (options: any) => any;
  [key: string]: any;
}

interface JQueryStatic {
  (selector: string): JQuery;
  [key: string]: any;
}

interface Window {
  $: JQueryStatic;
}
