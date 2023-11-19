import axios from 'axios';

class MintApiClient {
  static __ANALYTICS_ENDPOINT__ = 'http://localhost:8080/api/analytics/';

  networkRequest = axios.create();

  get() {}
}

export { MintApiClient };
