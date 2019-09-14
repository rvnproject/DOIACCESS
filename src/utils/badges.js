import { isAppActivatedHere } from './app-status';

export function updateBadge() {
  /*
   ** Update the extension icon badge with ON/OFF if the baseUrlState is True/False for the current page url
   */
  if (isAppActivatedHere()) {
    browser.browserAction.setBadgeText({ text: 'ON' });
    browser.browserAction.setBadgeBackgroundColor({ color: '#bada55' });
  } else {
    browser.browserAction.setBadgeText({ text: 'OFF' });
    browser.browserAction.setBadgeBackgroundColor({ color: '#ff6961' });
  }
}
