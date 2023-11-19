import { MintApiClient } from '../api';

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);
  const canUseBeacon =
    typeof window !== 'undefined' && window?.navigator && window?.navigator?.sendBeacon;
  if (canUseBeacon) {
    const beaconResult = window.navigator.sendBeacon(MintApiClient.__ANALYTICS_ENDPOINT__, body);
    if (!beaconResult) {
      console.warn('Failed to queue beacon analytics post.');
      return false;
    }
    return true;
  } else {
  }
}
