import { sys } from "cc";

export enum ITEM_STORAGE {
    LANGUAGE = "Cornucopia_Lang",
    AUDIO = "Cornucopia_audio",
    EventTracking = "Cornucopia_event",
    EventTrackings = "Cornucopia_events",
    Game = "Cornucopia_game",
    JACKPOT = "Cornucopia_jackpot",
    WAITWITHDRWW = "Cornucopia_waitwithdraw",
    WAITWITHDRWWS = "Cornucopia_waitwithdraws",
    AbTest = "Match3_ab_test",
    WebConfig = "Match3_web_config",
}

/**
 * 可以移除的缓存
 */
export enum REMOVE_ITEM_STORAGE {
    ACCOUNT_TOKEN = "account_token",
    USER_HAS_EXIT_GAME = "user_has_exit_game",
}

export namespace BaseStorageNS {
    /**
     * 获取缓存
     * @param itemName
     */
    export function getItem(itemName: ITEM_STORAGE | string): string | null {
        return sys.localStorage.getItem(itemName);
    }

    /**
     * 设置缓存
     * @param itemName
     * @param value
     */
    export function setItem(
        itemName: ITEM_STORAGE | string,
        value: string | number
    ): void {
        sys.localStorage.setItem(itemName, String(value));
    }

    /**
     * 移除缓存
     * @param item
     */
    export function removeLocalStorageItem(item: string) {
        sys.localStorage.removeItem(item);
    }

    /**
     * 批量清楚缓存
     */
    export function clear() { }
}
