"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Pixiv = void 0;
var sizeOf = require("buffer-image-size");
var puppeteer_1 = require("puppeteer");
var GifEncoder = require("gifencoder");
var fs_1 = require("fs");
var JSZip = require("jszip");
var Canvas = require("canvas");
var ax = require("axios");
var axios = ax["default"];
var Pixiv = /** @class */ (function () {
    function Pixiv() {
    }
    Pixiv.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.launch({ headless: false })];
                    case 1:
                        _a.browser = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Pixiv.prototype.login = function (username, pass) {
        return __awaiter(this, void 0, void 0, function () {
            var page, login, password, submit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto("https://accounts.pixiv.net/login")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.$("input[autocomplete='username']")];
                    case 3:
                        login = _a.sent();
                        return [4 /*yield*/, page.$("input[autocomplete='current-password']")];
                    case 4:
                        password = _a.sent();
                        return [4 /*yield*/, page.$("div#container-login")];
                    case 5: return [4 /*yield*/, (_a.sent()).$("button.signup-form__submit")];
                    case 6:
                        submit = _a.sent();
                        return [4 /*yield*/, login.type(username, { delay: 50 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, password.type(pass, { delay: 50 })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, submit.click({ delay: 50 })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.waitForNavigation({ waitUntil: "domcontentloaded" })];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.close()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Pixiv.prototype.getTagInfo = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.pixiv.net/ajax/search/tags/" + encodeURI(tag.tag) + "?lang=en")];
                    case 1: return [2 /*return*/, (_a.sent()).data.body];
                }
            });
        });
    };
    Pixiv.prototype.getPopular = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.pixiv.net/ajax/search/suggestion?mode=all&lang=en")];
                    case 1: return [2 /*return*/, (_a.sent()).data.body];
                }
            });
        });
    };
    Pixiv.prototype.search = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.pixiv.net/ajax/search/top/" + encodeURI(tag.tag) + "?lang=en")];
                    case 1: return [2 /*return*/, (_a.sent()).data.body];
                }
            });
        });
    };
    Pixiv.prototype.artworkSearch = function (tag, options) {
        if (options === void 0) { options = { page: 1, mode: "safe", order: "date_d" }; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.pixiv.net/ajax/search/artworks/" + encodeURI(tag.tag) + "?word=" + encodeURI(tag.tag) + "&order=" + (options.order ? options.order : "date_d") + "&mode=" + (options.mode ? options.mode : "all") + "&p=" + (options.page ? options.page : 1) + "&s_mode=s_tag&type=all&lang=en")];
                    case 1: return [2 /*return*/, (_a.sent()).data.body];
                }
            });
        });
    };
    Pixiv.prototype.getAllImages = function (artwork, options) {
        if (options === void 0) { options = { realsize: false, gifconvert: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var page, pages, val, arr, prom, button, _a, _b, _c, img;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.loadPage()];
                    case 1:
                        page = _d.sent();
                        pages = 1;
                        val = [];
                        arr = [];
                        prom = new Promise(function (resolve) {
                            page.on("response", function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var image, _a, _b, img, actual, _c, _d, _e, _f, e_1;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            image = {
                                                url: artwork,
                                                buffer: null,
                                                type: null,
                                                size: {
                                                    height: 0,
                                                    width: 0
                                                }
                                            };
                                            if (!((res.status() == 200 || res.status() == 206) && res.request().method() == "GET")) return [3 /*break*/, 17];
                                            if (!(res.url().startsWith("https://i.pximg.net/img-master/img/") && !options.realsize && !val.includes(res.url()))) return [3 /*break*/, 2];
                                            _a = image;
                                            return [4 /*yield*/, res.buffer()];
                                        case 1:
                                            _a.buffer = (_g.sent());
                                            image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                                            image.size = sizeOf(image.buffer);
                                            arr.push(image);
                                            val.push(res.url());
                                            return [3 /*break*/, 8];
                                        case 2:
                                            if (!(res.url().startsWith("https://i.pximg.net/img-original/img/") && options.realsize && !val.includes(res.url()))) return [3 /*break*/, 8];
                                            _b = image;
                                            return [4 /*yield*/, res.buffer()];
                                        case 3:
                                            _b.buffer = (_g.sent());
                                            image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                                            image.size = sizeOf(image.buffer);
                                            arr.push(image);
                                            val.push(res.url());
                                            return [4 /*yield*/, page.$$("a.gtm-expand-full-size-illust")];
                                        case 4:
                                            img = (_g.sent())[arr.length];
                                            if (!(img && img != undefined)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, img.click({ delay: 50 })];
                                        case 5:
                                            _g.sent();
                                            return [4 /*yield*/, page.waitForTimeout(500)];
                                        case 6:
                                            _g.sent();
                                            return [4 /*yield*/, page.keyboard.press("Escape")];
                                        case 7:
                                            _g.sent();
                                            _g.label = 8;
                                        case 8:
                                            _g.trys.push([8, 15, , 16]);
                                            _d = (_c = page).evaluate;
                                            _e = [function (e) {
                                                    return e.innerText.split("/")[0];
                                                }];
                                            return [4 /*yield*/, page.$("div[aria-label='Preview']")];
                                        case 9: return [4 /*yield*/, _d.apply(_c, _e.concat([(_g.sent())]))];
                                        case 10:
                                            actual = _g.sent();
                                            _f = +actual < arr.length;
                                            if (!_f) return [3 /*break*/, 12];
                                            return [4 /*yield*/, page.$$("img[src*='https://i.pximg.net/img-master/img/']")];
                                        case 11:
                                            _f = (_g.sent()).length > 1;
                                            _g.label = 12;
                                        case 12:
                                            if (!_f) return [3 /*break*/, 14];
                                            return [4 /*yield*/, page.keyboard.press("ArrowDown")];
                                        case 13:
                                            _g.sent();
                                            _g.label = 14;
                                        case 14: return [3 /*break*/, 16];
                                        case 15:
                                            e_1 = _g.sent();
                                            return [3 /*break*/, 16];
                                        case 16:
                                            if (arr.length == pages && pages != 1)
                                                resolve();
                                            _g.label = 17;
                                        case 17: return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                        return [4 /*yield*/, page.goto(artwork, { waitUntil: "load" })];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, page.$("button.emr523-0.cwSjFV[type=button]")];
                    case 3:
                        button = _d.sent();
                        if (!(button != null)) return [3 /*break*/, 13];
                        _b = (_a = page).evaluate;
                        _c = [function (e) {
                                return e.innerText.split("/")[1];
                            }];
                        return [4 /*yield*/, page.$("div[aria-label='Preview']")];
                    case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.sent())]))];
                    case 5:
                        pages = _d.sent();
                        return [4 /*yield*/, button.click()];
                    case 6:
                        _d.sent();
                        if (!options.realsize) return [3 /*break*/, 11];
                        console.log(1);
                        return [4 /*yield*/, page.$("a.gtm-expand-full-size-illust")];
                    case 7:
                        img = _d.sent();
                        console.log(2);
                        return [4 /*yield*/, img.click({ delay: 50 })];
                    case 8:
                        _d.sent();
                        console.log(3);
                        return [4 /*yield*/, page.waitForTimeout(500)];
                    case 9:
                        _d.sent();
                        console.log(4);
                        return [4 /*yield*/, page.keyboard.press("Escape")];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [4 /*yield*/, prom];
                    case 12:
                        _d.sent();
                        return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, page.close()];
                    case 14:
                        _d.sent();
                        return [4 /*yield*/, this.getFirstImage(artwork, options)];
                    case 15: return [2 /*return*/, [_d.sent()]];
                    case 16: return [4 /*yield*/, page.close()];
                    case 17:
                        _d.sent();
                        return [2 /*return*/, arr];
                }
            });
        });
    };
    Pixiv.prototype.getFirstImage = function (artwork, options) {
        if (options === void 0) { options = { realsize: false, gifconvert: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var page, image, blok, prom, img;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadPage()];
                    case 1:
                        page = _a.sent();
                        image = {
                            url: artwork,
                            buffer: null,
                            type: null,
                            size: {
                                height: 0,
                                width: 0
                            }
                        };
                        blok = false;
                        prom = new Promise(function (resolve) {
                            page.on("response", function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, infos, _c, _d, s, ab, zip, _e, _f, gif, gifFile, _loop_1, _i, _g, frame, s, ab, zip, _h, _j, gif, gifFile, _loop_2, _k, _l, frame;
                                return __generator(this, function (_m) {
                                    switch (_m.label) {
                                        case 0:
                                            if (!((res.status() == 200 || res.status() == 206) && res.request().method() == "GET")) return [3 /*break*/, 23];
                                            if (!(res.url().startsWith("https://i.pximg.net/img-master/img/") && !options.realsize)) return [3 /*break*/, 2];
                                            if (blok)
                                                return [2 /*return*/];
                                            _a = image;
                                            return [4 /*yield*/, res.buffer()];
                                        case 1:
                                            _a.buffer = (_m.sent());
                                            image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                                            image.size = sizeOf(image.buffer);
                                            resolve();
                                            return [3 /*break*/, 23];
                                        case 2:
                                            if (!(res.url().startsWith("https://i.pximg.net/img-original/img/") && options.realsize)) return [3 /*break*/, 4];
                                            if (blok)
                                                return [2 /*return*/];
                                            _b = image;
                                            return [4 /*yield*/, res.buffer()];
                                        case 3:
                                            _b.buffer = (_m.sent());
                                            image.type = (res.url().endsWith("jpg") ? "JPEG" : "PNG");
                                            image.size = sizeOf(image.buffer);
                                            resolve();
                                            return [3 /*break*/, 23];
                                        case 4:
                                            if (!res.url().startsWith("https://www.pixiv.net/ajax/illust/" + artwork.split("/")[artwork.split("/").length - 1] + "/ugoira_meta")) return [3 /*break*/, 23];
                                            blok = true;
                                            _d = (_c = JSON).parse;
                                            return [4 /*yield*/, res.buffer()];
                                        case 5:
                                            infos = _d.apply(_c, [(_m.sent()).toString()]);
                                            if (!!options.realsize) return [3 /*break*/, 14];
                                            s = infos.body.src;
                                            s = s.split("/")[s.split("/").length - 1];
                                            s = s.split(".")[0];
                                            s = s.split("ugoira")[1];
                                            return [4 /*yield*/, page.evaluate(function (url) {
                                                    return fetch(url).then(function (res) { return res.blob(); }).then(function (blob) { return new Promise(function (resolve) {
                                                        var reader = new FileReader();
                                                        reader.readAsBinaryString(blob);
                                                        reader.onload = function () { return resolve(reader.result); };
                                                    }); });
                                                }, infos.body.src)];
                                        case 6:
                                            ab = (_m.sent());
                                            image.buffer = Buffer.from(ab, "binary");
                                            image.type = "GIF";
                                            image.size = {
                                                width: +s.split("x")[0],
                                                height: +s.split("x")[1]
                                            };
                                            if (!options.gifconvert) return [3 /*break*/, 13];
                                            zip = new JSZip();
                                            return [4 /*yield*/, zip.loadAsync(image.buffer)];
                                        case 7:
                                            _m.sent();
                                            _e = image;
                                            _f = sizeOf;
                                            return [4 /*yield*/, zip.file(Object.keys(zip.files)[0]).async("nodebuffer")];
                                        case 8:
                                            _e.size = _f.apply(void 0, [_m.sent()]);
                                            gif = new GifEncoder(image.size.width, image.size.height);
                                            gifFile = fs_1.createWriteStream('tmp.gif');
                                            gif.createReadStream().pipe(gifFile);
                                            gif.start();
                                            gif.setRepeat(0);
                                            _loop_1 = function (frame) {
                                                var file, canvas, ctx;
                                                return __generator(this, function (_o) {
                                                    switch (_o.label) {
                                                        case 0: return [4 /*yield*/, zip.file(frame.file).async("nodebuffer")];
                                                        case 1:
                                                            file = _o.sent();
                                                            canvas = Canvas.createCanvas(image.size.width, image.size.height);
                                                            ctx = canvas.getContext('2d');
                                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                                    var img = new Canvas.Image();
                                                                    img.onload = function () {
                                                                        ctx.drawImage(img, 0, 0);
                                                                        resolve();
                                                                    };
                                                                    img.onerror = function (err) { return console.log(err); };
                                                                    img.src = file;
                                                                })];
                                                        case 2:
                                                            _o.sent();
                                                            gif.addFrame(ctx);
                                                            gif.setDelay(frame.delay);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _g = infos.body.frames;
                                            _m.label = 9;
                                        case 9:
                                            if (!(_i < _g.length)) return [3 /*break*/, 12];
                                            frame = _g[_i];
                                            return [5 /*yield**/, _loop_1(frame)];
                                        case 10:
                                            _m.sent();
                                            _m.label = 11;
                                        case 11:
                                            _i++;
                                            return [3 /*break*/, 9];
                                        case 12:
                                            gif.finish();
                                            image.buffer = fs_1.readFileSync("tmp.gif");
                                            fs_1.unlinkSync("tmp.gif");
                                            _m.label = 13;
                                        case 13:
                                            resolve();
                                            return [3 /*break*/, 23];
                                        case 14:
                                            s = infos.body.originalSrc;
                                            s = s.split("/")[s.split("/").length - 1];
                                            s = s.split(".")[0];
                                            s = s.split("ugoira")[1];
                                            return [4 /*yield*/, page.evaluate(function (url) {
                                                    return fetch(url).then(function (res) { return res.blob(); }).then(function (blob) { return new Promise(function (resolve) {
                                                        var reader = new FileReader();
                                                        reader.readAsBinaryString(blob);
                                                        reader.onload = function () { return resolve(reader.result); };
                                                    }); });
                                                }, infos.body.originalSrc)];
                                        case 15:
                                            ab = (_m.sent());
                                            image.buffer = Buffer.from(ab, "binary");
                                            image.type = "GIF";
                                            image.size = {
                                                width: +s.split("x")[0],
                                                height: +s.split("x")[1]
                                            };
                                            if (!options.gifconvert) return [3 /*break*/, 22];
                                            zip = new JSZip();
                                            return [4 /*yield*/, zip.loadAsync(image.buffer)];
                                        case 16:
                                            _m.sent();
                                            _h = image;
                                            _j = sizeOf;
                                            return [4 /*yield*/, zip.file(Object.keys(zip.files)[0]).async("nodebuffer")];
                                        case 17:
                                            _h.size = _j.apply(void 0, [_m.sent()]);
                                            gif = new GifEncoder(image.size.width, image.size.height);
                                            gifFile = fs_1.createWriteStream('tmp.gif');
                                            gif.createReadStream().pipe(gifFile);
                                            gif.start();
                                            gif.setRepeat(0);
                                            _loop_2 = function (frame) {
                                                var file, canvas, ctx;
                                                return __generator(this, function (_p) {
                                                    switch (_p.label) {
                                                        case 0: return [4 /*yield*/, zip.file(frame.file).async("nodebuffer")];
                                                        case 1:
                                                            file = _p.sent();
                                                            canvas = Canvas.createCanvas(image.size.width, image.size.height);
                                                            ctx = canvas.getContext('2d');
                                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                                    var img = new Canvas.Image();
                                                                    img.onload = function () {
                                                                        ctx.drawImage(img, 0, 0);
                                                                        resolve();
                                                                    };
                                                                    img.onerror = function (err) { return console.log(err); };
                                                                    img.src = file;
                                                                })];
                                                        case 2:
                                                            _p.sent();
                                                            gif.addFrame(ctx);
                                                            gif.setDelay(frame.delay);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _k = 0, _l = infos.body.frames;
                                            _m.label = 18;
                                        case 18:
                                            if (!(_k < _l.length)) return [3 /*break*/, 21];
                                            frame = _l[_k];
                                            return [5 /*yield**/, _loop_2(frame)];
                                        case 19:
                                            _m.sent();
                                            _m.label = 20;
                                        case 20:
                                            _k++;
                                            return [3 /*break*/, 18];
                                        case 21:
                                            gif.finish();
                                            image.buffer = fs_1.readFileSync("tmp.gif");
                                            fs_1.unlinkSync("tmp.gif");
                                            _m.label = 22;
                                        case 22:
                                            resolve();
                                            _m.label = 23;
                                        case 23: return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                        return [4 /*yield*/, page.goto(artwork, { waitUntil: "networkidle0" })];
                    case 2:
                        _a.sent();
                        if (!options.realsize) return [3 /*break*/, 5];
                        return [4 /*yield*/, page.$("a.gtm-expand-full-size-illust")];
                    case 3:
                        img = _a.sent();
                        return [4 /*yield*/, img.click({ delay: 50 })];
                    case 4:
                        _a.sent();
                        page.waitForNavigation({ waitUntil: "networkidle0" });
                        _a.label = 5;
                    case 5: return [4 /*yield*/, prom];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.close()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, image];
                }
            });
        });
    };
    Pixiv.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Pixiv.prototype.loadPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        page.setDefaultNavigationTimeout(0);
                        page.setDefaultTimeout(0);
                        return [2 /*return*/, page];
                }
            });
        });
    };
    return Pixiv;
}());
exports.Pixiv = Pixiv;
