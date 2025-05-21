export class Observable {
  observers: Array<(data?: unknown) => void>;

  constructor() {
    this.observers = [];
  }

  subscribe(func: (data?: unknown) => void): () => void {
    this.observers.push(func);

    return () => {
      this.unsubscribe(func);
    };
  }

  unsubscribe(inputFunc: (data?: unknown) => void): void {
    this.observers.filter((func) => func != inputFunc);
  }

  notify(data?: unknown): void {
    this.observers.forEach((func) => func(data));
  }
}
