const ora = require('ora');
const yaml = require('js-yaml');
const fs = require('fs-extra');

const { fetch, matchBangumi, walk } = require('../utils.js');

async function fetchData(year, month) {
    const baseUrl = 'https://github.com/FlandreDaisuki/DMHY-Bangumi-Index/raw/master/docs';
    const url = year === null && month === null ? `${baseUrl}/new.yaml` : `${baseUrl}/history/${year}-${month}/new.yaml`;
    const data = await fetch(url)
        .then((res) => res.text())
        .then((data) => yaml.load(data))
        .then((data) => {
            const keywordList = Object.values(data).reduce((acc, val) => {
                const data = Object.entries(val).map(([key, value]) => {
                    return {
                        id: value,
                        title: key
                    };
                })

                return acc.concat(data);
            }, []);
            return keywordList;
        })
        .catch((e)=>{
            return [];
        });
    return data;
}

exports.getAll = async function getAll(input) {
    /* const conditions = (() => {
      const results = [];
      const months = ['01', '04', '07', '10'];
      for (let year = new Date().getUTCFullYear(); year >= 2019; year--) {
        results.push(...months.map((month) => ({ year, month })));
      }
      return results;
    })();
    conditions.push({year:null, month:null});   // current season
    const items = await conditions.reduce((sequence, condition) => sequence.then(async (results) => {
        const spinner = ora(`Crawling ${condition.year}-${condition.month}`).start();
        const data = await fetchData(condition.year, condition.month);
        spinner.stop();

        return results.concat(data);
    }), Promise.resolve([]));
    return items; */

    // copy acgnx to dmhy directly
    const files = await walk(input, (item) => /\d\d\.json$/.test(item));
    const existingBangumi = await Promise.all(files.map(async file => {
        const result = await fs.readJson(file, 'utf-8');
        return { file, result };
    }));

    await Promise.all(existingBangumi.map(async ({ file, result }) => {
        let changed = false;
        result.forEach((item) => {
            const acgnx = item.sites.find((site) => site.site === 'acgnx');
            const hasDmhy = item.sites.some((site) => site.site === 'dmhy');
            if (acgnx && !hasDmhy) {
                item.sites.push({ site: 'dmhy', id: acgnx.id });
                changed = true;
            }
        });

        if (changed) {
            await fs.outputJson(file, result, { spaces: 2 });
        }
    }));

    return [];
};

exports.matchBangumi = async (input, items) => {
    return matchBangumi(input, { items });
}
