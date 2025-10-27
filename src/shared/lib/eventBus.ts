type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return callback; // callbackni remove qilish uchun qaytaramiz
  }

  dispatch(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((cb) => cb(data));
  }

  remove(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }
}

export default new EventBus();
