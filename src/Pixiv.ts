import sizeOf = require("buffer-image-size");
import { Browser, HTTPResponse, launch, Page } from "puppeteer";
import GifEncoder = require('gifencoder');
import { createWriteStream, readFileSync, unlink, unlinkSync, writeFileSync } from "fs";
import JSZip = require("jszip");
import * as Canvas from "canvas";
import ax = require("axios");
const axios = ax.default;

export class Pixiv {

    private browser: Browser;

    constructor() {}

    public async init(): Promise<void> {
        this.browser = await launch({headless: false});
    }

    public async login(username: string, pass: string): Promise<void> {
        let page = await this.loadPage();
        await page.goto("https://accounts.pixiv.net/login");

        // NEED CHANGE IF PIXIV INTERFACE CHANGE
        let login = await page.$("input[autocomplete='username']");
        let password = await page.$("input[autocomplete='current-password']");
        let submit = await (await page.$("div#container-login")).$("button.signup-form__submit");

        await login.type(username, {delay: 50});
        await password.type(pass, {delay: 50});
        await submit.click({delay: 50});

        await page.waitForNavigation({waitUntil: "domcontentloaded"});
        await page.close();
    }

    public async getTagInfo(tag: TAG): Promise<{word: string, tag: string, myFavoriteTags: Array<string>, tagTranslation: any, pixpedia: {abstract: string, id: string, image: string, parentTag: string, yomigana: string, siblingsTags: Array<string>}}> {
        return (await axios.get("https://www.pixiv.net/ajax/search/tags/" + encodeURI(tag.tag) + "?lang=en")).data.body;
    }

    public async getPopular(): Promise<{myFavoriteTags: Array<any>, popularTags: {illust: Array<TAG>, novel: Array<TAG>}, recommendByTags: {illust: Array<TAG>}, recommendTags: {illust: Array<TAG>}, tagTranslation: any, thumbnails: Array<Thumbnail>}> {
        return (await axios.get("https://www.pixiv.net/ajax/search/suggestion?mode=all&lang=en")).data.body;
    }

    public async search(tag: TAG): Promise<{tagTranslation: any, relatedTags: Array<string>, popular: {permanent: Array<Thumbnail>, recent: Array<Thumbnail>}, novel: {total: number, data: Array<Thumbnail>}, manga: {total: number, data: Array<Thumbnail>}, illust: {total: number, data: Array<Thumbnail>}, extraData: {meta: {canonical: string, description: string, descriptionHeader: string, title: string, alternateLanguages: {en: string, ja: string}}}}> {
        return (await axios.get("https://www.pixiv.net/ajax/search/top/" + encodeURI(tag.tag) + "?lang=en")).data.body;
    }

    public async artworkSearch(tag: TAG, options: {page?: number, mode?: "safe"|"r18"|"all", order?: "date_d"|"date"} = {page: 1, mode: "safe", order: "date_d"}): Promise<{tagTranslation: any, relatedTags: Array<string>, popular: {permanent: Array<Thumbnail>, recent: Array<Thumbnail>}, illustManga: {bookmarkRanges: Array<{min: number, max: number}>, total: number, data: Array<Thumbnail>}, extraData: {meta: {canonical: string, description: string, descriptionHeader: string, title: string, alternateLanguages: {en: string, ja: string}}}}> {
        return (await axios.get("https://www.pixiv.net/ajax/search/artworks/" + encodeURI(tag.tag) + "?word=" + encodeURI(tag.tag) + "&order=" + (options.order ? options.order : "date_d") + "&mode=" + (options.mode ? options.mode : "all") + "&p=" + (options.page ? options.page : 1) + "&s_mode=s_tag&type=all&lang=en")).data.body;
    }

