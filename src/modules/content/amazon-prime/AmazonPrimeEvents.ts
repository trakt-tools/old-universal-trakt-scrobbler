import { ScrobbleEvents } from '../common/ScrobbleEvents';
import { AmazonPrimeParser } from './AmazonPrimeParser';

class _AmazonPrimeEvents extends ScrobbleEvents {
  progress: number;
  url: string;
  videoId: string;

  constructor() {
    super();

    this.progress = 0.0;
    this.url = '';
    this.videoId = '';

    this.onClick = this.onClick.bind(this);
    this.startListeners = this.startListeners.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
  }

  async onClick(event: Event) {
    const target: HTMLElement = event.target as HTMLElement;
    const playButton: HTMLElement = (target.dataset.asin || target.dataset.titleId) ? target : target.closest('[data-asin], [data-title-id]');
    if (playButton) {
      const videoId = playButton.dataset.asin || playButton.dataset.titleId;
      if (videoId !== this.videoId) {
        if (this.isPlaying) {
          await this.stop();
        }
        this.videoId = videoId;
        AmazonPrimeParser.id = this.videoId;
        await this.start();
        this.isPaused = false;
        this.isPlaying = true;
      }
    }
  }

  startListeners() {
    super.startListeners();
    document.body.addEventListener('click', this.onClick, true);
  }

  async checkForChanges(): Promise<void> {
    if (this.videoId) {
      const session = AmazonPrimeParser.parseSession();
      if ((this.isPaused !== session.paused) || (this.isPlaying !== session.playing)) {
        if (session.paused) {
          if (!this.isPaused) {
            await this.pause();
          }
        } else if (session.playing) {
          if (!this.isPlaying) {
            await this.start();
          }
        } else if (this.isPlaying) {
          await this.stop();
          this.videoId = '';
          AmazonPrimeParser.id = '';
        }
        this.isPaused = session.paused;
        this.isPlaying = session.playing;
      }
      if (this.isPlaying) {
        const newProgress = session.progress;
        if (this.progress !== newProgress) {
          await this.updateProgress(newProgress);
          this.progress = newProgress;
        }
      }
    }
    this.changeListener = window.setTimeout(this.checkForChanges, 500);
  }
}

const AmazonPrimeEvents = new _AmazonPrimeEvents();

export { AmazonPrimeEvents };