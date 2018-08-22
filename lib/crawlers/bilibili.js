const fetch = require('node-fetch');
const ora = require('ora');

exports.getAll = async function getAll() {
  const spinner = ora('Crawling').start();
  const api = 'https://bangumi.bilibili.com/web_api/season/index_global?page=1&page_size=233333&version=0&is_finish=0&start_year=0&tag_id=&index_type=0&index_sort=0&area=2&quarter=0';
  const { code, message, result } = await fetch(api).then(res => res.json());
  spinner.stop();
  if (code) {
    throw new Error(message);
  }
  return result.list.map(({ season_id: id, title, cover: img }) => ({ id, title, img }));
};

/**
 * 获取放送时间、是否官方、是否收费
 * @param  {Number} seasonId 番剧 ID
 * @return {Object}
 */
async function getData(seasonId) {
  const api = `https://bangumi.bilibili.com/jsonp/seasoninfo/${seasonId}.ver?callback=seasonListCallback`;
  const { code, message, result } = await fetch(api)
    .then(res => res.text())
    .then(text => (
      /^seasonListCallback/.test(text)
        ? text.match(/seasonListCallback\((.*)\);/)[1]
        : text
    ))
    .then(JSON.parse);
  if (code) {
    throw new Error(message);
  }
  const pubTime = new Date(`${result.pub_time} +08:00`).toISOString() || '';
  return {
    // 开播前 pub_time 不准确
    begin: result.episodes.length ? pubTime : '',
    official: ['bilibili', 'dujia', 'cooperate'].includes(result.copyright),
    premuiumOnly: !!(result.payment && result.payment.price * 1),
    exist: !!result.episodes.length,
  };
}

exports.getInfo = async function getInfo(id) {
  try {
    const { begin, official, premuiumOnly, exist } = await getData(id);
    return { begin, official, premuiumOnly, exist };
  } catch (err) {
    console.log(err);
    return {};
  }
};