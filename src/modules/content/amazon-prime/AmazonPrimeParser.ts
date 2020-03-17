import { Item } from '../../../models/Item';
import { AmazonPrimeApi } from './AmazonPrimeApi';

class _AmazonPrimeParser implements IScrobbleParser {
  id: string;

  constructor() {
    this.id = '';
  }

  async parseItem(): Promise<Item> {
    const item = this.id ? await AmazonPrimeApi.getItem(this.id) : null;
    return item;
  }

  parseSession(): AmazonPrimeSession {
    const loadingSpinner = document.querySelector('.loadingSpinner:not([style="display: none;"])');
    const playing = !!loadingSpinner || !!document.querySelector('.pausedIcon');
    const paused = !!document.querySelector('.playIcon');
    const progress = this.parseProgress();
    return { playing, paused, progress };
  }

  parseProgress(): number {
    let progress = 0.0;
    const scrubber: HTMLElement = document.querySelector('.positionBar:not(.vertical)');
    if (scrubber) {
      progress = parseFloat(scrubber.style.width);
    }
    return progress;
  }
}

const AmazonPrimeParser = new _AmazonPrimeParser();

export { AmazonPrimeParser };