<h1 align="center">
  <br>
  <img alt="Universal Trakt Scrobbler" src="https://github.com/trakt-tools/universal-trakt-scrobbler/raw/master/src/images/uts-icon-128.png" width="150">
  <br>
  Universal Trakt Scrobbler
  <br>
</h1>
<h4 align="center">A universal scrobbler for Trakt.tv.</h4>
<p align="center">
  <a href="https://github.com/trakt-tools/universal-trakt-scrobbler/releases">
    <img alt="GitHub Release" src="https://img.shields.io/github/release/trakt-tools/universal-trakt-scrobbler.svg">
  </a>
</p>
<p align=left">
  <a href="">
    <img alt="Get the extension on Chrome" src="https://github.com/trakt-tools/universal-trakt-scrobbler/raw/master/assets/chrome-badge.png">
  </a>
</p>
<p align=left">
  <a href="">
    <img alt="Get the extension on Firefox" src="https://github.com/trakt-tools/universal-trakt-scrobbler/raw/master/assets/firefox-badge.png"></a>
</p>

### Table of Contents

* [What is Universal Trakt Scrobbler?](#what-is-universal-trakt-scrobbler)
* [Why do I need this extension?](#why-do-i-need-this-extension)
* [Which streaming services are supported?](#which-streaming-services-are-supported)
* [How does the extension work?](#how-does-the-extension-work)
* [Problems](#problems)
* [Development](#development)
* [Credits](#credits)

### What is Universal Trakt Scrobbler?

An extension that allows you to automatically scrobble TV shows and movies that you are watching from your favorite streaming services to Trakt.tv.

### Why do I need this extension?

If you want to scrobble from Netflix, this is the only Trakt.tv [plugin](https://trakt.tv/apps) that does it. In the future, we'll be adding support for more streaming services, so it will also serve as a single extension that works for multiple services.

### Which streaming services are supported?

- Netflix

### How does the extension work?

It extracts information about the TV show or movie that you are watching by scraping the page and sends the data to Trakt using the [Trakt API](https://trakt.docs.apiary.io/).

### Known Issues

-

### Other Problems

If you find any other problems or have suggestions or questions, feel free to [open an issue](https://github.com/trakt-tools/universal-trakt-scrobbler/issues/new).

### Development

1. Create an application in the [Trakt API](https://trakt.tv/oauth/applications/new) (don't forget to check the `/scrobble` permission).
2. In `Redirect uri:`, put `https://trakt.tv/apps`.
3. In `Javascript (cors) origins:`, put `moz-extension://` and `chrome-extension://`.
4. Copy the `config.json` example file and change the Trakt.tv credentials.

```bash
cp config.dev.json config.json
```

5. Use [nvm](https://github.com/creationix/nvm) to run the correct version of Node.js.

```bash
nvm use
```

6. Install the dependencies.

```bash
npm install
```

* To run in development mode:

```bash
npm start
```

* To get the build version for development mode (does not watch files):

```bash
npm run build-dev
```

* To get the build version for production mode (generates app.zip, ready for deployment):

```bash
npm run build
npm run zip
```

### Credits

This extension is based on [traktflix](https://github.com/tegon/traktflix), the original Netflix scrobbler developed by [tegon](https://github.com/user/tegon), which was discontinued in favor of Universal Trakt Scrobbler.

<h3 align="center">
  <img alt="TMDb API" src="https://github.com/trakt-tools/universal-trakt-scrobbler/raw/master/assets/tmdb-api-logo.png" width="150">
  <img alt="Trakt API" src="https://github.com/trakt-tools/universal-trakt-scrobbler/raw/master/assets/trakt-api-logo.png" width="150">
</h3>

This product uses the TMDb API, but is not endorsed or certified by TMDb.

This product uses the Trakt.tv API.

[LICENSE](LICENSE)
