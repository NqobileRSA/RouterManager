const loginToRouter = async (page, username, password) => {
  console.log('Executing loginToRouter');
  try {
    await page.goto(`http://${process.env.ROUTER_IP}/`, {
      timeout: 60000,
      waitUntil: 'networkidle0',
    });

    await page.type('#txt_Username', username);
    await page.type('#txt_Password', password);

    // Click the login button and wait for navigation
    await Promise.all([
      page.click('#loginbutton'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // Check if the error message is visible
    const errorDiv = await page.$('#DivErrPage');
    if (errorDiv) {
      const isVisible = await page.evaluate((el) => {
        return window.getComputedStyle(el).display !== 'none';
      }, errorDiv);

      if (isVisible) {
        console.log('Login unsuccessful: Error message displayed');
        return false;
      }
    }

    console.log('Login process completed successfully');
    return true;
  } catch (error) {
    console.error('Error in loginToRouter:', error);
    throw error;
  }
};

export { loginToRouter };
