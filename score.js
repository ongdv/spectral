const { pre, getCsv, sleep, getInfo, beforeStart } = require('.');

// 한번에 가지고올 데이터 양
const PER = 30;
// 순회용 변수, 기본값 1
var times = 1;
// 제한 횟수, 기본값 10
const LIMIT = 10;
// 대기 시간, 기본값 20분
const DELAY = 20;
// 읽어들일 data URL
const data = getCsv('_address.csv');

const scoreAwait = async () => {
  beforeStart();
  while (times <= LIMIT) {
    const start = (times - 1) * PER;

    const d = data.splice(start, PER);
    // 가끔 첫번째 요청에 오류가 뜸. 방지용으로 공백 입력
    const dd = ['', ...d];

    console.log(`Start Recording(${times})`);
    console.log('---------------');
    console.log('\nStart Request Calculate Score\n');
    await pre(dd, times);

    console.log('\nEnd Request Calculate Score\n');
    console.log('---------------');
    console.log('Waiting Calculate');
    sleep(1000 * 60 * DELAY);

    // console.log('---------------');
    console.log('\nRequest MACRO, Insights\n');
    await getInfo(dd, times);

    console.log('---------------');
    console.log(`Done Recording(${times})`);
    console.log('---------------\n');
    times++;
  }
};

scoreAwait();
