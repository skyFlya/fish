import { _decorator, Component, Node, CCObject, find } from 'cc';
import { gameData } from './const/gameData';
import { uiManager } from './framework/uiManager';
import { uiNameConstants } from './framework/uiNameConstants';
import { dataManage } from './manage/dataManage';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    private gameLayout:Node;
    private uiLayout:Node;
    private popLayout:Node;

    onLoad(){
        this.gameLayout = find("gameLayout");
        this.uiLayout = find("uiLayout");
        this.popLayout = find("popLayout");
    }

    start() {        
        //加载数据层
        dataManage.instance.init();

        //添加ui层          
        uiManager.instance.showDialog(uiNameConstants.Home);

        //添加游戏层
        uiManager.instance.showDialog(uiNameConstants.FishFrame);            
    }

    update(deltaTime: number) {
        
    }
}

