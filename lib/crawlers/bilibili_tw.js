const bilibili = require('./bilibili.js');
const { matchBangumi } = require('../utils.js');

exports.getAll = async function getAll() {
  const area = 'tw';
  const items = await bilibili.getAllBangumi(1, undefined, area);
  return items.map((item) => ({
    id: `${item.media_id}`,
    titleTranslate: { 'zh-Hant': [bilibili.getTitleByArea(item.title, area)] },
    img: item.cover,
    href: `https://www.bilibili.com/bangumi/media/md${item.media_id}/`,
  }));
};

exports.getBegin = async function getBegin(mediaId) {
  return await bilibili.getBegin(mediaId);
};

exports.matchBangumi = async (input, items) => {
  return matchBangumi(input, { items });
}

exports.getIsBangumiOffline = async (id) => {
  return await bilibili.getIsBangumiOffline(id);
}
