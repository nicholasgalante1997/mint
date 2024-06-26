import axios from 'axios';
import moment from 'moment';
import { inject } from '@vercel/analytics';
import { v4 as uuid } from 'uuid';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

import { MintApiClient } from '../api';
import logger from '../log';

interface Analytics {
  id: string;
  event: {
    type: string;
    timestamp: string;
  };
  data: any;
}

export { type Analytics };

function isRunningInProd() {
  const prodEnv = process.env.NODE_ENV === 'production';
  const isBrowser = typeof window !== 'undefined';
  const hrefOrStub = (window && window?.location?.href) || 'localhost';
  const isLocalHost = hrefOrStub.includes('localhost');
  if (prodEnv && isBrowser && !isLocalHost) {
    return true;
  }
  return false;
}

function sendToAnalytics(metric: any) {
  if (isRunningInProd()) {
    pipeMetric(metric);
  } else {
    logger.info({ metric, event: '@COUCH/ANALYTICS' });
  }
}

async function pipeMetric(metric: any) {
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

        logger.info({ data });
      })
      .catch((e) => {
        logger.warn('@COUCH-MINT/WEB.METRIC.POST:::FAILED');
        logger.error(e);
      });
  }
}

function setupAnalytics() {
  if (process.env.NODE_ENV === 'production') {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onFID(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    inject({ mode: 'production', framework: 'react-xng' });
  }
}

export { sendToAnalytics, setupAnalytics };
