class _BrowserStorage {
  isSyncAvailable: boolean;

  constructor() {
    this.isSyncAvailable = !!browser.storage.sync;

    this.getBrowserName = this.getBrowserName.bind(this);
    this.sync = this.sync.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.getSize = this.getSize.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getBrowserName(): 'Firefox' | 'Chrome' | 'Unknown' {
    const url = browser.runtime.getURL('');
    if (url.startsWith('moz')) {
      return 'Firefox';
    }
    if (url.startsWith('chrome')) {
      return 'Chrome';
    }
    return 'Unknown';
  }

  async sync(): Promise<void> {
    if (this.isSyncAvailable) {
      const values = await browser.storage.sync.get(null);
      for (const key of Object.keys(values)) {
        await browser.storage.local.set({ [key]: values[key] });
      }
    }
  }

  async set(values: StorageValues, doSync: boolean): Promise<void> {
    if (doSync && this.isSyncAvailable) {
      await browser.storage.sync.set(values);
    }
    await browser.storage.local.set(values);
  }

  get(keys: string | string[] | null): Promise<StorageValues> {
    return browser.storage.local.get(keys);
  }

  async remove(keys: string | string[], doSync = false): Promise<void> {
    if (doSync && this.isSyncAvailable) {
      await browser.storage.sync.remove(keys);
    }
    await browser.storage.local.remove(keys);
  }

  async clear(doSync: boolean): Promise<void> {
    if (doSync && this.isSyncAvailable) {
      await browser.storage.sync.clear();
    }
    await browser.storage.local.clear();
  }

  async getSize(keys: string | string[] | null): Promise<string> {
    let size = '';
    const values = await this.get(keys);
    let bytes = (JSON.stringify(values) || '').length;
    if (bytes < 1024) {
      size = `${bytes.toFixed(2)} B`;
    } else {
      bytes /= 1024;
      if (bytes < 1024) {
        size = `${bytes.toFixed(2)} KB`;
      } else {
        bytes /= 1024;
        size = `${bytes.toFixed(2)} MB`;
      }
    }
    return size;
  }

  async getOptions(): Promise<Options> {
    const options: Options = {
      showNotifications: {
        id: 'showNotifications',
        name: '',
        description: '',
        value: false,
        origins: [],
        permissions: ['notifications'],
      },
      sendReceiveSuggestions: {
        id: 'sendReceiveSuggestions',
        name: '',
        description: '',
        value: false,
        origins: ['*://script.google.com/*', '*://script.googleusercontent.com/*'],
        permissions: []
      },
      allowRollbar: {
        id: 'allowRollbar',
        name: '',
        description: '',
        value: false,
        origins: ['*://api.rollbar.com/*'],
        permissions: []
      },
    };
    if (this.getBrowserName() === 'Firefox') {
      options.grantCookies = {
        id: 'grantCookies',
        name: '',
        description: '',
        value: false,
        origins: [],
        permissions: ['cookies'],
      };
    }
    const values = await BrowserStorage.get('options');
    for (const option of Object.values(options)) {
      option.name = browser.i18n.getMessage(`${option.id}Name`);
      option.description = browser.i18n.getMessage(`${option.id}Description`);
      option.value = (values.options && values.options[option.id]) || option.value;
    }
    return options;
  }
}

const BrowserStorage = new _BrowserStorage();

export { BrowserStorage };