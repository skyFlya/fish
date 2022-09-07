import { _decorator, Component, Node, Prefab, CCObject, UITransform, Widget, v2, Vec2, Canvas, dragonBones } from 'cc';
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

    @property(dragonBones.ArmatureDisplay)
    private hechengSke: dragonBones.ArmatureDisplay = null;


    private screenWidth = 750;
    private screenHeight = 1334;

    private framWidth = 750;
    private frameHeight = 1334;

    private curClickTarget: Node = null;                 //当前选中的鱼
    private curClickTargetData: gameData.fish = null;    //当前选中的鱼的数据
    private curCLickTargetArray: Node[] = [];            //当前选中的鱼群

    private fishData: gameData.fish[] = [
        { id: "1", lv: 1, gold: 10 },
        { id: "2", lv: 1, gold: 10 },
        { id: "3", lv: 1, gold: 10 },
        { id: "4", lv: 2, gold: 20 },
        { id: "5", lv: 2, gold: 20 },
        { id: "6", lv: 2, gold: 20 },
        { id: "7", lv: 3, gold: 30 },
    ]

    onLoad() {
        this.frame.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.frame.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.frame.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.frame.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        this.hechengSke.node.active = false;
        this.hechengSke.node.setScale(gameData.fishScale, gameData.fishScale);

        this.node.getComponent(Widget).updateAlignment();
        this.screenWidth = this.getComponent(UITransform).width;
        this.screenHeight = this.getComponent(UITransform).height;        

        this.frame.getComponent(Widget).updateAlignment();
        this.framWidth = this.frame.getComponent(UITransform).width;
        this.frameHeight = this.frame.getComponent(UITransform).height;        
    }

    start() {
        this.initFrame();
    }

    initFrame() {
        let fishData = this.fishData;    
        for (let i = 0; i < fishData.length; i++) {
            let fish = poolManager.instance.getNode(this.fishPre, this.frame);
            fish.getComponent(fishItem).init(fishData[i], { width: this.framWidth, height: this.frameHeight });
        }
        setInterval(() => {
            this.checkIndex();
        }, 1000)
    }

    /**
     * 鱼类层级排序，Y值越大层级越高
     */
    checkIndex() {
        let child = this.frame.children;
        child.sort((a, b) => {
            return b.position.y - a.position.y;
        })
    }

    /**
     * 点击鱼塘
     * @param event 
     */
    touchStart(event) {
        let touchLoc = event.getLocation();
        touchLoc.x -= this.screenWidth / 2;
        touchLoc.y -= this.screenHeight / 2;

        let child = this.frame.children;
        let clickFish = [];
        for (let i = 0; i < child.length; i++) {
            let x = child[i].position.x;
            let y = child[i].position.y;
            if (this.checkIsInFrame(touchLoc, new Vec2(x, y))) {
                //console.log("符合条件", child[i].getComponent(fishItem).getId());          
                clickFish[clickFish.length] = child[i];
            }
        }
        if (clickFish.length > 0) {
            clickFish.sort((a, b) => {
                return b.position.y - a.position.y;
            })
            this.curClickTargetData = clickFish[clickFish.length - 1].getComponent(fishItem).getFishData();
            this.curClickTarget = clickFish[clickFish.length - 1];
            for (let i = 0; i < child.length; i++) {                        //寻找屏幕内相同等级的鱼
                let fishData = child[i].getComponent(fishItem).getFishData();
                if (fishData.lv == this.curClickTargetData.lv) {
                    child[i].getComponent(fishItem).setSate(gameData.fishState.click);
                    this.curCLickTargetArray[this.curCLickTargetArray.length] = child[i];
                }
            }
            this.curClickTarget.setPosition(touchLoc.x, touchLoc.y)
        }
    }

    /**
     * 检测是否点击到了鱼框
     * @param touchLoc 触触发点
     * @param target 目标鱼
     * @returns 
     */
    checkIsInFrame(touchLoc: Vec2, target: Vec2) {
        let padX = 100;
        let padY = 100;

        let conditionWidth = target.x - padX < touchLoc.x && target.x + padX > touchLoc.x;
        let conditionHeight = target.y - padY< touchLoc.y && target.y + padY > touchLoc.y;

        return conditionWidth && conditionHeight;
    }

    /**
     * 拖动逻辑
     * @param event 
     */
    touchMove(event) {
        if (this.curClickTarget) {
            let touchLoc = event.getLocation();
            touchLoc.x -= this.screenWidth / 2;
            touchLoc.y -= this.screenHeight / 2;
            this.curClickTarget.setPosition(touchLoc.x, touchLoc.y)            
        }
    }

    /**
     * 点击离开
     * @param event 
     */
    touchEnd(event) {
        if (this.curClickTarget) {
            let touchLoc = event.getLocation();
            touchLoc.x -= this.screenWidth / 2;
            touchLoc.y -= this.screenHeight / 2;

            let curCLickTargetArray = this.curCLickTargetArray;
            let curClickId = this.curClickTarget.getComponent(fishItem).getFishData().id;

            for (let i = 0; i < curCLickTargetArray.length; i++) {
                let x = curCLickTargetArray[i].position.x;
                let y = curCLickTargetArray[i].position.y;
                let fishData = curCLickTargetArray[i].getComponent(fishItem).getFishData();
                if (this.checkIsInFrame(touchLoc, new Vec2(x, y)) && fishData.id != curClickId) {        //寻找可以合成的鱼，除了自已
                    console.log("合成");
                    this.curClickTarget.destroy();
                    curCLickTargetArray[i].destroy();
                    this.curClickTarget = null;
                    this.playSynthesisAnimation(touchLoc.x, touchLoc.y);
                }
                else {
                    curCLickTargetArray[i].getComponent(fishItem).setSate(gameData.fishState.move);
                }
            }
            this.curClickTarget = null;
            this.curCLickTargetArray = [];
        }
    }

    /**
     * 播放合成动画
     * @param x 动画X
     * @param y 动画Y
     */
    public async playSynthesisAnimation(x, y) {
        this.hechengSke.node.active = true;
        this.hechengSke.playAnimation("hecheng");
        // Controller.Sound.play(Controller.SOUNDS.HECHENG);

        const length = this.hechengSke.armature().getSlot("fish_001_02").displayList.length;
        this.hechengSke.node.setPosition(x, y);
        this.hechengSke.armature().getSlot('fish_001_02').displayIndex = length - this.curClickTargetData.lv;
        this.hechengSke.armature().getSlot('fish_001_01').displayIndex = length - this.curClickTargetData.lv;
        this.hechengSke.on(dragonBones.EventObject.LOOP_COMPLETE, () => {
            this.hechengSke.node.active = false;
            console.log("播放完成");
        }, this);
    }


    private removeFishData(id) {
        //let fishArr
    }

    update(deltaTime: number) {

    }
}

