import { _decorator, Component, Node } from 'cc';
import { eventName } from '../const/eventName';
import { clientEvent } from '../framework/clientEvent';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {

    @property(Node)
    private btnBuy:Node = null;

    onLoad(){
        this.btnBuy.on(Node.EventType.TOUCH_END, this.buyFish, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }


    buyFish(){
        clientEvent.dispatchEvent(eventName.FISH_UPDATE, {
            type: "add",
        });
    }


    show(){
        console.log("home展示");
    }

    hide(){
        console.log("home隐藏");
    }


}

