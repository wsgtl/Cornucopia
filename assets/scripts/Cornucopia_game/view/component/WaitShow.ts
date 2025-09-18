import { _decorator, Component, Node } from 'cc';
import { delay } from '../../../Cornucopia_common/utils/TimeUtil';
import { ActionEffect } from '../../../Cornucopia_common/effects/ActionEffect';
import { isVaild } from '../../../Cornucopia_common/utils/ViewUtil';
const { ccclass, property } = _decorator;

@ccclass('WaitShow')
export class WaitShow extends Component {
    @property(Number)
    time: number = 1.5;

    protected onLoad(): void {
        this.node.active = false;
        delay(this.time)
            .then(() => {
                if (!isVaild(this.node)) return;
                this.node.active = true;
                ActionEffect.fadeIn(this.node, 0.5);
            })
    }
}


