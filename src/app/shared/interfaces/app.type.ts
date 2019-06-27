export enum Menu {
    UPLOAD,
    SHARE,
    RECENT
}
export interface MenuDetail {
    name: string;
    url: string[];
    isHover: boolean;
    corresMenu: Menu;
    isActive : boolean;
};