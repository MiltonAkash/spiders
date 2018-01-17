const cheerio = require('cheerio');
const reqpro = require('request-promise');
const fs = require('fs');
const ctable = require('console.table');
let rp = reqpro;
console.table({one:{two:2,three:3}});

let spider = {};
spider.props = {
    showStats: true,
    proxy: false,
    visited: [],
    isVisited: (current, visited = spider.props.visited) => visited.indexOf(current)
};

spider.defaults = (def) => {
    rp = reqpro.defaults({proxy:def.proxy});
    Object.assign(spider.props, ...def);
}

spider.state = {
    visited: spider.props.visited,
    isVisited: spider.props.isVisited,
    stats: {
        success: 0,
        failure: 0,
        visited: 0,
        skipped: 0
    },
    print: () => {
        console.table(spider.state.stats);
    }
};

spider.crawl = async (pageurl, callback) => {
    try {
        let resp = await rp({uri: pageurl, transform: body => cheerio.load(body)});
        if (callback) {
            callback(resp);
        }
        else {
            return new Promise((resolve, reject) => {
                resolve(resp);
            });
        }
    }
    catch (e) {
        throw e;

    }
}

spider.download = async (url,callback,path='./', filename=false) => {
    let name = filename || url.split('/').pop();
    let ext = url.split('.').pop();

    try {
        let res = await rp({uri: url, encoding: null});
        fs.writeFile(path + name + '.' + ext, res, 'binary', callback);
    }
    catch (e) {
        throw e;
    }
}

/*
spider.crawl('https://www.npmjs.com/package/console.table',($)=>{
    console.log($('h1').text());
});*/

