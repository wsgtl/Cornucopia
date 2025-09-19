import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Cornucopia_common/ui/ViewComponent';
import { ViewManager } from '../../manager/ViewManger';
import { NumFont } from '../../../Cornucopia_common/ui/NumFont';
import { Progress } from '../component/Progress';
import { adHelper } from '../../../Cornucopia_common/native/AdHelper';
import { Label } from 'cc';
import { delay, nextFrame } from '../../../Cornucopia_common/utils/TimeUtil';
import { GuideManger } from '../../manager/GuideManager';
import { sys } from 'cc';
import { game } from 'cc';
import { Game } from 'cc';
import { MathUtil } from '../../../Cornucopia_common/utils/MathUtil';
import { view } from 'cc';
import { UIUtils } from '../../../Cornucopia_common/utils/UIUtils';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends ViewComponent {
    @property(Node)
    bg: Node = null;
    @property(Node)
    logo: Node = null;
    @property(Progress)
    progress: Progress = null;
    @property(NumFont)
    num: NumFont = null;
    @property(Label)
    loading: Label = null;
    @property(Node)
    qq: Node = null;

    async showProgress() {
        const all = sys.platform === sys.Platform.ANDROID ? 150 : 30;
        for (let i = 0; i <= all; i++) {
            this.progress.progress = i / all;
            const num = Math.floor(i / all * 100);
            if (this.qq) this.qq.angle -= 10;
            if (this.num) this.num.num = num + "%";
            if (this.loading) this.loading.string = "Loading... " + num + "%";
            if (i == all) {
                this.scheduleOnce(() => {
                    // ViewManager.showHome();
                    ViewManager.showGameView();
                }, 0.2);
            }
            await delay(0.03);
        }
    }
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.showProgress();
        adHelper.init();
        game.on(Game.EVENT_SHOW, () => {
            if (MathUtil.probability(0.9)) return;
            adHelper.showInterstitial("回前台显示插屏广告");
            console.log("回前台显示插屏广告");
        })
    }
    fit() {
        const h = view.getVisibleSize().y;
        if (h > 2390) {
            UIUtils.setHeight(this.bg, h);
        }
        const cha = (h - 1920) / 2;
        this.logo.y = MathUtil.mm(645 + cha, 645, 790);
    }
}


