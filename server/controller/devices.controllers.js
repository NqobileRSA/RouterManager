import { getBrowser } from '../services/browser.service.js';

const getConnectedDevices = async (req, res) => {
  try {
    const page = await getBrowser().newPage();

    await page.goto(
      `http://${process.env.ROUTER_IP}/html/bbsp/userdevinfo/userdevinfosmart.asp?type=wifidev`,
      { timeout: 60000, waitUntil: 'networkidle0' }
    );
    await page.waitForSelector('table#devlist', { timeout: 60000 });
    console.log('Devices table loaded');

    const devices = await page.evaluate(() => {
      const deviceRows = document.querySelectorAll(
        'table#devlist tr.DevTableList'
      );
      return Array.from(deviceRows)
        .map((row) => {
          const columns = row.querySelectorAll('td');
          if (columns.length < 5) return null;

          const name =
            columns[0]
              .querySelector(`div[id^="divDevName_"]`)
              ?.textContent.trim() || 'N/A';
          const ipAndMac = columns[2]
            .querySelector(`div[id^="DivIpandMac_"]`)
            ?.textContent.trim()
            .split('\n') || ['N/A', 'N/A'];
          const state =
            columns[3]
              .querySelector(`div[id^="DivDevStatus_"]`)
              ?.textContent.trim() || 'N/A';
          const connectivity =
            columns[4]
              .querySelector(`div[id^="DivConnectTime_"]`)
              ?.textContent.trim() || 'N/A';

          const combinedIpMac = ipAndMac[0]?.trim() || '';
          const macMatch = combinedIpMac.match(
            /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
          );
          const mac = macMatch ? macMatch[0] : 'N/A';
          const ip = combinedIpMac.replace(mac, '').trim() || 'N/A';

          return {
            device: name,
            mac,
            ip,
            state: state.toLowerCase(),
            connectivity:
              connectivity === '--' ? 'Not connected' : connectivity,
          };
        })
        .filter((device) => device !== null);
    });
    await page.close();
    return res.json({ success: true, devices });
  } catch (error) {
    console.error('Error in getConnectedDevices controller', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

const getBlockedDevices = async (req, res) => {
  try {
    const page = await getBrowser().newPage();

    await page.goto(
      `http://${process.env.ROUTER_IP}/html/bbsp/wlanmacfilter/wlanmacfilter.asp`,
      { timeout: 60000, waitUntil: 'networkidle0' }
    );

    await page.waitForSelector('#WMacfilterConfigList', { timeout: 60000 });
    console.log('MAC filter table loaded');

    const blockedDevices = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        '#WMacfilterConfigList tr:not(.tableth)'
      );
      return Array.from(rows).map((row) => {
        const macAddress = row
          .querySelector('td:nth-child(2)')
          ?.textContent.trim();
        const deviceName = row
          .querySelector('td:nth-child(3)')
          ?.textContent.trim();
        return { macAddress, deviceName };
      });
    });

    await page.close();
    return res.json({ success: true, blockedDevices });
  } catch (error) {
    console.error('Error in getBlockedDevices controller', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export { getConnectedDevices, getBlockedDevices };
