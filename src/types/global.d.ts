
interface JQuery {
  vectorMap: (options: any) => any;
  [key: string]: any;
}

interface Window {
  $: JQuery;
}
