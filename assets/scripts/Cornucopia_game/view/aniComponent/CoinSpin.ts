import { _decorator, Component, Node } from 'cc';
import { ActionEffect } from '../../../Cornucopia_common/effects/ActionEffect';
import { Sprite } from 'cc';
import { delay } from '../../../Cornucopia_common/utils/TimeUtil';
const { ccclass, property } = _decorator;

@ccclass('CoinSpin')
export class CoinSpin extends Component {
    @property(Number)
    public all = 13;s
    @property(Number)
    public oneTime = 0.02;
    start() {
        this.setIcon();
    }

    public set speed(s: number) {
        this.curTime = this.oneTime / s;
    }
    protected onLoad(): void {
        this.curTime = this.oneTime;
    }

    // private readonly all = 13;
    // private readonly oneTime = 0.02;
    private index: number = 1;
    private t: number = 0;
    private curTime: number = this.oneTime;
    public isStop:boolean = false;
 
    protected update(dt: number): void {
        if(this.isStop)return;
        this.t += dt;
        let n = 1;
        if (this.t >= this.curTime) {
            n = Math.round(this.t/this.curTime);
            this.t = 0;
            this.index += n;

            if (this.index > this.all) this.index = this.index % this.all;
            this.setIcon();
        }
    }
    private setIcon() {
        const sp = this.node.getComponent(Sprite);
        sp.spriteFrame = sp.spriteAtlas.getSpriteFrame((this.index).toString());
    }

}


