export namespace gameData{
    export interface fish{
        /**client */
        clientId:number,        
        id: number,
        name: string,
        lv: number,
        spc: number,
        gold: number,
        reduce: number,
        red: number,
        show: number,
        sellGold: number,
        imgName: string,
        aniScale: number,
        produce: number,
        jinPb: number,
        heChengRed: number,
        initRed: number
    }    

    export enum fishState {
        move = 1,
        click = 2,
    }    

    export const fishScale = 0.7;
    export const fishSKeWidth = 450 * fishScale;
    export const fishSKeHeight = 450 * fishScale;
}
