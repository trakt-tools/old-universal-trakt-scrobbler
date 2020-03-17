import { Item } from '../../../models/Item';
import { HboGoApi } from './HboGoApi';

class _HboGoParser implements IScrobbleParser {
  constructor() {}

  async parseItem(): Promise<Item> {
    // If we can access the global sdk object from the page, there is no need to parse the page in order to retrieve the item being watched.
    let item: Item = null;
    const session = await HboGoApi.getSession();
    if (session) {
      item = HboGoApi.parseMetadata(session.content);
    } else {
      // TODO: Implement manual parsing.
    }
    return item;
  }
}

const HboGoParser = new _HboGoParser();

export { HboGoParser };