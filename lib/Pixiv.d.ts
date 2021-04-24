/// <reference types="node" />
export declare class Pixiv {
    private browser;
    constructor();
    init(): Promise<void>;
    login(username: string, pass: string): Promise<void>;
    getTagInfo(tag: TAG): Promise<{
        word: string;
        tag: string;
        myFavoriteTags: Array<string>;
        tagTranslation: any;
        pixpedia: {
            abstract: string;
            id: string;
            image: string;
            parentTag: string;
            yomigana: string;
            siblingsTags: Array<string>;
        };
    }>;
    getPopular(): Promise<{
        myFavoriteTags: Array<any>;
        popularTags: {
            illust: Array<TAG>;
            novel: Array<TAG>;
        };
        recommendByTags: {
            illust: Array<TAG>;
        };
        recommendTags: {
            illust: Array<TAG>;
        };
        tagTranslation: any;
        thumbnails: Array<Thumbnail>;
    }>;
    search(tag: TAG): Promise<{
        tagTranslation: any;
        relatedTags: Array<string>;
        popular: {
            permanent: Array<Thumbnail>;
            recent: Array<Thumbnail>;
        };
        novel: {
            total: number;
            data: Array<Thumbnail>;
        };
        manga: {
            total: number;
            data: Array<Thumbnail>;
        };
        illust: {
            total: number;
            data: Array<Thumbnail>;
        };
        extraData: {
            meta: {
                canonical: string;
                description: string;
                descriptionHeader: string;
                title: string;
                alternateLanguages: {
                    en: string;
                    ja: string;
                };
            };
        };
    }>;
    artworkSearch(tag: TAG, options?: {
        page?: number;
        mode?: "safe" | "r18" | "all";
        order?: "date_d" | "date";
    }): Promise<{
        tagTranslation: any;
        relatedTags: Array<string>;
        popular: {
            permanent: Array<Thumbnail>;
            recent: Array<Thumbnail>;
        };
        illustManga: {
            bookmarkRanges: Array<{
                min: number;
                max: number;
            }>;
            total: number;
            data: Array<Thumbnail>;
        };
        extraData: {
            meta: {
                canonical: string;
                description: string;
                descriptionHeader: string;
                title: string;
                alternateLanguages: {
                    en: string;
                    ja: string;
                };
            };
        };
    }>;
    getAllImages(artwork: string, options?: {
        realsize?: boolean;
        gifconvert?: boolean;
    }): Promise<Array<Image>>;
    getFirstImage(artwork: string, options?: {
        realsize?: boolean;
        gifconvert?: boolean;
    }): Promise<Image>;
    stop(): Promise<void>;
    private loadPage;
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
    "illustType": number;
    "xRestrict": number;
    "restrict": number;
    "sl": number;
    "url": string;
    "description": string;
    "tags": Array<string>;
    "userId": string;
    "userName": string;
    "width": number;
    "height": number;
    "pageCount": number;
    "isBookmarkable": boolean;
    "bookmarkData": string;
    "alt": string;
    "titleCaptionTranslation": {
        "workTitle": string;
        "workCaption": string;
    };
    "createDate": string;
    "updateDate": string;
    "isUnlisted": boolean;
    "isMasked": boolean;
    "profileImageUrl": string;
}
