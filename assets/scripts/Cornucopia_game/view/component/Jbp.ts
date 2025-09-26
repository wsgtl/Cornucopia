import { instantiate } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { MathUtil } from '../../../Cornucopia_common/utils/MathUtil';
import { ActionEffect } from '../../../Cornucopia_common/effects/ActionEffect';
import { delay, tweenPromise } from '../../../Cornucopia_common/utils/TimeUtil';
import { CoinSpin } from '../aniComponent/CoinSpin';
import { v3 } from 'cc';
import { isVaild } from '../../../Cornucopia_common/utils/ViewUtil';
import { NodePool } from 'cc';
import { UIUtils } from '../../../Cornucopia_common/utils/UIUtils';
const { ccclass, property } = _decorator;

@ccclass('Jbp')
export class Jbp extends Component {
    @property(Node)
    icon: Node = null;
    @property(Node)
    coin: Node = null;
    @property(Node)
    launch: Node = null;
    private status: number = 0;
    protected onLoad(): void {
        this.pool = new NodePool();
    }
    aniNormal() {
        this.status = 1;
        this.icon.scale = v3(1, 1, 1);
    }
    /**免费游戏动画 */
    aniFreeGame() {
        this.status = 2;
        this.jbpAni();
    }
    private pool: NodePool;
    private readonly oneTime = 0.15;
    private t = 0;
    update(deltaTime: number) {
        if (this.status == 1) {
            this.t += deltaTime;
            if (this.t >= this.oneTime) {
                this.t = 0;
                const c = this.createCoin();
                c.x = MathUtil.random(-150, 150);
                c.y = MathUtil.random(500, 600);
                ActionEffect.moveTo(c, 0.7, c.x, MathUtil.random(0, 30));
                ActionEffect.fadeIn(c, 0.05).then(async () => {
                    await delay(0.6);
                    c.getComponent(CoinSpin).isStop = true;
                    await ActionEffect.fadeOut(c, 0.15);
                    // c.destroy();
                    this.pool.put(c);
                })

            }
        }
    }
    private createCoin() {
        let c = this.pool.get();
        if (!c)
            c = instantiate(this.coin);
        c.active = true;
        this.launch.addChild(c);
        c.angle = MathUtil.random(-180, 180);
        UIUtils.setAlpha(c,1);
        c.getComponent(CoinSpin).isStop = false;
        return c;
    }

    private async jbpAni() {
        if (this.status != 2) return;
        await tweenPromise(this.icon, t => t.to(0.2, { scale: v3(1.1, 0.9) }, { easing: "backOut" }).to(0.2, { scale: v3(1, 1) }, { easing: "backOut" }))

        for (let i = 0; i < 50; i++) {
            this.iconFly(i * 0.01);
        }
        if (this.status != 2) return;
        const s = this.pool.size();
        await tweenPromise(this.icon, t => t
            .to(0.05, { scale: v3(1.015, 0.985) }, { easing: "backOut" }).to(0.05, { scale: v3(1, 1) }, { easing: "backOut" })
            .to(0.05, { scale: v3(1.015, 0.985) }, { easing: "backOut" }).to(0.05, { scale: v3(1, 1) }, { easing: "backOut" })
            .to(0.05, { scale: v3(1.015, 0.985) }, { easing: "backOut" }).to(0.05, { scale: v3(1, 1) }, { easing: "backOut" })
            .to(0.05, { scale: v3(1.015, 0.985) }, { easing: "backOut" }).to(0.05, { scale: v3(1, 1) }, { easing: "backOut" })
            .delay(0.3)
        )

        this.jbpAni();
    }
    private async iconFly(t: number) {
        await delay(t);
        if (this.status != 2) return;
        const cy = MathUtil.random(200, 700);
        const ic = this.createCoin();
        const fx = MathUtil.randomOne();
        ic.x = fx * MathUtil.random(0, 120);
        ic.y = 0;
        const baseH = 400;
        const end = v3(fx * MathUtil.random(400, 550), - MathUtil.random(300, 400));
        const duration = MathUtil.random(7, 10) / 10;
        ActionEffect.angle(ic, fx * MathUtil.random(300, 600), duration);
        delay(duration - 0.1).then(() => {
            ActionEffect.fadeOut(ic, 0.1);
        })
        // await ActionEffect.bezier3To(ic, v3(0, baseH + 200), v3(fx * 400, baseH + 200), end, duration);
        await ActionEffect.bezier3To(ic, v3(0, cy), v3(fx * 400, cy), end, duration);
        this.pool.put(ic);
        // if (isVaild(ic))
        //     ic?.destroy();

    }
    protected onDestroy(): void {
        this.pool.clear();
    }
}


