
interface JQuery {
  vectorMap(options: any): any;
  data(key: string): any;
  empty(): void;
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
