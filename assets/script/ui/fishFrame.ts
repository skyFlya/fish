import { _decorator, Component, Node, Prefab, CCObject, UITransform, Widget, v2, Vec2, Canvas, dragonBones } from 'cc';
import { eventName } from '../const/eventName';
import { gameData } from '../const/gameData';
import { clientEvent } from '../framework/clientEvent';
import { poolManager } from '../framework/poolManager';
import { fishItem } from '../item/fishItem';
import { dataManage } from '../manage/dataManage';
const { ccclass, property } = _decorator;

@ccclass('fishFrame')
export class fishFrame extends Component {

    @property(Prefab)
    private fishPre: Prefab = null;

    @property(Prefab)
    private hechengSkePre: Prefab = null;

    @property(Node)
    private frame: Node = null;

    private screenWidth = 750;
    private screenHeight = 1334;

    private framWidth = 750;
    private frameHeight = 1334;



    private _fishId = 0;
    public get fishId(): number {        
        return this._fishId++;
    }


    private curClickTarget: Node = null;                 //当前选中的鱼
    private curClickTargetData: gameData.fish = null;    //当前选中的鱼的数据
    private curCLickTargetArray: Node[] = [];            //当前选中的鱼群

    private fishData: gameData.fish[] = []

    onLoad() {
        this.frame.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.frame.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.frame.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.frame.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);        

        this.node.getComponent(Widget).updateAlignment();
        this.screenWidth = screen.width * 2;
        this.screenHeight = screen.height * 2;                

        this.frame.getComponent(Widget).updateAlignment();
        this.framWidth = this.frame.getComponent(UITransform).width;
        this.frameHeight = this.frame.getComponent(UITransform).height;        
    }

    onEnable(){        
        clientEvent.on(eventName.FISH_UPDATE, this.updateFish, this);
    }

    onDisable(){
        clientEvent.off(eventName.FISH_UPDATE, this.updateFish, this);
    }

    start() {     
         this.initFrame();
    }

    initFrame() {
        /** */
        this.addFish(1);
        this.addFish(1);
        this.addFish(1);
        this.addFish(1);        
        /** */        

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
        let conditionWidth = Math.abs(touchLoc.x - target.x) < 100;
        let conditionHeight =  Math.abs(touchLoc.y - target.y) < 100;        
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
            let curTargetData = this.curClickTarget.getComponent(fishItem).getFishData();
            let curClickId = curTargetData.clientId;            

            for (let i = 0; i < curCLickTargetArray.length; i++) {
                let x = curCLickTargetArray[i].position.x;
                let y = curCLickTargetArray[i].position.y;
                let fishData = curCLickTargetArray[i].getComponent(fishItem).getFishData();               

                if (this.checkIsInFrame(touchLoc, new Vec2(x, y)) && fishData.clientId != curClickId && this.curClickTarget) {        //寻找可以合成的鱼，除了自已
                    console.log("合成");
                    poolManager.instance.putNode(this.curClickTarget);
                    poolManager.instance.putNode(curCLickTargetArray[i]);

                    this.removeFish(curCLickTargetArray[i], fishData);
                    this.removeFish(this.curClickTarget, curTargetData);

                    this.curClickTarget = null;
                    this.playSynthesisAnimation(Number(curTargetData.lv) + 1, touchLoc.x, touchLoc.y);                    
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
    public playSynthesisAnimation(lv, x, y) {
        // this.hechengSke.node.active = true;
        // this.hechengSke.playAnimation("hecheng", 1);
        // // Controller.Sound.play(Controller.SOUNDS.HECHENG);

        // const length = this.hechengSke.armature().getSlot("fish_001_02").displayList.length;
        // this.hechengSke.node.setPosition(x, y);
        // this.hechengSke.armature().getSlot('fish_001_02').displayIndex = length - this.curClickTargetData.lv;
        // this.hechengSke.armature().getSlot('fish_001_01').displayIndex = length - this.curClickTargetData.lv;
        // this.hechengSke.on(dragonBones.EventObject.COMPLETE, () => {            
        //     this.hechengSke.node.active = false;
        //     console.log("播放完成");
        // }, this);

        let hechengSkePre = poolManager.instance.getNode(this.hechengSkePre, this.node);        
        hechengSkePre.setScale(gameData.fishScale, gameData.fishScale);    
        let hechengSke = hechengSkePre.getComponent(dragonBones.ArmatureDisplay);
        hechengSke.armatureName = "hecheng"
        hechengSke.playAnimation("hecheng", 1);        

        const length = hechengSke.armature().getSlot("fish_001_02").displayList.length;
        hechengSke.node.setPosition(x, y);
        hechengSke.armature().getSlot('fish_001_02').displayIndex = length - this.curClickTargetData.lv;
        hechengSke.armature().getSlot('fish_001_01').displayIndex = length - this.curClickTargetData.lv;       
        setTimeout(() => {
            poolManager.instance.putNode(hechengSkePre);  
            this.addFish(lv, new Vec2(x, y))             
        }, 800);
    }

    private createFish(fishData, pos?:Vec2) {        
        fishData.clientId = this.fishId;

        let fish = poolManager.instance.getNode(this.fishPre, this.frame);
        if(!pos){
            let areawidth = this.framWidth / 2;
            let areaHeight = this.frameHeight / 2;
            pos = new Vec2();
            pos.x = Math.floor(Math.random()*(areawidth * 2 + 1) - areawidth);
            pos.y = Math.floor(Math.random()*(areaHeight * 2 + 1) - areaHeight);
        }
        fish.setPosition(pos.x, pos.y);
        fish.getComponent(fishItem).init(fishData, { width: this.framWidth, height: this.frameHeight });
    }

    private addFish(lv, pos?:Vec2){
        let fishData = dataManage.instance.getFishData(lv);
        this.fishData[this.fishData.length] = fishData;
        this.createFish(fishData, pos);
    }

    private removeFish(target, clientId) {
        poolManager.instance.putNode(target);
        for(let i = 0; i < this.fishData.length; i++){
            if(this.fishData[i].clientId == clientId){
                this.fishData.splice(i, 1);
                return;
            }
        }
    }

    private updateFish(data){        
        if(data.type == "add"){
            this.addFish(1);
        }
    }

}

