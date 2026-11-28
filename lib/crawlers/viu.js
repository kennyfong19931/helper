const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const { fetch, matchBangumi } = require('../utils.js');

async function getIdMap() {
  const spinner = ora('Fetching Viu ID Map').start();
  const api = 'https://cdn.jsdelivr.net/gh/bangumi-data/helper@master/lib/crawlers/dicts/viu.json';
  const remote = await fetch(api).then((res) => (res.ok ? res.json() : {})).catch(() => ({}));
  const idMapFile = path.resolve(__dirname, './dicts/viu.json');
  const local = await fs.readJSON(idMapFile).catch(() => ({}));
  spinner.stop();
  return { ...local.ID_MAP, ...remote.ID_MAP };
}

async function saveIdMap(ID_MAP) {
  const outputFile = path.resolve(__dirname, './dicts/viu.json');
  await fs.outputJson(outputFile, { ID_MAP }, { spaces: 2 });
}

async function correctId(seriesId) {
  const api = `https://api-gateway-global.viu.com/api/mobile?platform_flag_label=web&area_id=1&language_flag_id=1&ut=1&platformFlagLabel=web&areaId=1&languageFlagId=1&countryCode=HK&r=%2Fvod%2Fproduct-list&os_flag_id=1&series_id=${seriesId}&size=-1&sort=asc`;
  const json = await fetch(api).then((res) => res.json());
  return json.data.product_list[0].product_id;
}

async function getAllSeries(offset = 0) {
  const length = 44;
  const api = `https://api-gateway-global.viu.com/api/mobile?platform_flag_label=web&area_id=1&language_flag_id=1&ut=1&platformFlagLabel=web&areaId=1&languageFlagId=1&countryCode=HK&r=%2Fcategory%2Fseries&length=${length}&offset=${offset}&category_id=18`;
  const json = await fetch(api).then((res) => res.json());
  const page = json.data.series || [];
  const categoryTotal = json.data.category_series_total && json.data.category_series_total[0];
  const total = Number((categoryTotal && categoryTotal.series_total) || 0);

  if (!page.length || page.length < length || (total && offset + page.length >= total)) {
    return page;
  }
  return page.concat(await getAllSeries(offset + length));
}

exports.getAll = async function getAll() {
  const series = await getAllSeries();

  const items = series.map((item) => ({
    id: item.product_id,
    seriesId: item.series_id,
    titleTranslate: { "zh-Hant": [item.name] },
    img: item.series_image_url,
  }));

  // correct id from last video to first video
  let ID_MAP = await getIdMap();
  await items.reduce((sequence, item, idx) => sequence.then(async () => {
    const spinner = ora(`[${idx}/${items.length}]Correcting ID of ${item.titleTranslate['zh-Hant'][0]}`).start();
    try {
      let id;
      if (ID_MAP[item.seriesId]) {
        id = ID_MAP[item.seriesId];
      } else {
        id = await correctId(item.seriesId);
        ID_MAP[item.seriesId] = id;
      }
      Object.assign(item, { id });
    } catch (err) {
      console.log(err);
    }
    spinner.stop();
  }), Promise.resolve());

  // housekeep ID_MAP, remove pairs whose lastVid is not in items
  const itemLastVids = items.map((item) => item.seriesId);
  ID_MAP = Object.fromEntries(
    Object.entries(ID_MAP)
      .filter(([lastVid]) => itemLastVids.includes(lastVid)),
  );

  // save ID_MAP
  await saveIdMap(ID_MAP);
  return items;
};

exports.getBegin = async function getBegin(id) {
  const api = `https://api-gateway-global.viu.com/api/mobile?platform_flag_label=web&area_id=1&language_flag_id=1&ut=1&platformFlagLabel=web&areaId=1&languageFlagId=1&countryCode=HK&r=%2Fvod%2Fdetail&product_id=${id}&os_flag_id=1`;
  const json = await fetch(api).then((res) => res.json());
  return new Date(json.data.current_product.schedule_start_time * 1000).toISOString();
};

exports.matchBangumi = async (input, items) => {
  return matchBangumi(input, { items });
}

exports.getIsBangumiOffline = async (id) => {
  const api = `https://api-gateway-global.viu.com/api/mobile?platform_flag_label=web&area_id=1&language_flag_id=1&ut=1&platformFlagLabel=web&areaId=1&languageFlagId=1&countryCode=HK&r=%2Fvod%2Fdetail&product_id=${id}&os_flag_id=1`;
  const json = await fetch(api).then((res) => res.json());
  return json.data === undefined;
}
