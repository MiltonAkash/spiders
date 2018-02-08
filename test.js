const Spider = require('./dist/index');

let spider = new Spider({showStats:false});
(async()=>{
        spider.crawl('http://tamiltunes.live/a-r-rahman-a-world-of-music.html')
            .then($=>console.log("DONE"))
            .catch(e=>console.log(e));//
    spider.crawl('http://tamiltunes.live/a-r-rahman-a-world-of-music.html')
            .then($=>console.log("DONE"))
            .catch(e=>console.log(e));//
        // $ = await spider.crawl('http://tamiltunes.live/a-r-rahman-a-world-of-music.html');//
        // await spider.crawl('http://tamiltunes.live/a-r-rahman-a-world-of-music.html');//
        let list = $('[href$=".mp3"]').map((i, el) => $(el).attr('href')).get();
        //
        // console.log(list);
})();

// spider.crawl(, ($) =>
// {
//     console.log(list);
/*    for (let song of list) {
        spider.download(list[0], () => {
            spider.print();
            console.log(song+"SOng downloaded");
        }, './songs');
    }
});*/
// spider.download('http://download.tamiltunes.live/songs/2013/Special-Collections/2011%20Hits%20Songs/Vilaiyadu%20Mankatha%20-%20TamilTunes.com.mp3',()=>{
//     console.log("donwloaded");
// },'/home/akash/Music');


