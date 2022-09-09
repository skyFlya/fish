import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('util')

export class util {
    private static instance: util = null;

    public static get Instance(): util {
        if (!util.instance) {
            util.instance = new util();
        }
        return util.instance;
    }

    //深度拷贝json对象的函数，
    //source：待拷贝对象
    //返回一个新的对象
    public deepCopy(source): any {
        let newObject: any;
        let isArray = false;
        if ((source as any).length) {
            newObject = [];
            isArray = true;
        } else {
            newObject = {};
            isArray = false;
        }

        for (let key of Object.keys(source)) {            
            if (null == source[key]) {
                if (isArray) {
                    newObject.push(null);
                } else {
                    newObject[key] = null;
                }
            } else {
                let sub = (typeof source[key] == 'object') ? this.deepCopy(source[key]) : source[key];
                if (isArray) {
                    newObject.push(sub);
                } else {
                    newObject[key] = sub;
                }
            }
        }
        return newObject;
    }
}
