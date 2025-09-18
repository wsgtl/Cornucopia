import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Cornucopia_common/ui/DialogComtnet';
import { Button } from 'cc';
import { adHelper } from '../../../Cornucopia_common/native/AdHelper';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { EnergyManger } from '../../manager/EnergyManager';
import { GameStorage } from '../../GameStorage_Cornucopia';
import { RewardType } from '../../GameUtil_Cornucopia';
import { i18n } from '../../../Cornucopia_common/i18n/I18nManager';
const { ccclass, property } = _decorator;

@ccclass('EnergyDialog')
export class EnergyDialog extends DialogComponent {
    @property(Node)
    btnGet: Node = null;
    @property(Node)
    btnNt: Node = null;
    private cb: Function;
    show(parent: Node, args?: any): void {
        super.show(parent);
        this.cb = args.cb;

        this.btnGet.on(Button.EventType.CLICK, () => {
            if(GameStorage.getEnergy().energy >=EnergyManger.max){
                ViewManager.showTips(i18n.string("str_teif"));
                return;
            }
            adHelper.showRewardVideo("加体力窗口", () => {
                
                ViewManager.showRewardParticle(RewardType.energy,this.node,EnergyManger.getEnergyNode(),()=>{
                    EnergyManger.maxEnergy();
                    this.cb?.(); 
                })            
                this.closeAni();
            }, ViewManager.adNotReady);
        }

        )
        this.btnNt.on(Button.EventType.CLICK, () => {
            this.closeAni();
            this.cb?.(); 
            adHelper.timesToShowInterstitial();
        })
        AudioManager.playEffect("light");
    }
}


