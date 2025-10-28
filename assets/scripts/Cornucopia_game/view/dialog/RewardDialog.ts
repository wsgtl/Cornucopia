import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Cornucopia_common/ui/DialogComtnet';
import { SpriteFrame } from 'cc';
import { NumFont } from '../../../Cornucopia_common/ui/NumFont';
import { Sprite } from 'cc';
import { GameUtil, RewardType } from '../../GameUtil_Cornucopia';
import { MathUtil } from '../../../Cornucopia_common/utils/MathUtil';
import { Button } from 'cc';
import { adHelper } from '../../../Cornucopia_common/native/AdHelper';
import { GameStorage } from '../../GameStorage_Cornucopia';
import { CoinManger } from '../../manager/CoinManger';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { delay } from '../../../Cornucopia_common/utils/TimeUtil';
import { ActionEffect } from '../../../Cornucopia_common/effects/ActionEffect';
import { isVaild } from '../../../Cornucopia_common/utils/ViewUtil';
import { Vec3 } from 'cc';
import { UIUtils } from '../../../Cornucopia_common/utils/UIUtils';
import { GuideManger } from '../../manager/GuideManager';
import { Money } from '../component/Money';
import { LangStorage } from '../../../Cornucopia_common/localStorage/LangStorage';
import { FormatUtil } from '../../../Cornucopia_common/utils/FormatUtil';
import { WithdrawUtil } from '../withdraw/WithdrawUtil';
import { EventTracking } from '../../../Cornucopia_common/native/EventTracking';
const { ccclass, property } = _decorator;

@ccclass('RewardDialog')
export class RewardDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    sp: Node = null;
    @property(NumFont)
    num: NumFont = null;
    @property(NumFont)
    btnNum: NumFont = null;


    type: RewardType;
    cb: Function;
    private rewardNum: number = 1;//奖励数量
    private rewardNumAd: number = 1;//广告奖励数量
    // private reciveNum: number = 2;//看广告领取倍率
    private isFree: boolean = false;
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.init();
        this.cb = args.cb;
    }
    init() {
        AudioManager.playEffect("reward", 2);
        // this.type = type;


        // this.showReciveNum(2);
        const data = LangStorage.getData();
        const isGuide = GuideManger.isGuide() && GameStorage.getMoney() < 5;
        // this.rewardNum = isGuide ? MoneyManger.instance.rate(GameUtil.GuideMoney) : MoneyManger.instance.getReward();
        this.rewardNum = MoneyManger.instance.getReward(WithdrawUtil.MoneyBls.RewardFree);
        this.rewardNumAd = MoneyManger.instance.getReward(WithdrawUtil.MoneyBls.RewardAd);
        this.num.aligning = 1;
        // this.num.num = data.symbol + " " + FormatUtil.toXXDXXxsd(this.rewardNum);
        // this.btnNum.num = data.symbol + " " + FormatUtil.toXXDXXxsd(this.rewardNum * this.reciveNum);
        this.num.num = FormatUtil.toMoney(this.rewardNum);
        // this.btnNum.num = FormatUtil.toMoney(this.rewardNum * this.reciveNum);
        this.btnNum.num = FormatUtil.toMoney(this.rewardNumAd);
        // this.showMoneyNode();

        this.btnClaim.once(Button.EventType.CLICK, this.onBtnClaim, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        const ft = GameStorage.getFreeTime();
        this.isFree = ft.money < 3;//前三次免费
        if (this.isFree) {
            ft.money += 1;
            GameStorage.setFreeTime(ft);
            this.btnClaim?.destroy();
        }
        this.sp.active = !this.isFree;

    }

    onBtnClaim() {
        this.closeAni();
        this.addReward(this.rewardNum);
        adHelper.timesToShowInterstitial();
        // if (GameStorage.getCurLevel() > 1) {//第二局后有概率弹插屏广告
        //     adHelper.timesToShowInterstitial();
        // }
    }
    onBtnReceive() {
        if (this.isFree) {
            this.addReward(this.rewardNumAd);
            this.closeAni();
            EventTracking.sendOneEvent("getMoney");
        } else {
            adHelper.showRewardVideo("钱奖励弹窗", () => {
                // this.addReward(this.rewardNum * this.reciveNum);
                this.addReward(this.rewardNumAd);
                this.closeAni();
            }, ViewManager.adNotReady)
        }

    }
    private addReward(num: number) {
        // ViewManager.showRewardAni(1, num, this.cb);
        const cb = this.cb;
        ViewManager.showRewardParticle(RewardType.money, this.node, MoneyManger.instance.getMoneyNode().moneyNode, () => {
            cb(num);
            MoneyManger.instance.addMoney(num, false);
        })
    }




}



