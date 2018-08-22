const cheerio = require('cheerio');
const fetch = require('node-fetch');
const ora = require('ora');
const { delay } = require('../utils.js');

const spinner = ora();

/**
 * 获取当季番剧列表（TID 和官网链接）
 * @param  {String} season 格式如 '2016q3'
 * @return {Promise}
 */
async function getList(season) {
  const api = `http://cal.syoboi.jp/quarter/${season}`;
  const $ = await fetch(api)
    .then(res => res.text())
    .then(cheerio.load);
  return $('.titlesDetail > a')
    .map((idx, a) => {
      const link = $(a).next().find('td > a:has(> img)').attr('href');
      return {
        tid: $(a).attr('name'),
        link: /^\/tid\/\d+/.test(link) ? '' : link,
      };
    })
    .get();
}

/**
 * 获取番剧 meta 信息
 * @param  {Array} list 番剧列表
 * @return {Promise}
 */
async function getMetas(list) {
  const tids = list.map(li => li.tid);
  const api = `http://cal.syoboi.jp/json.php?Req=TitleFull&TID=${tids}`;
  const json = await fetch(api).then(res => res.json());
  return Object.values(json.Titles)
    .filter(meta => meta.Cat === '1' || meta.Cat === '10')
    .map((meta) => {
      const item = list.find(li => li.tid === meta.TID);
      meta.link = (item || {}).link;
      return meta;
    });
}

/**
 * 获取节目放送信息
 * TODO: TID=3179，一二集连播，查询 count=1 数据不对
 * @param  {String} tid   番剧 ID
 * @param  {String} count 集数
 * @return {Promise}
 */
async function getProgram(tid, count) {
  const api = `http://cal.syoboi.jp/json.php?Req=ProgramByCount&TID=${tid}&Count=${count}`;
  const json = await fetch(api).then(res => res.json());
  const programs = Object.values(json.Programs || {})
    .filter(({ ProgComment }) => !/先行配信/.test(ProgComment))
    .sort((a, b) => a.StTime - b.StTime);
  return programs.length ? programs[0] : null;
}

/**
 * 获取番剧最早和最晚的集数
 * @param  {String} subTitles 分集标题信息
 * @return {Array}
 */
function getCount(subTitles) {
  const arr = (subTitles.match(/\*\d+\*/g) || [])
    .map(str => str.match(/\d+/)[0] * 1);
  return arr.length ? [arr[0], arr.pop()] : [1, null];
}

/**
 * 获取放送时间
 * @param  {Object} metas 番剧 meta 数据对象
 * @param  {Number} type  为 0 或 1，代表 begin 或 end
 * @return {Promise}
 */
async function getDate(metas, type) {
  const now = new Date(Date.now() + 3.24e7).toISOString().slice(0, 7).replace('-', '') * 1;
  const programs = await metas
    .filter((meta) => {
      if (!type) return true;
      const end = (meta.FirstEndYear * 100) + (meta.FirstEndMonth * 1);
      return end && end < now;
    })
    .reduce((sequence, meta, idx, arr) => sequence.then(async (ps) => {
      spinner.text = `[syoboi][${idx + 1}/${arr.length}]Fetching ${type ? 'end' : 'begin'} of ${meta.Title}`;
      await delay(800);
      const p = await getProgram(meta.TID, getCount(meta.SubTitles)[type]);
      return ps.concat(p);
    }), Promise.resolve([]))
    .then(ps => ps.filter(p => p));
  const temp = metas.map((meta) => {
    const program = programs.find(p => p.TID === meta.TID);
    const time = type ? 'EdTime' : 'StTime';
    if (program) {
      Object.assign(meta, { [time]: new Date(program[time] * 1000).toISOString() });
    }
    return meta;
  });
  return temp;
}

exports.getSeason = async function getSeason(season) {
  spinner.start('[syoboi][fetching]');
  const items = await getList(season)
    .then(getMetas)
    .then(metas => getDate(metas, 0))
    .then(metas => getDate(metas, 1));
  spinner.succeed('[syoboi]');
  return items.map(item => ({
    title: item.Title,
    titleTranslate: item.TitleEN ? { en: [item.TitleEN] } : {},
    type: '',
    lang: 'ja',
    officialSite: item.link || '',
    begin: item.StTime || '',
    end: item.EdTime || '',
    comment: '',
    sites: [],
  }));
};