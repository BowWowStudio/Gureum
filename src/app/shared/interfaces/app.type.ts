export enum Menu {
    UPLOAD,
    MAIN,
    SHARE,
    RECENT,
    NEWFOLDER,
}
export interface MenuDetail {
    name: string;
    url: string[];
    isHover: boolean;
    corresMenu: Menu;
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
