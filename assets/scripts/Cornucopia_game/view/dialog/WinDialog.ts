import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Cornucopia_common/ui/DialogComtnet';
import { v3 } from 'cc';
import { ActionEffect } from '../../../Cornucopia_common/effects/ActionEffect';
import { NumFont } from '../../../Cornucopia_common/ui/NumFont';
import { AudioManager } from '../../manager/AudioManager';
import { sp } from 'cc';
import { isVaild } from '../../../Cornucopia_common/utils/ViewUtil';
import { adHelper } from '../../../Cornucopia_common/native/AdHelper';
import { FormatUtil } from '../../../Cornucopia_common/utils/FormatUtil';
import { MathUtil } from '../../../Cornucopia_common/utils/MathUtil';
import { Tween } from 'cc';
import { delay } from '../../../Cornucopia_common/utils/TimeUtil';
import { MoneyManger } from '../../manager/MoneyManger';
import { SpriteFrame, AudioSource, Button, instantiate, Sprite, tween } from 'cc';
import { EventTracking } from '../../../Cornucopia_common/native/EventTracking';
import { GameStorage } from '../../GameStorage_Cornucopia';
import { RewardData, RewardType } from '../../GameUtil_Cornucopia';
import { ViewManager } from '../../manager/ViewManger';
import { WithdrawUtil } from '../withdraw/WithdrawUtil';
import { ConfigConst } from '../../manager/ConfigConstManager';
const { ccclass, property } = _decorator;

@ccclass('WinDialog')
export class WinDialog extends DialogComponent {
    @property(NumFont)
    num: NumFont = null;
    @property(sp.Skeleton)
    sk: sp.Skeleton = null;
    @property([sp.SkeletonData])
    skdata: sp.SkeletonData[] = [];
    @property(Node)
    line: Node = null;
    @property(Node)
    btnGet: Node = null;
    @property(Node)
    btnNt: Node = null;
    @property(Node)
    sp: Node = null;
    @property(Node)
    item: Node = null;
    @property(Node)
    itemContent: Node = null;
    @property([SpriteFrame])
    sf: SpriteFrame[] = [];

    private static lastAniTime: number = 0;
    private rds: RewardData[] = [];
    private items: Node[] = [];
    start(): void {
        super.start();
        // AudioManager.playEffect("win");
        // this.bg.on(Node.EventType.TOUCH_START, () => {
        //     this.closeAni();
        // });
    }
    private coinNum: number = 0;
    async ani(num: number) {
        this.coinNum = num;
        // this.num.num = "";
        this.num.num = 0;

        // const times = Math.max(20, Math.floor((num / 45555) * 20));
        // ActionEffect.numAddAni(0, num, (n: number) => { this.setNum(n); }, true, times, this.num.node);
        ActionEffect.fadeIn(this.line, 0.4);//滑动奖励动画
        ActionEffect.scale(this.line, 0.3, 1, 0.5);
        ActionEffect.scale(this.line.getChildByName("lineContent"), 0.5, 1, 0, "backOut");

        this.numAni();
        await ActionEffect.skAniOnce(this.sk, "start", true);
        ActionEffect.skAni(this.sk, "loop");

    }
    private isStopGf: boolean = false;
    /**滚分动画 */
    private async numAni() {
        const end = this.coinNum;
        const start = 0;
        const all = MathUtil.mm(Math.floor((end / 125553) * 20), 25, 60);
        const item = (end - start) / all;
        for (let i = 1; i <= all; i++) {
            if (this.isClose) return;
            let cur = i == all ? end : start + i * item;
            cur = Math.floor(cur);
            this.setNum(cur);
            if (i != all) {
                await delay(0.05, this.num.node);
                if (this.isClose) return;
                AudioManager.playEffect("gf1", 0.3);
            }

        }
        AudioManager.playEffect("coin");
        this.isStopGf = true;
        // this.closeAni();
    }
    /**停止滚分 */
    private stopGf() {
        this.isStopGf = true;
        this.setNum(this.coinNum);
        Tween.stopAllByTarget(this.num.node);
        AudioManager.playEffect("coin");
    }
    /**关闭动画 */
    async closeAni() {
        if (this.isAni) return;
        this.isAni = true;
        this.isClose = true;
        if (!this.isStopGf) {
            // this.setNum(this.coinNum);
            // Tween.stopAllByTarget(this.num.node);
            // AudioManager.playEffect("coin");
            this.stopGf();
            await delay(0.7);
        }
        this.as?.stop();
        this.as?.destroy();
        ActionEffect.fadeOut(this.line, 0.5);//滑动奖励动画
        ActionEffect.scale(this.line.getChildByName("lineContent"), 0.5, 0.5, 1, "backIn");
        ActionEffect.scale(this.line, 0.2, 0, 1);

        
        AudioManager.playEffect("darts");
        await ActionEffect.skAniOnce(this.sk, "end", true);
        await ActionEffect.fadeOut(this.node, 0.2);
        this.node.destroy();
        this.closeCb?.();
        
        // if (MathUtil.probability(0.9)) {
        //     const cur = Date.now();
        //     const t = cur - WinDialog.lastAniTime;
        //     if (t > 180 * 1000) {//时间内不会重复弹
        //         adHelper.showInterstitial("大赢界面");
        //         WinDialog.lastAniTime = cur;
        //     }

        // }

    }
    private setNum(n: number) {
        if (this.num) this.num.num = FormatUtil.toXXDXX(n, 0);
    }
    private isFree: boolean = false;
    private as:AudioSource;
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.closeCb = args.cb;
        const type = args.type;
        // const type = MathUtil.random(1,2);
        this.sk.skeletonData = this.skdata[type - 1];
        AudioManager.playEffectOne(["bigwin","megawin"][type-1]).then(as=>{this.as = as})

