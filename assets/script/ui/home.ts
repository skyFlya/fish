import { _decorator, Component, Node } from 'cc';
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

    }


    show(){
        console.log("home展示");
    }

    hide(){
        console.log("home隐藏");
    }


}

