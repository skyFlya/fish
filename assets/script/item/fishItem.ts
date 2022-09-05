import { _decorator, Component, Node, dragonBones, Game, Vec2, UITransform } from 'cc';
import { gameData } from '../const/gameData';
const { ccclass, property } = _decorator;


enum fishState {
    move = 1,
    click = 2,
}


@ccclass('fishItem')
export class fishItem extends Component {

    @property(Node)
    private fishNode: Node = null;

    private spr: dragonBones.ArmatureDisplay = null;


    private fishData: gameData.fish = null;     //鱼的初始化数据
    private speed = 20;                         //鱼的移动速度
    private _state = fishState.move;            //当前鱼的状态
    private directionX = 1;                      //鱼的X朝向(>0.右边 <0.左边)
    private directionY = 1;                      //鱼的Y朝向(>0.右边 <0.左边)
    private moveAre: { width: number, height: number } = { width: 220, height: 220 };       //鱼的移动范围

    public set state(v: number) {
        this._state = v;
        this.updateState();
    }


    public get state(): number {
        return this._state;
    }

    start() {

    }

    /**
     * 
     * @param fishData 鱼的数据
     * @param width 移动范围     
     */
    init(fishData: gameData.fish, moveAre: { width: number, height: number }) {
        this.spr = this.fishNode.getComponent(dragonBones.ArmatureDisplay);
        this.spr.node.setScale(gameData.fishScale, gameData.fishScale);

        //设置移动区域        
        this.fishData = fishData;
        this.moveAre.width = moveAre.width / 2 - gameData.fishSKeWidth / 2 - 30;
        this.moveAre.height = moveAre.height / 2 - gameData.fishSKeHeight / 2;


        //设置属性
        let level = fishData.lv;
        this.spr.armatureName = `fish_0${level < 10 ? `0${level}` : level}`;
        this.speed = Math.floor(Math.random() * (60 - 30 + 1) + 30);

        //设置移动
        this.directionX = Math.random() * (Math.random() > 0.5 ? 1 : -1)
        this.directionY = Math.random() * (Math.random() > 0.5 ? 1 : -1);
        this.state = fishState.move;
        this.turned();
    }

    updateState() {
        if (this.state == fishState.move) {
            this.spr.animationName = "run";
        }
        else if (this.state == fishState.click) {
            this.spr.animationName = "click";
        }
        this.spr.playAnimation(this.spr.animationName)
    }

    turned() {
        let fishBone = this.spr.armature().getBone("fish");
        fishBone.offset.skew = this.directionX > 0 ? -1 * Math.PI : 0;
        fishBone.offset.rotation = this.directionX > 0 ? -1 * Math.PI : 0;
        this.spr.armature().getBone('no').offset.x = this.directionX > 0 ? -190 : 0;
        this.spr.playAnimation(this.spr.animationName)
    }

    update(dt: number) {
        if (this.state == fishState.move) {
            let x = this.node.position.x + dt * this.speed * this.directionX;
            let y = this.node.position.y + dt * this.speed * this.directionY;
            if (x < -this.moveAre.width || x > this.moveAre.width) {
                this.directionX = -this.directionX;
                x = this.node.position.x;
                this.turned();
            }
            if (y < -this.moveAre.height || y > this.moveAre.height) {
                y = this.node.position.y;
                this.directionY = -this.directionY;
            }
            this.node.setPosition(x, y);
        }
    }

    getId(){
        return this.fishData.id;
    }
}

