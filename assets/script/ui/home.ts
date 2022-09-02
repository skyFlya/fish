import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }


    show(){
        console.log("home展示");
    }

    hide(){
        console.log("home隐藏");
    }


}

