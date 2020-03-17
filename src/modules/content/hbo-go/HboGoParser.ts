import { Item } from '../../../models/Item';
import { HboGoApi } from './HboGoApi';

class _HboGoParser implements IScrobbleParser {
  constructor() {}

  async parseItem(): Promise<Item> {
    // If we can access the global sdk object from the page, there is no need to parse the page in order to retrieve the item being watched.
    let item: Item = null;
    const session = (await HboGoApi.getSession()) || this.parseSession();
    if (session && session.content.Id) {
      item = HboGoApi.parseMetadata(session.content);
    }
    return item;
  }

  isShow(content: HboGoMetadataItem): content is HboGoMetadataShowItem {
    return content.Category === 'Series';
  }

  parseSession(): HboGoSession {
    const content: HboGoMetadataItem = {} as HboGoMetadataItem;
    const contentTitleElement = document.querySelector('.contentTitle');
    if (contentTitleElement) {
      const contentTitle = contentTitleElement.textContent.trim();
      const showMatches = contentTitle.match(/(.+?)\s\|\sS(\d+?)\sE(\d+?)\s(.+)/);
      content.Id = contentTitle.replace(' ', '');
      content.ProductionYear = null;
      content.Category = showMatches ? 'Series' : 'Movies';
      if (this.isShow(content)) {
        content.SeriesName = showMatches[0];
        content.SeasonIndex = parseInt(showMatches[1]);
        content.Index = parseInt(showMatches[2]);
        content.Name = showMatches[3];
      } else {
        content.Name = contentTitle;
      }
    }
    const playing = !!document.querySelector('.playbackPauseButton');
    const paused = !!document.querySelector('.playbackPlayButton');
    const progress = this.parseProgress();
    return { content, playing, paused, progress };
  }

  parseProgress(): number {
    let progress = 0.0;
    const scrubber: HTMLElement = document.querySelector('.timelineProgress');
    if (scrubber) {
      progress = parseFloat(scrubber.style.width);
    }
    return progress;
  }
}

const HboGoParser = new _HboGoParser();

export { HboGoParser };