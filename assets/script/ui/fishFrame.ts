import { _decorator, Component, Node, Prefab, CCObject, UITransform, Widget, v2, Vec2, Canvas } from 'cc';
import { gameData } from '../const/gameData';
import { poolManager } from '../framework/poolManager';
import { fishItem } from '../item/fishItem';
const { ccclass, property } = _decorator;

@ccclass('fishFrame')
export class fishFrame extends Component {

    @property(Prefab)
    private fishPre: Prefab = null;

    @property(Node)
    private frame: Node = null;

    private fishData: gameData.fish[] = [
        { id: "1", lv: 1, gold: 10 },
        { id: "2", lv: 2, gold: 20 },
        { id: "3", lv: 3, gold: 30 },
    ]

    onLoad(){
        this.frame.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.frame.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.frame.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    start() {
        this.initFrame();
    }

    initFrame() {
        let fishData = this.fishData;
        this.frame.getComponent(Widget).updateAlignment();
        let framUI = this.frame.getComponent(UITransform);
        for (let i = 0; i < fishData.length; i++) {
            let fish = poolManager.instance.getNode(this.fishPre, this.frame);
            fish.getComponent(fishItem).init(fishData[i], { width: framUI.width, height: framUI.height });
        }
        setInterval(() => {
            this.checkIndex();
        }, 1000)
    }

    checkIndex() {
        let child = this.frame.children;
        child.sort((a, b) => {
            return b.position.y - a.position.y;
        })
    }

    touchStart(event){
        let touchLoc = event.getLocation(); 
        touchLoc.x -= this.getComponent(UITransform).width/2;
        touchLoc.y -= this.getComponent(UITransform).height/2;

        let child = this.frame.children;
        for(let i = 0; i < child.length; i++){
            let x = child[i].position.x;
            let y = child[i].position.y;
            let conditionWidth = x - gameData.fishSKeWidth < touchLoc.x && x + gameData.fishSKeWidth > touchLoc.x;
            let conditionHeight = y - gameData.fishSKeHeight < touchLoc.y && y + gameData.fishSKeHeight > touchLoc.y;
            if(conditionWidth && conditionHeight){
                console.log("符合条件", child[i].getComponent(fishItem).getId());                
            }
        }        
    }

    touchMove(){

    }

    touchEnd(){

    }

    update(deltaTime: number) {

    }
}

