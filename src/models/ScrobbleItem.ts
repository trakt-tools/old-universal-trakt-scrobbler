class ScrobbleItem implements IScrobbleItem {
  id: number;
  type: 'show' | 'movie';
  title: string;
  year: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  progress: number;

  constructor(options: IScrobbleItem) {
    this.id = options.id;
    this.type = options.type;
    this.title = options.title;
    this.year = options.year;
    if (this.type === 'show') {
      this.season = options.season;
      this.episode = options.episode;
      this.episodeTitle = options.episodeTitle;
    }
    this.progress = options.progress;
  }
}

export { ScrobbleItem };