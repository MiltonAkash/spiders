const cheerio = require('cheerio'); //Jquery for Node
const reqpro = require('request-promise'); // Request
const fs = require('fs');
const Table = require('cli-table');

class Spider {
    constructor(obj = {}) {
        //properties
        this.props = {
            showStats: obj.showStats || true,
            setVisit: obj.setVisit || (url => ({
                url
            })),
            isVisit: obj.isVisit || ((obj, url) => obj.url == url),
            proxy: obj.proxy || false,
        };

        this.rp = obj.proxy ? reqpro : reqpro.defaults({proxy: obj.proxy});


        //states
        this.state = {
            visited: obj.visited || [],
            isVisited: (url) => {
                if (this.state.visited.findIndex(el => this.props.isVisit(el, url)) == -1) {
                    this.state.visited.push(this.props.setVisit(url));
                    return 0;
                }
                else {
                    return 1;
                }
            }
        };

        this.stats = {
            downloaded: 0, //
            success: 0, //succesful scraping
            failure: 0, // failurds
            skipped: 0 //Skipped due to visiting
        }

    }


    print() {

        let tableDesign = {
            head: ['Crawled Pages', 'Failed Crawls', 'Skipped Crawls', 'Downloaded'/*, 'Crawled Pages(from Beginning)'*/]
            // , colWidths: [100, 200]
        };

        if (this.props.showStats) {
            let table = new Table(tableDesign);
            let x = this.stats;
            table.push([x.success, x.failure, x.skipped, x.downloaded/*, this.state.visited.length*/]);
            console.log(table.toString());
        }

    }

    async download(url, path = './', filename = false) {
        return new Promise(async (resolve, reject) => {
            filename = filename ? filename + '.' + url.split('.').pop() : url.split('/').pop();

            try {
                let res = await this.rp({uri: url, encoding: null});
                fs.writeFile(path + '/' + filename, res, 'binary', (err) => {
                    this.stats.downloads++;
                    this.print();
                    if (err) reject(err);
                    else resolve();
                });

            }
            catch (e) {
                reject(e);
            }
        });

    };

    async crawl(pageurl) {
        return new Promise(async (resolve, reject) => {
            if (this.state.isVisited(pageurl)) {
                this.stats.skipped++;
                this.print();
                resolve();
            }

            try {
                let resp = await this.rp({uri: pageurl, transform: body => cheerio.load(body)});
                this.stats.success++;
                this.print();
                resolve(resp);
            }
            catch (e) {
                this.state.failure++;
                throw e;
                this.print();
                reject(e);
            }

        });
    }

}

module.exports = Spider;