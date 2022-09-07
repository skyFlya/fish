export namespace gameData{
    export interface fish{
        /**id */
        id:string,
        /**等级 */
        lv:number,
        /**每秒产生的金币 */
        gold:number,
    }

    export enum fishState {
        move = 1,
        click = 2,
    }    

    export const fishScale = 0.7;
    export const fishSKeWidth = 450 * fishScale;
    export const fishSKeHeight = 450 * fishScale;    

}
