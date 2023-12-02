import axios from 'axios';
import moment from 'moment';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';
import { v4 as uuid } from 'uuid';
import { MintApiClient } from '../api';

type Analytics = {
  id: string;
  event: {
    type: string;
    timestamp: string;
  };
  data: any;
};

export { type Analytics };

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);
  const data: Analytics = {
    id: uuid(),
    event: {
      type: metric?.name ?? 'Unknown||Custom',
      timestamp: moment().toISOString()
    },
    data: body
  };
  const canUseBeacon =
    typeof window !== 'undefined' && window?.navigator && window?.navigator?.sendBeacon;
  if (canUseBeacon) {
    const beaconResult = window.navigator.sendBeacon(
      MintApiClient.__ANALYTICS_ENDPOINT__ + '/create',
      JSON.stringify(data)
    );
    if (!beaconResult) {
      console.warn('Failed to queue beacon analytics post.');
    }
  } else {
    axios
      .post(MintApiClient.__ANALYTICS_ENDPOINT__ + '/create', data)
      .then(({ data, status }) => {
        if (status < 200 || status > 299) {
          throw new Error('ServerReturnedExceptionStatusCode');
        }

        console.log({ data });
      })
      .catch((e) => {
        console.warn('@COUCH-MINT/WEB.METRIC.POST:::FAILED');
        console.error(e);
      });
  }
}

function setupAnalytics() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onFID(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

export { sendToAnalytics, setupAnalytics };