    public async getAllImages(artwork: string, options: {realsize?: boolean, gifconvert?: boolean} = {realsize: false, gifconvert: false}): Promise<Array<Image>> {
        let page = await this.loadPage();
        let pages = 1;

        const val: Array<string> = [];
        const arr: Array<Image> = [];

        let prom = new Promise<void>((resolve) => {
            page.on("response", async (res: HTTPResponse) => {
                const image: Image = {
                    url: artwork,
                    buffer: null,
                    type: null,
                    size: {
                        height: 0,
                        width: 0
                    }
                };
                if ((res.status() == 200 || res.status() == 206) && res.request().method() == "GET") {
                    if (res.url().startsWith("https://i.pximg.net/img-master/img/") && !options.realsize && !val.includes(res.url())) {
                        image.buffer = (await res.buffer());
                        image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                        image.size = sizeOf(image.buffer);
                        arr.push(image);
                        val.push(res.url());
                    } else if (res.url().startsWith("https://i.pximg.net/img-original/img/") && options.realsize && !val.includes(res.url())) {
                        image.buffer = (await res.buffer());
                        image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                        image.size = sizeOf(image.buffer);
                        arr.push(image);
                        val.push(res.url());

                        let img = (await page.$$("a.gtm-expand-full-size-illust"))[arr.length];
                        if (img && img != undefined) {
                            await img.click({delay: 50});
                            await page.waitForTimeout(500);
                            await page.keyboard.press("Escape");
                        }
                    }
                    try {
                        let actual = await page.evaluate(e => {
                            return e.innerText.split("/")[0];
                        }, (await page.$("div[aria-label='Preview']")));
                        if (+actual < arr.length && (await page.$$("img[src*='https://i.pximg.net/img-master/img/']")).length > 1) {
                            await page.keyboard.press("ArrowDown");
                        }
                    } catch (e) {}
                    if (arr.length == pages && pages != 1) resolve();
                }
            });
        });

        await page.goto(artwork, {waitUntil: "load"});
        
        let button = await page.$("button.emr523-0.cwSjFV[type=button]");

        if (button != null) {
            pages = await page.evaluate(e => {
                return e.innerText.split("/")[1];
            }, (await page.$("div[aria-label='Preview']")));
            await button.click();

            if (options.realsize) {
                console.log(1)
                let img = await page.$("a.gtm-expand-full-size-illust");
                console.log(2)
                await img.click({delay: 50});
                console.log(3)
                await page.waitForTimeout(500);
                console.log(4)
                await page.keyboard.press("Escape");
            }
    
            await prom;


        } else {
            await page.close();
            return [await this.getFirstImage(artwork, options)];
        }

        await page.close();

        return arr;
    }

