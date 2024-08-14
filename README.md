# Web Miner

## Overview

**Web Miner** is a Chrome Extension currently under active development, designed to simplify the creation of automated web interaction scripts.
Leveraging a library of basic commands, users can easily craft scripts for a wide range of purposes—from scraping web page data to automating repetitive tasks such as form submissions.
Our vision extends to enabling script creation and visualization through the extension, with capabilities to save and execute scripts offline.

## How It Works

https://www.youtube.com/watch?v=-TMjoVj6af4

## Development Setup

1. **Install Dependencies**: Execute `npm install` to download and install the necessary dependencies.
2. **Production Build**: Run `npm run build` to compile all essential files into the `dist/` directory, ready for deployment in production environments.
3. **Watch Mode**: Activate watch mode with `npm run watch` to automatically recompile files in `src/` upon any changes, facilitating rapid development iterations.
4. **Content Script Development**: For focused development on the content script, utilize `npm run watch:content` to exclusively recompile changes within the `src/content/` directory, ideal for modifications within the modal.
5. **Extension Loading**: To load the extension, navigate to Chrome Extensions and select the `dist/` folder as an unpacked extension. For detailed instructions, refer to the [Chrome Extension Getting Started Tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
