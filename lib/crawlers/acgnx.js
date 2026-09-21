const { matchBangumi } = require('../utils.js');

exports.getAll = async function getAll() {
    // get the source from 
    // https://share.acgnx.se/bangumi.txt
    // https://share.acgnx.se/bangumilist/{year}Q{1-4}.txt
    const source = '';
    const items = source.split(',').map(s => {
        const list = s.split('#');
        return {
            id: list[1].trim(),
            title: list[0].trim()
        };
    })
        .flat();

    return items;
};

exports.matchBangumi = async (input, items) => {
  return matchBangumi(input, { items });
}
