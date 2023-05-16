const { default: axios } = require('axios');
const APIConstant = require('./Constant');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const STORE_URL = __dirname + '/data'; //Store URL

// axios header
const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  Accept: 'application/json',
  mode: 'no-cors',
  'Access-Control-Allow-Origin': '*',
  Authorization: `Bearer ${process.env.API_KEY}`,
};

// 수집 전에 수집용 디렉토리 체크 및 생성
const beforeStart = () => {
  const result = fs.existsSync(STORE_URL);
  if (!result) {
    fs.mkdirSync(STORE_URL);
    return;
  }
};

// 파일 경로 만드는 함수
const getStoreUrl = (p) => {
  return STORE_URL + '/' + p;
};

// CSV 파일 읽는 함수
const getCsv = (filename) => {
  const csvPath = path.join(__dirname, filename);

  const csv = fs.readFileSync(csvPath, 'utf-8');

  const rows = csv.split('\r\n');

  return rows;
};

// 동기 지연 함수
const sleep = (ms) => {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
};

// MACRO 점수 계산 요청 => 요청 후에 바로 리턴이 되지 않음
const calculateScore = async (address) => {
  try {
    const url = APIConstant.CALCULATE_SCORE.replace(':wallet_address', address);
    console.log(url);
    const result = await axios.post(url, {}, { headers: { ...headers } });
    if (result.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// MACRO 점수 조회
const getScore = async (address) => {
  try {
    const url = APIConstant.GET_SCORE.replace(':wallet_address', address);
    console.log(url);
    const result = await axios.get(url, { headers: { ...headers } });
    if (result.status === 200) {
      return result.data;
    }
  } catch (error) {
    return false;
  }
};

// 지갑 정보 조회
const getInsights = async (address) => {
  try {
    const url = APIConstant.GET_INSIGHT.replace(':wallet_address', address);
    const result = await axios.get(url, { headers: { ...headers } });
    if (result.status === 200) {
      return result.data;
    }
  } catch (error) {
    return false;
  }
};

// 숫자 2자리로 마스킹
const formatNumber = (number) => {
  return number.toString().padStart(2, '0');
};

// MACRO 점수 생성 요청 함수
const pre = async (rows, times) => {
  const resPromise = rows.map(async (item) => {
    sleep(5000);
    const addr = item;
    const reqCal = await calculateScore(addr);
    console.log(reqCal);
    return { addr, reqCal };
  });

  const result = await Promise.all(resPromise);
  const resultJSON = JSON.stringify(result);
  const fileNum = formatNumber(times);

  const url = getStoreUrl(`pre${fileNum}.json`);
  fs.writeFileSync(url, resultJSON);
};

// MACRO 점수 및 지갑 조회 함수
const getInfo = async (rows, times) => {
  const resPromise = rows.map(async (item) => {
    const addr = item;
    sleep(100);
    const score = await getScore(addr);
    sleep(100);
    const insights = await getInsights(addr);
    return { addr, ...score, ...insights };
  });

  const result = await Promise.all(resPromise);

  const temp = result.filter((item) => {
    return item.risk_level;
  });

  const resultJSON = JSON.stringify(temp);
  const fileNum = formatNumber(times);
  const url = getStoreUrl(`score${fileNum}.json`);
  fs.writeFileSync(url, resultJSON);
};

module.exports = {
  beforeStart,
  pre,
  getInfo,
  getCsv,
  sleep,
  formatNumber,
  getStoreUrl,
};
