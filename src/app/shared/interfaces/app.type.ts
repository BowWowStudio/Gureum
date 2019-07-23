export enum Menu {
    UPLOAD,
    MAIN,
    SHARE,
    RECENT,
    NEWFOLDER,
    STARRED,
    BIN,
}
export interface MenuDetail {
    name: string;
    url: string[];
    isHover: boolean;
    corresMenu: Menu;
    icon? : string;
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
