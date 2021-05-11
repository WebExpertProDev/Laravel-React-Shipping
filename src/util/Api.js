import axios from 'axios';

export default axios.create({
  baseURL: `http://local.test.com/api/`,
  headers: {
    'Content-Type': 'application/vnd.api.v1+json',
  }
});
