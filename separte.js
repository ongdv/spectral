const fs = require('fs');
const { getCsv } = require('.');

const PER = 300;
var times = 0;

const seprate = () => {
  const datas = getCsv('address.csv');
  //   console.log(datas);
  const len = datas.length;
  while (len >= PER * times) {
    const start = PER * times;
    var csvContent = '';
    const data = datas.slice(start, start + PER);

    data.forEach((e) => {
      csvContent += e + '\n';
    });

    fs.writeFileSync(`address${times}.csv`, csvContent, { encoding: 'utf-8' });
    console.log(times);
    times++;
  }
};

seprate();
