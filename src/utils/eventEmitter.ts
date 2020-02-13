// @ts-ignore
export const EventEmitter = {
  events: {},
  dispatch: function(event: any, data: any) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((callback: any) => callback(data));
  },
  subscribe: function(event: any, callback: any) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
  },
};
