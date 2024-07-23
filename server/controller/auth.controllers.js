import {
  launchBrowser,
  getBrowser,
  closeBrowser,
} from '../services/browser.service.js';
import { loginToRouter } from '../utils/loginHelper.js';

const logIn = async (req, res) => {
  const { username, password } = req.body;
  let browser;
  let page;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Launch the browser if it's not already running
    if (!getBrowser()) {
      await launchBrowser();
    }
    browser = getBrowser();

    if (!browser) {
      throw new Error('Failed to launch browser');
    }

    // Open a new page
    page = await browser.newPage();

    // Attempt login
    const loginSuccessful = await loginToRouter(page, username, password);

    if (loginSuccessful) {
      // Set session
      req.session.isAuthenticated = true;
      req.session.username = username;

      // Get cookies if needed
      const cookies = await page.cookies();
      res.json({ success: true, message: 'Login successful', cookies });
    } else {
      res.status(401).json({
        success: false,
        message: 'Login failed: Incorrect username or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({ success: false, message: 'An error occurred during login' });
  }
};

const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Could not log out, please try again' });
      closeBrowser();
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
};

export { logIn, logOut };