    public async getFirstImage(artwork: string, options: {realsize?: boolean, gifconvert?: boolean} = {realsize: false, gifconvert: false}): Promise<Image> {
        let page = await this.loadPage();

        const image: Image = {
            url: artwork,
            buffer: null,
            type: null,
            size: {
                height: 0,
                width: 0
            }
        };
        let blok = false;
        let prom = new Promise<void>((resolve) => {
            page.on("response", async (res: HTTPResponse) => {
                if ((res.status() == 200 || res.status() == 206) && res.request().method() == "GET") {
                    if (res.url().startsWith("https://i.pximg.net/img-master/img/") && !options.realsize) {
                        if (blok) return;
                        image.buffer = (await res.buffer());
                        image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                        image.size = sizeOf(image.buffer);
                        resolve();
                    } else if (res.url().startsWith("https://i.pximg.net/img-original/img/") && options.realsize) {
                        if (blok) return;
                        image.buffer = (await res.buffer());
                        image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                        image.size = sizeOf(image.buffer);
                        resolve()
                    } else if (res.url().startsWith("https://www.pixiv.net/ajax/illust/" + artwork.split("/")[artwork.split("/").length-1] + "/ugoira_meta")) {
                        blok = true;
                        let infos = JSON.parse((await res.buffer()).toString());
                        if (!options.realsize) {
                            let s = infos.body.src;
                            s = s.split("/")[s.split("/").length-1];
                            s = s.split(".")[0];
                            s = s.split("ugoira")[1];
                            
                            let ab = (await page.evaluate((url) => {
                                return fetch(url).then(res => res.blob()).then(blob => new Promise<any>(resolve => {
                                    const reader = new FileReader();
                                    reader.readAsBinaryString(blob);
                                    reader.onload = () => resolve(reader.result);
                                }));
                            }, infos.body.src));
                            image.buffer = Buffer.from(ab, "binary");
                            image.type = "GIF";
                            image.size = {
                                width: +s.split("x")[0],
                                height: +s.split("x")[1]
                            };

                            if (options.gifconvert) {
                                const zip = new JSZip();
                                await zip.loadAsync(image.buffer);
                                image.size = sizeOf(await zip.file(Object.keys(zip.files)[0]).async("nodebuffer"));
                                const gif = new GifEncoder(image.size.width, image.size.height);
                                const gifFile = createWriteStream('tmp.gif');
                                gif.createReadStream().pipe(gifFile);
                                gif.start();
                                gif.setRepeat(0);
                                
                                for (let frame of infos.body.frames) {
                                    let file = await zip.file(frame.file).async("nodebuffer");
                                    const canvas = Canvas.createCanvas(image.size.width, image.size.height);
                                    const ctx = canvas.getContext('2d');
                                    await new Promise<void>(resolve => {
                                        const img = new Canvas.Image();
                                        img.onload = () => {
                                            ctx.drawImage(img, 0, 0);
                                            resolve();
                                        }
                                        img.onerror = (err) => console.log(err);
                                        img.src = file;
                                    });
                                    gif.addFrame(ctx);
                                    gif.setDelay(frame.delay);
                                }
                                gif.finish();

                                image.buffer = readFileSync("tmp.gif");
                                unlinkSync("tmp.gif");

                            }
                            resolve();
                        } else {
                            let s = infos.body.originalSrc;
                            s = s.split("/")[s.split("/").length-1];
                            s = s.split(".")[0];
                            s = s.split("ugoira")[1];
                            
                            let ab = (await page.evaluate((url) => {
                                return fetch(url).then(res => res.blob()).then(blob => new Promise<any>(resolve => {
                                    const reader = new FileReader();
                                    reader.readAsBinaryString(blob);
                                    reader.onload = () => resolve(reader.result);
                                }));
                            }, infos.body.originalSrc));
                            image.buffer = Buffer.from(ab, "binary");
                            image.type = "GIF";
                            image.size = {
                                width: +s.split("x")[0],
                                height: +s.split("x")[1]
                            };

                            if (options.gifconvert) {
                                const zip = new JSZip();
                                await zip.loadAsync(image.buffer);
                                image.size = sizeOf(await zip.file(Object.keys(zip.files)[0]).async("nodebuffer"));
                                const gif = new GifEncoder(image.size.width, image.size.height);
                                const gifFile = createWriteStream('tmp.gif');
                                gif.createReadStream().pipe(gifFile);
                                gif.start();
                                gif.setRepeat(0);
                                
                                for (let frame of infos.body.frames) {
                                    let file = await zip.file(frame.file).async("nodebuffer");
                                    const canvas = Canvas.createCanvas(image.size.width, image.size.height);
                                    const ctx = canvas.getContext('2d');
                                    await new Promise<void>(resolve => {
                                        const img = new Canvas.Image();
                                        img.onload = () => {
                                            ctx.drawImage(img, 0, 0);
                                            resolve();
                                        }
                                        img.onerror = (err) => console.log(err);
                                        img.src = file;
                                    });
                                    gif.addFrame(ctx);
                                    gif.setDelay(frame.delay);
                                }
                                gif.finish();

                                image.buffer = readFileSync("tmp.gif");
                                unlinkSync("tmp.gif");

                            }
                            resolve();
                        }
                    }
                }
            });
        });

        await page.goto(artwork, {waitUntil: "networkidle0"});

        if (options.realsize) {
            let img = await page.$("a.gtm-expand-full-size-illust");
            await img.click({delay: 50});
            page.waitForNavigation({waitUntil: "networkidle0"})
        }

        await prom;

        await page.close();

        return image;
    }

    public async stop(): Promise<void> {
        await this.browser.close();
    }

    private async loadPage(): Promise<Page> {
        let page = await this.browser.newPage();
        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);
        return page;
    }
}

export interface Image {
    url: string;
    buffer: Buffer;
    type: ImageType;
    size: Dimention;
}

export declare type ImageType = "JPEG" | "PNG" | "GIF";

export interface Dimention {
    height: number;
    width: number;
}

export interface TAG {
    tag: string;
    ids: Array<number>;
}

export interface Thumbnail {
    id: string;
    "title": string;
    "illustType": number,
    "xRestrict": number,
    "restrict": number,
    "sl": number,
    "url": string,
    "description": string,
    "tags": Array<string>,
    "userId": string,
    "userName": string,
    "width": number,
    "height": number,
    "pageCount": number,
    "isBookmarkable": boolean,
    "bookmarkData": string,
    "alt": string,
    "titleCaptionTranslation": {
        "workTitle": string,
        "workCaption": string
    },
    "createDate": string,
    "updateDate": string,
    "isUnlisted": boolean,
    "isMasked": boolean,
    "profileImageUrl": string
}