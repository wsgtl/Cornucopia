import './Cornucopia_common/Expand'
import { _decorator, Component, Node } from 'cc';
import { ViewManager } from './Cornucopia_game/manager/ViewManger';
import { GameStorage } from './Cornucopia_game/GameStorage_Cornucopia';
import { AudioSource } from 'cc';
import { AudioManager } from './Cornucopia_game/manager/AudioManager';
import { i18n } from './Cornucopia_common/i18n/I18nManager';
import { AudioStorage } from './Cornucopia_common/localStorage/AudioStorage';
import { LangStorage } from './Cornucopia_common/localStorage/LangStorage';
import { EnergyManger } from './Cornucopia_game/manager/EnergyManager';
import { JackpotManger } from './Cornucopia_game/manager/JackpotManager';
const { ccclass, property } = _decorator;

@ccclass('GameLaunch')
export class GameLaunch extends Component {
    @property(Node)
    mainNode:Node = null;
    @property(Node)
    upper:Node = null;
    @property(Node)
    lower:Node = null;
    @property(Node)
    toper:Node = null;
    @property(AudioSource)
    bgmNode:AudioSource = null;
    private static Instance: GameLaunch = null;

    start(): void {
        ViewManager.setMainSceneNode(this.mainNode,this.upper,this.lower,this.toper);
        ViewManager.showLoading();
        // ViewManager.showHome();
    }
    onLoad(): void {
        if (GameLaunch.Instance === null) {
            GameLaunch.Instance = this;
        } else {
            this.destroy();
            return;
        }

        GameStorage.init();
        LangStorage.init();
        AudioManager.setBgmNode(this.bgmNode);
        AudioStorage.init();
        JackpotManger.init();
        EnergyManger.calEnergy();
        i18n.loadLang();//加载多语言


    }

 


}


