export class Observable {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: Function): Function {
    this.observers.push(func);

    return () => {
      this.unsubscribe(func);
    };
  }

  unsubscribe(inputFunc: Function): void {
    this.observers.filter((func) => func != inputFunc);
  }

  notify(data?: any): void {
    this.observers.forEach((func) => func(data));
  }
}
