const puppeteer =  require('puppeteer');
const uniqueFilename = require('unique-filename')
const download = require('image-downloader')

let path = './src/img/';
let fullpath = uniqueFilename(path, 'picture') + '.jpg';

function isEmpty(property) {
    return (property === null || property === "" || typeof property === "undefined");
}

(async () => {
    const browser = await puppeteer.launch();
    const page    = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 720,
        deviceScaleFactor: 0
    })
    await page.goto('https://www.instagram.com/p/BzS9hlFnMhr/');
    const [elementHandle] = await page.$x('.//img/@srcset');
    if(typeof(elementHandle) != 'undefined'){
        const propertyHandle = await elementHandle.getProperty('value');
        const propertyValue = await propertyHandle.jsonValue();
        const largeImage = propertyValue.split(',').pop();
        if (isEmpty(largeImage)){
            largeImage = propertyValue.split(',').shift();
        }
        let options = {
            url: largeImage.split(' ').shift(),
            dest: fullpath
        };
        const { filename, image } = await download.image(options);
        console.log("Your file has been downloaded at " + path);
        console.log("Your filename is: " + filename.split('\\').pop())
    }else{
        console.log("cannot load page");
    }
    await page.close();
})()