
interface JQuery {
  vectorMap: (options: any) => any;
  [key: string]: any;
}

interface JQueryStatic {
  (selector: string | Element): JQuery;
  fn: {
    vectorMap: (name: string, map: object) => void;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Window {
  $?: JQueryStatic;
}
