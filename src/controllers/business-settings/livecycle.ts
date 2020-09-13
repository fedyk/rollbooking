export interface IDisposable {
  dispose(): void
}

interface Listener {
  unbind(): void;
}

/** Simple utils for handling listeners */
export class Listeners {
  list: Listener[]

  constructor() {
    this.list = []
  }

  register(...listeners: Listener[]) {
    this.list.push(...listeners)
  }

  unbindAll() {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].unbind()
    }

    // remove all items
    this.list.splice(0, this.list.length)
  }
}