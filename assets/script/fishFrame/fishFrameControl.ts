import { _decorator, Component, Node, Prefab } from 'cc';
import { uiManager } from '../framework/uiManager';
import { uiNameConstants } from '../framework/uiNameConstants';
const { ccclass, property } = _decorator;

/**鱼的数据 */
export interface voFishData{
    /**id */
    id:string,
    /**每秒产出的金钱 */
    money:number
}



@ccclass('FishFrame')
export class FishFrame extends Component {

    private fish:Prefab = null;
    private fishData:voFishData[] = [];

    start() {
        this.fishData = [
            {id: "1", money: 100},
            {id: "2", money: 200},
            {id: "3", money: 300},
            {id: "4", money: 400},                        
        ]
    }

    initFrame(){

    }

    update(deltaTime: number) {
        
    }
}

