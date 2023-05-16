require('dotenv').config();
const BASE_URL = process.env.API_URL;

const APIConstant = {
  CALCULATE_SCORE: `${BASE_URL}/api/v1/addresses/:wallet_address/calculate_score`,
  GET_SCORE: `${BASE_URL}/api/v1/addresses/:wallet_address`,
  GET_INSIGHT: `${BASE_URL}/api/v1/addresses/:wallet_address/insights`,
};

module.exports = APIConstant;
