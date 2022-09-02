import { _decorator, Component, Node, CCObject, find } from 'cc';
import { uiManager } from './framework/uiManager';
import { uiNameConstants } from './framework/uiNameConstants';
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
        //添加ui层          
        uiManager.instance.showDialog(uiNameConstants.Home);

        //添加游戏层
        

    }

    update(deltaTime: number) {
        
    }
}

