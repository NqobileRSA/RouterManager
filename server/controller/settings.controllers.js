import { getBrowser } from '../services/browser.service.js';

const changeLoginDetails = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required!' });
  }

  try {
    console.info('Attempting to change login details');
    const page = await getBrowser().newPage();
    await page.goto(
      `http://${process.env.ROUTER_IP}/html/ssmp/accoutcfg/ontmngt.asp`,
      {
        timeout: 120000,
        waitUntil: 'networkidle0',
      }
    );

    // dialog fail or success
    page.on('dialog', async (dialog) => {
      if (dialog.message() === 'Incorrect old password. Try again.') {
        await dialog.accept();
        await page.close();
        return res
          .status(400)
          .json({ success: false, message: dialog.message() });
      }
      await dialog.accept();
      await page.close();
      return res.status(200).json({ success: true, message: dialog.message() });
    });

    // type in the fields
    await page.type('#oldPassword', currentPassword);
    await page.type('#newPassword', newPassword);
    await page.type('#cfmPassword', confirmPassword);

    // save and submit for
    await page.click('#MdyPwdApply'),
      await page
        .waitForNavigation({ timeout: 120000, waitUntil: 'networkidle0' })
        .catch((err) => {
          console.log(
            'Navigation timeout, checking for success message anyway'
          );
          console.error('Navigation error:', err);
        });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error.', error });
  }
};

const changeWifipassword = async (req, res) => {
  try {
    return console.log('Test');
  } catch (error) {
    return console.log('Test');
  }
};

export { changeLoginDetails, changeWifipassword };
