class ScrobbleItem {
  constructor(options) {
    this.type = options.type;
    this.data = {};
    if (this.type === 'show') {
      this.data.episode = options.data;
      this.title = `${this.data.episode.show.title} - ${this.data.episode.title}`;
    } else {
      this.data.movie = {
        ...options.data.movie,
        type: 'movie',
      };
      this.title = this.data.movie.title;
    }
    this.data.progress = 0.0;
  }
}

export { ScrobbleItem };