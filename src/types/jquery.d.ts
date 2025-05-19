
interface JQuery {
  vectorMap(options: any): JQuery;
  empty(): JQuery;
  data(key: string): any;
}

interface JQueryStatic {
  fn: {
    vectorMap: {
      (options: any): any;
      maps: {
        [key: string]: any;
      };
    };
  };
}

declare global {
  interface Window {
    jQuery: JQueryStatic;
  }
}

export {};
