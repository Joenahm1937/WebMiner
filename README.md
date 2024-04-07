# Web Miner

## Overview

**Web Miner** is a Chrome Extension currently under active development, designed to simplify the creation of automated web interaction scripts. 
Leveraging a library of basic commands, users can easily craft scripts for a wide range of purposes—from scraping web page data to automating repetitive tasks such as form submissions. 
Our vision extends to enabling script creation and visualization through the extension, with capabilities to save and execute scripts offline. 
Future updates aim to integrate an LLM node to assist users in script development further.

## Features

- **Simple Interface:** Craft your automation scripts with ease.
- **Cloud Synchronization:** Save your scripts to the cloud for access and execution anytime, anywhere.
- **Intelligent Script Assistance:** Future updates will include LLM integration, offering guidance in script development.

## How It Works

*Documentation and detailed usage instructions will be provided in future updates.*

## Development Setup

1. **Install Dependencies**: Run `npm install` to install required dependencies.
2. **Load Extension**: Navigate to Chrome Extensions and load the `dist/` folder as an unpacked extension. For detailed instructions, see the [Chrome Extension Getting Started Tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
3. **Start Development Server**: Execute `npm run watch` to start the server in watch mode, enabling live refreshes for immediate feedback on changes.
4. **Build for Production**: Use `npm run build` to compile all necessary files into the `dist/` directory for production deployment.
