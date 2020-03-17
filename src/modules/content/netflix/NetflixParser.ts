import { NetflixApi } from './NetflixApi';
import { Item } from '../../../models/Item';

class _NetflixParser {
  constructor() {
    this.getLocation = this.getLocation.bind(this);
    this.parseItem = this.parseItem.bind(this);
    this.parseProgress = this.parseProgress.bind(this);
    this.checkId = this.checkId.bind(this);
    this.getId = this.getId.bind(this);
  }

  getLocation(): string {
    return window.location.href;
  }

  parseItem(): Promise<Item> {
    return new Promise(this.checkId);
  }

  parseProgress(): number {
    let progress = 0.0;
    const scrubber: HTMLElement = document.querySelector('.scrubber-bar .current-progress');
    if (scrubber) {
      progress = parseFloat(scrubber.style.width);
    }
    return progress;
  }

  async checkId(callback: Function): Promise<void> {
    const id = await this.getId();
    if (id) {
      const item = await NetflixApi.getItem(id);
      callback(item);
    } else {
      setTimeout(this.checkId, 500, callback);
    }
  }

  async getId(): Promise<string> {
    // If we can access the global netflix object from the page, there is no need to parse the page in order to retrieve the ID of the item being watched.
    let id = null;
    const session = await NetflixApi.getSession();
    if (session) {
      id = session.videoId.toString();
    } else {
      const matches = this.getLocation().match(/watch\/(\d+)/);
      if (matches) {
        id = matches[1];
      }
    }
    return id;
  }
}

const NetflixParser = new _NetflixParser();

export { NetflixParser };