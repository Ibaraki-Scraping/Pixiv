import { writeFileSync } from "fs";
import { mkdirSync } from "fs";
import { Pixiv, TAG } from "./Pixiv"

(async () => {
    const pixiv = new Pixiv();
    await pixiv.init();
    //await pixiv.login("morgandu33470@gmail.com", "Morgan33470?");

    const tag: TAG = {
        ids: [],
        tag: "茨木童子(Fate)"
    }

    let page = 1;

    let deep = await pixiv.artworkSearch(tag, {
        page: page
    });

    try {
        mkdirSync("./" + deep.tagTranslation[tag.tag].en);
    } catch (e) {}

    while (deep.illustManga.data.length != 0) {
        console.log("page : " + page);
        for (let data of deep.illustManga.data) {
            try {
                let images = (await pixiv.getAllImages("https://www.pixiv.net/en/artworks/" + data.id, {realsize: false}));
                if (images.length == 1) {
                    writeFileSync("./" + deep.tagTranslation[tag.tag].en + "/" + data.id + "." + images[0].type.toLowerCase(), images[0].buffer);
                } else {
                    try {
                        mkdirSync("./" + deep.tagTranslation[tag.tag].en + "/" + data.id);
                    } catch (e) {}
                    
                    for (let i in images) {
                        let image = images[i];
                        writeFileSync("./" + deep.tagTranslation[tag.tag].en + "/" + data.id + "/" + i + "." + image.type.toLowerCase(), image.buffer);
                    }
                }
            } catch (e) {console.log(e)}
        }
        page++;
        deep = await pixiv.artworkSearch(tag, {
            page: page
        });
    }

    await pixiv.stop();

})()