export enum Menu {
    UPLOAD,
    MAIN,
    SHARE,
    RECENT
}
export interface MenuDetail {
    name: string;
    url: string[];
    isHover: boolean;
    corresMenu: Menu;
};