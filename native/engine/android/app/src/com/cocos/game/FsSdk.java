 package com.cocos.game;

 import static com.google.android.gms.common.util.CollectionUtils.listOf;
 import static com.unity3d.services.core.properties.ClientProperties.getApplication;

 import android.app.Activity;
 import android.content.Context;
 import android.util.Log;


 import com.FSMcGkXTYIYCZQSDKutil.ADInterListener;
 import com.FSMcGkXTYIYCZQSDKutil.ADRewardListener;
 import com.FSMcGkXTYIYCZQSDKutil.FSMcGkXTYIYCZQSDKConfigUtil;
 import com.FSMcGkXTYIYCZQSDKutil.FSMcGkXTYIYCZQSDKCoreMgr;
 import com.cocos.lib.JsbBridgeWrapper;


 public class FsSdk {
     private Activity _activity;
     private String Tag = "FsSdk";
     public void init(Activity activity){
         Log.e(Tag,"初始化");
         this._activity = activity;
         this.bindEvent();

         //正式参数
         FSMcGkXTYIYCZQSDKConfigUtil.getInstance()
                 .SetAppKey("45D51A933C174B8DA6F7A218696A97A7")              //appkey
                 .SetAppSecret("F6E7F7AE349547F28E0B04A5D6FFD3A3")           //appsecret
                 .SetUrl("https://slb.magicfrenzy.xyz/")                 //配置域名
                 .SetAfDevKey("SEwyhnfvnCkZaRwWKZHtQD")            //appsflyer
                 .SetMaxSdkKey("LHx_tPFslZpTTiIPABmS24T7Ev1QEVOUVOzirpkxLUuTwJTVZGCKAk9L3Tm3FwuM5LxHK3q1EIbAemJB5sNpX2")           //max sdk ket
                 .SetSplashUnitId("")        //max开屏ID
                 .SetVideoUnitId("c058a52ecae62f48")         //max视频ID
                 .SetInterUnitId("5cd98f42660674dc")         //max插屏ID
                 .SetBigoAppId("11597832")           //bigo appId
                 .SetBigoVideoId(listOf("11597832-11383243")) //bigo 激励
                 .SetBigoInterId(listOf("11597832-11130267")) //bigo 插屏
                 .SetBigoSplashId("")        //bigo开屏ID
                 .SetKwaiAppId("804378")           //kwai appId
                 .SetKwaiVideoId(listOf("8043786001")) //kwai视频ID
                 .SetKwaiInterId(listOf("8043786002")) //kwai插屏ID
                 .SetDebug(true)             //debug模式
                 .SetIsPrintLog(true);        //打印日志

         //测试参数
//         FSMcGkXTYIYCZQSDKConfigUtil.getInstance()
//                 .SetAppKey("83358DCFFE77424DA653B7FB8EF1C05E")              //appkey
//                 .SetAppSecret("9EC480ED914D46BC9B37E1E28DC694FE")           //appsecret
//                 .SetUrl("https://jpg.jasmgaming.com/")                 //配置域名
//                 .SetAfDevKey("oJZmXRabwheRrDnjt3AgFV")            //appsflyer
//                 .SetMaxSdkKey("LHx_tPFslZpTTiIPABmS24T7Ev1QEVOUVOzirpkxLUuTwJTVZGCKAk9L3Tm3FwuM5LxHK3q1EIbAemJB5sNpX2")           //max sdk ket
//                 .SetSplashUnitId("")        //max开屏ID
//                 .SetVideoUnitId("9e66ac003627d240")         //max视频ID
//                 .SetInterUnitId("b6c4f0d32497b901")         //max插屏ID
//                 .SetBigoAppId("10182906")           //bigo appId
//                 .SetBigoVideoId(listOf("10182906-10001431")) //bigo 激励
//                 .SetBigoInterId(listOf("10182906-10158798")) //bigo 插屏
//                 .SetBigoSplashId("")        //bigo开屏ID
//                 .SetKwaiAppId("899999")           //kwai appId
//                 .SetKwaiVideoId(listOf("8999996001")) //kwai视频ID
//                 .SetKwaiInterId(listOf("8999996002")) //kwai插屏ID
//                 .SetDebug(true)             //debug模式
//                 .SetIsPrintLog(true);        //打印日志

         /**
          * 注册ab事件
          * @param abParamCall 回调函数 0 为自然量用户 1 为渠道用户
          */
//         FSMcGkXTYIYCZQSDKCoreMgr.registAbParam(Consumer<Integer> abParamCall);
         /**
          * 初始化
          * @param activity activity
          * @param application application
          * @param configKey 后台配置下发的key，如果没有填空
          * @param callback 后台配置下发回调
          */
         FSMcGkXTYIYCZQSDKCoreMgr.init(this._activity, getApplication(), null, null );
     }
     private  void bindEvent(){
         JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();

         jbw.addScriptEventListener("loadRewardVideo",this::createRewardedAd);
         jbw.addScriptEventListener("showRewardVideo",this::showRewardAd);

         jbw.addScriptEventListener("loadInterstitial",this::createInterstitialAd);
         jbw.addScriptEventListener("showInterstitial",this::showInterstitialAd);


     }

     //插屏广告
     private ADInterListener interListener;
     /**创建加载插屏广告*/
     void createInterstitialAd(String str) {
         Log.e(Tag,"创建插屏广告");
         interListener = new ADInterListener() {
             @Override
             public void onFailed() {
                 gameResume();
                 Log.d(Tag, "main inter onFailed!!!");
             }

             @Override
             public void onHide() {
                 gameResume();
                 Log.d(Tag, "main inter onHide!!!");
             }
             @Override
             public void onDisplayed() {
                 gamePause();
                 Log.d(Tag, "main inter onDisplayed!!!");
             }
             @Override
             public void onClick() {
                 Log.d(Tag, "main inter onClick!!!");
             }
         };

     }
     /**显示插屏广告*/
     void showInterstitialAd(String str){
         AppsFlyer.setCurrentAdInfo(str,"AdInterstitial");
        AppsFlyer.getInstance().sendAdClickedEvent(AppsFlyer.getCurrentAdPlacement(),AppsFlyer.getCurrentAdType());
         if ( FSMcGkXTYIYCZQSDKCoreMgr.isInterReady() ) {
             // `this` is the activity that will be used to show the ad
             FSMcGkXTYIYCZQSDKCoreMgr.showInter(str, interListener);
         }else{

             Log.e(Tag,"未加载成功插屏广告");
         }
     }

     //激励广告
     private ADRewardListener rewardListener;
     /**创建加载激励广告*/
     void createRewardedAd(String str) {
         JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
         Log.e(Tag,"创建激励广告");
          rewardListener = new ADRewardListener() {
             @Override
             public void onFailed() {
                 jbw.dispatchEventToScript("getRewardVideoFail","0");
                 Log.d(Tag, "main reward onFailed!!!");
             }

             @Override
             public void onReward() {
                 gameResume();
                 jbw.dispatchEventToScript("getRewardVideo");
                 Log.d(Tag, "main reward onReward!!!");
             }
             @Override
             public void onDisplayed() {
                 gamePause();
                 Log.d(Tag, "main reward onDisplayed!!!");
             }
             @Override
             public void onClick() {
                 Log.d(Tag, "main reward onClick!!!");
             }@Override
             public void onHide() {
                 gameResume();
                 Log.d(Tag, "main reward onHide!!!");
             }
         };
     }
     /**显示激励广告*/
     void showRewardAd(String str){
        AppsFlyer.setCurrentAdInfo(str,"AdRewardVideo");
        AppsFlyer.getInstance().sendAdClickedEvent(AppsFlyer.getCurrentAdPlacement(),AppsFlyer.getCurrentAdType());
         JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
         if ( FSMcGkXTYIYCZQSDKCoreMgr.isRewardReady() ) {
             // `this` is the activity that will be used to show the ad
             FSMcGkXTYIYCZQSDKCoreMgr.showReward(str, rewardListener);
         }else {

             Log.e(Tag,"未加载成功激励广告");
             jbw.dispatchEventToScript("getRewardVideoFail","2");
             gameResume();
         }
     }

     /**游戏暂停*/
     void gamePause(){
         JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
         jbw.dispatchEventToScript("gamePause");
     }
     /**游戏恢复*/
     void gameResume(){
         JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
         jbw.dispatchEventToScript("gameResume");
     }
 }