        const path = ["root/all/all4/shengli_5/shengli_7", "root/all/x_001/x_005/x_030"][type - 1];
        const sockets = [new sp.SpineSocket(path, this.num.node.parent)];
        // this.sk.sockets.push(new sp.SpineSocket(path,this.num.node));//如果只是push(),就不会更新挂点
        this.sk.sockets = sockets;//必须整个挂点数组替换才能更新，如果只是push(),就不会更新挂点
        this.ani(args.num);

        const ft = GameStorage.getFreeTime();
        this.isFree = ft.win < 2;//前两次免费
        if (this.isFree) {
            ft.win += 1;
            GameStorage.setFreeTime(ft);
            this.btnNt?.destroy();
        }
        this.sp.active = !this.isFree;
        this.btnGet.on(Button.EventType.CLICK, () => {
            if (this.isAni) return;
            this.isAni = true;
            if (!this.isStopGf) {
                this.stopGf();
            }
            if (this.isFree) {
                EventTracking.sendOneEvent("bigwin");
                this.startDraw();
            } else {
                adHelper.showRewardVideo("大赢弹窗", () => { this.startDraw(); },
                    () => {
                        this.isAni = false;
                        ViewManager.adNotReady();
                    }
                );
            }

        })
        this.btnNt.on(Button.EventType.CLICK, () => {
            this.closeAni();
            adHelper.timesToShowInterstitial();
        })
        this.init();
    }

    init() {
        for (let i = 0; i < 6; i++) {
            const index = MathUtil.random(1, 3);
            const num = MoneyManger.instance.getReward(index / 3 * ConfigConst.MoneyBls.Win);
            const rd: RewardData = { type: RewardType.money, num };
            this.rds[i] = rd;
            const it = instantiate(this.item);
            this.itemContent.addChild(it);
            it.x = this.getX(i);
            it.getComponent(Sprite).spriteFrame = this.sf[index - 1];
            const itn = it.getChildByName("num").getComponent(NumFont);
            itn.aligning = 1;
            itn.num = "+" + FormatUtil.toXXDXX(num, 6, false);
            this.items[i] = it;
        }
        this.item.active = false;
    }
    private getX(i: number) {
        return (i - 2) * 216
    }
    private zzIndex: number = 2;
    /**开始抽奖 */
    private async startDraw() {
        const times = MathUtil.random(20, 25);
        const duration = 0.06;
        for (let i = 0; i < times; i++) {
            AudioManager.playEffect("jump");
            const a = this.items.shift();
            this.items.push(a);
            this.items.forEach((v, j) => {
                tween(v)
                    .by(duration, { x: -216 })
                    .call(() => { v.x = this.getX(j) })
                    .start();
            })
            await delay(duration);
        }

        const rd = this.rds[this.zzIndex];
        const it = this.items[this.zzIndex];

        AudioManager.playEffect("happy");
        await delay(0.7);
        AudioManager.playEffect("yb");
        await ActionEffect.scaleBigToSmall(it, 1.1, 1, 0.3);
        await ActionEffect.scaleBigToSmall(it, 1.1, 1, 0.3);
        await ActionEffect.scaleBigToSmall(it, 1.2, 0, 0.3);
        this.isAni = false;
        this.closeAni();
        const toNode = MoneyManger.instance.getMoneyNode().moneyNode;

        ViewManager.showRewardParticle(rd.type, it, toNode, () => {
            MoneyManger.instance.addMoney(rd.num, false);
        })
    }
}

