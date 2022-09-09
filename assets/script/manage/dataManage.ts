import { _decorator, Component, Node } from 'cc';
import { util } from '../common/util';
import { gameData } from '../const/gameData';
import { resourceUtil } from '../framework/resourceUtil';
const { ccclass, property } = _decorator;


@ccclass('dataManage')
export class dataManage {
    static _instance: dataManage;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new dataManage();
        return this._instance;
    }

    private fishJson: gameData.fish[] = [];

    public init() {
        resourceUtil.getJsonData("json/fish", (err, content) => {            
            this.fishJson = content;
        });
    }

    public getFishData(lv: number): gameData.fish {
        let fishJson = this.fishJson;
        for (let i = 0; i < fishJson.length; i++) {
            if (fishJson[i].lv == lv) {
                return util.Instance.deepCopy(fishJson[i])                
            }
        }
    }


}