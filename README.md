# SPIDERS
Crawl and download web easily and effectively using spiders.

## Installation
```sh
npm install spiders
```
or
```sh
yarn add spiders
```

## Usage


ES6 syntax:
```js
let Spiders = require('spiders');
let spidy = new Spiders();
//Crawl
spidy.crawl('http://urltoscrape')
	.then($ => {
		let title = $("title").text();//Jquery functions
		console.log(title);
	})
	.catch(e => console.log("error",e));
//Download
spider.download('http://url/to/download')
	.then(()=>{console.log("Downloaded"});
	.catch(e=>console.log("Error",e));
```
## Options
Each spider can be created with some options
```js
//Default values.
let options = {
	showStats:true,
	visited:[],//Previsisted NOdes
	isVisit:function(obj,url){
	return obj.url == url;},
	proxy:null,
	setVisit:function(url){return {url:url}}
}

let spidy = new Spiders(options);
```
## Note

*To crawl function works only if it not crawled before.  To add pre-visited nodes not to crawl add it to visited in **Options** *