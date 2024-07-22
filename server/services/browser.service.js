import puppeteer from 'puppeteer';
import { ENV_VARS } from '../config/config_env.js';

let browser = null;

const launchBrowser = async () => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: ENV_VARS.NODE_ENV === 'production',
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      console.log('Browser launched successfully');
    }
    return browser;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw error;
  }
};

const getBrowser = () => browser;

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('Browser closed successfully');
  }
};

export { launchBrowser, getBrowser, closeBrowser };
