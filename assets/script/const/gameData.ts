export namespace gameData{
    export interface fish{
        /**id */
        id:string,
        /**等级 */
        lv:number,
        /**每秒产生的金币 */
        gold:number,
    }

    export const fishScale = 0.7;
    export const fishSKeWidth = 220 * fishScale;
    export const fishSKeHeight = 220 * fishScale;    

}
