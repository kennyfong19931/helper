const cheerio = require('cheerio');
const fetch = require('node-fetch');

const { getAllBangumi } = require('../utils.js');

exports._getAll = async function getAll() {
  return getAllBangumi({
    api: page => `http://ch.nicovideo.jp/portal/anime/list?&page=${page}`,
    total: $ => $('.pages select option').length,
    items: $ => $('.channels>ul>li')
      .map((i, el) => {
        const title = $(el).find('.channel_name').attr('title');
        const href = $(el).find('.channel_name').attr('href');
        const id = href.slice(1);
        return { id, title };
      })
      .get(),
  });
};

/**
 * 获取视频列表
 * @param  {String} id 频道 ID
 * @return {Array}     视频列表
 */
async function getList(id) {
  // 投稿が古い順
  const api = `http://ch.nicovideo.jp/${id}/video?sort=f&order=a`;
  const $ = await fetch(api)
    .then(res => res.text())
    .then(cheerio.load);
  return $('.item .title a')
    .map((i, el) => $(el).attr('href').match(/watch\/(\d+)/)[1])
    .get();
}

/**
 * 获取放送时间
 * @param  {String} vid 视频 ID
 * @return {String}     放送时间
 */
async function getBegin(vid) {
  const api = `https://ext.nicovideo.jp/api/getthumbinfo/${vid}`;
  const $ = await fetch(api)
    .then(res => res.text())
    .then(cheerio.load);
  // 正片都会在描述中列出上一集或下一集
  return /watch\/\d+/.test($('description').text())
    ? new Date($('first_retrieve').text()).toISOString()
    : '';
}

exports.getInfo = async function getInfo(id) {
  try {
    const vids = await getList(id);
    const begin = await vids.reduce((seq, vid) => seq.then(bgn => (
      // 去除排在前面的 PV、CM 等
      bgn || getBegin(vid)
    )), Promise.resolve(''));
    return {
      begin,
      official: true,
      premuiumOnly: true,
      exist: !!begin,
    };
  } catch (err) {
    console.log(err);
    return {};
  }
};