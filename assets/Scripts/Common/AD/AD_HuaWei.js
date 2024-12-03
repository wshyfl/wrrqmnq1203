


window.AD_HuaWei = {
    // //**正式 */
    // bannerID_ai: "q8q2jv6nqv",//矮benner 
    // videoID: "u62eiufeye",//视频 //  
    // chaPingNormalId: "o83wynympw", //插屏-普通
    // yuanShengId: "", //原生
    /**测试 */
    bannerID_ai: "testw6vs28auh3",//矮benner 
    videoID: "testx9dtjwj8hp",//视频 //  
    chaPingNormalId: "testb4znbuh3n2", //插屏-普通
    yuanShengId: "", //原生

    phone: "null",

    videoBoo: false, //预加载是否成功
    videoNum: 0, //预加载次数

    
    
    
    
    
    
    rewardedVideoAdBoo: false,
    bannerAd: null,
    bannerLoadSucess: false,    
    couldShowAD: false,//可以触发广告了吗?(同意隐私协议后  变为true)
    firstChaPing: true,
    chaPingSecond: 0,
    bannerDurationTemp: 0,
    bannerDuration: 60,
    chaPingDurationNew:60,
    switchOn(){
        AD_HuaWei.chaPingDurationNew = 10;
        AD_HuaWei.bannerDuration = 3;
    },
    /**小程序启动参数*/
    getLaunchOptionsSync() {
        if (AD.chanelName != AD.chanelName1)
            return;
        // AD_HuaWei.chanPing();



    },
    /**插屏 */
    chaPing(...banner) {
        if (!this.couldShowAD) return;
        if (this.firstChaPing) {
            this.firstChaPing = false;
            console.log("进入计时器*********************")
            setInterval(() => {
                AD_HuaWei.chaPingSecond++;
                // console.log("AD_HuaWei.chaPingSecond********************* " +AD_HuaWei.chaPingSecond)
            }, 1000);
        }
        if (AD.chanelName != AD.chanelName1)
            return;
        if (AD_HuaWei.chaPingSecond < AD_HuaWei.chaPingDurationNew) {
            this.showBanner();
            console.log("插屏时间是00000000000*******************  " + AD_HuaWei.chaPingSecond +' this.chaPingDurationNew ' +AD_HuaWei.chaPingDurationNew)
        }
        else {
            //  cc.director.emit("加载数据");//原生插屏
            this.chaPingNormal();//普通插屏
            console.log("插屏时间是11111111111111*******************  " + AD_HuaWei.chaPingSecond +' this.chaPingDurationNew ' +AD_HuaWei.chaPingDurationNew)
        }


    },
    chaPingNormal() {

        let interstitialAd = qg.createInterstitialAd({
            adUnitId: AD_HuaWei.chaPingNormalId
        })
        interstitialAd.load();
        interstitialAd.onLoad(function (data) {
            // console.log('onLoad data ' + JSON.stringify(data));
            interstitialAd.show();

            AD_HuaWei.hideBanner();
        });
        interstitialAd.onClose(() => {
            AD_HuaWei.chaPingSecond = 0;
        })
        interstitialAd.onError((err) => {
            console.log("插屏错误 :  " + JSON.stringify(err))
        })
    },
    loadData() {

        
    },
    /**视频 
     * @method ： 成功方法
     * @method1 ：失败方法
     * @caller ：作用域
     * @data ：参数
     * */
    shiPin() {

        
        if (AD_HuaWei.rewardedVideoAdBoo) return;
        setTimeout(() => {
            AD_HuaWei.rewardedVideoAdBoo = false;
        }, 1000)
        // console.log("视频广告111111");
        AD_HuaWei.rewardedVideoAdBoo = true;
        if (AD_HuaWei.videoBoo == true) {
            // console.log("视频广告2222222");
            AD_HuaWei.rewardedVideoAd.show();
        } else {
            AD_HuaWei.yuShowVivoVideo();
            // console.log("视频广告33333333");

        }



    },
    /**视频预加载 */
    yuShowVivoVideo() {
        if (AD.chanelName != AD.chanelName1)
            return;
        AD_HuaWei.rewardedVideoAd = qg.createRewardedVideoAd({

            adUnitId: AD_HuaWei.videoID,
            success: (code) => {
                
                AD_HuaWei.rewardedVideoAd.load();
                AD_HuaWei.rewardedVideoAd.onLoad(() => {
                    console.log('AD --视频 加载成功')

                    if (!AD_HuaWei.videoBoo) {
                        AD_HuaWei.videoBoo = true;
                        // D_HuaWei.showVideo();
                        AD_HuaWei.rewardedVideoAd.show();
                    }
                });
                AD_HuaWei.rewardedVideoAd.onError((e) => {
                    AD_HuaWei.rewardedVideoAdBoo = false;
                    console.error('load AD error + 加载失败:' + JSON.stringify(e));

                    AD_HuaWei.videoNum++;
                    if (AD_HuaWei.videoNum < 2 && AD_HuaWei.videoBoo == false) {
                        AD_HuaWei.rewardedVideoAd.load();
                    }
                    else{
                        AD_HuaWei.rewardedVideoAd.destroy();
                        AD_HuaWei.videoBoo = false;
                    }

                });


                AD_HuaWei.rewardedVideoAd.onClose((res) => { //关闭监听
                    console.log("进入关闭监听。。。。。。。 " + res.isEnded);
                    AD_HuaWei.rewardedVideoAdBoo = false;
                    if (res.isEnded) {
                        console.log('AD --视频 播放完成，领取奖励');
                        AD.reward();
                        // cc.director.emit("视频奖励")
                    } else {
                        console.log('AD --视频 播放未完成，失败');

                    }
                    AD_HuaWei.rewardedVideoAd.load();
                })
            },
            fail: (data, code) => {
                qa.showToast({
                    title: '广告正在加载中,请稍后',
                    icon: 'loading',
                    duration: 3000
                })
                AD_HuaWei.rewardedVideoAdBoo = false;
                console.log("AD demo : loadAndShowVideoAd createRewardedVideoAd fail: " + data + "," + code);
            },
            complete: () => {
                console.log("AD demo : loadAndShowVideoAd createRewardedVideoAd complete");
            }
        });
    },

    initBanner() {
        if (AD.chanelName != AD.chanelName1)
            return;


        //广告
        const {
            screenHeight,
            screenWidth,
            windowHeight,
            pixelRatio,
            safeArea,
        } = qg.getSystemInfoSync();



        AD_HuaWei.bannerAd = qg.createBannerAd({
            adUnitId: AD_HuaWei.bannerID_ai, //正式
            style: {
                // top:screenHeight / pixelRatio - 100,
                top: safeArea.height - 60,
                left: 0,
                height: 57,
                width: 360
            }
        })
        AD_HuaWei.bannerAd.onError(err => {
            console.log('bannerAd 广告加载出错*************************************************************', JSON.stringify(err));
            AD_HuaWei.bannerAd.offError();
        });
        AD_HuaWei.bannerAd.onLoad(() => {

            AD_HuaWei.bannerLoadSucess = true;
            AD_HuaWei.bannerAd.offLoad();
        });
        AD_HuaWei.bannerAd.onClose(() => {

            AD_HuaWei.bannerAd.offClose();

        });
    },
    /**显示banner */
    showBanner() {

        console.log("this.bannerDurationTemp " +this.bannerDurationTemp)
        if (this.bannerDurationTemp > 0) return;
        this.bannerDurationTemp = 1;
        setTimeout(() => {
            this.bannerDurationTemp = 0;
        }, this.bannerDuration * 1000);

        if (!this.couldShowAD) return;
        if (AD.chanelName != AD.chanelName1)
            return;
            


        if (!AD_HuaWei.bannerLoadSucess) {
            AD_HuaWei.initBanner();
            setTimeout(() => {
                AD_HuaWei.bannerAd.show();
            }, 100)
        }
        else {
            AD_HuaWei.bannerAd.show()
        }


    },
    /**隐藏banner */
    hideBanner() {
        if (AD.chanelName != AD.chanelName1)
            return;
        if (AD_HuaWei.bannerLoadSucess) {
            AD_HuaWei.bannerAd.hide();
            
        }


    },
    /**分享 */
    shareOver() {//
        if (AD.chanelName != AD.chanelName1)
            return;
    },
    /**添加到收藏 */
    addCollection() {
        if (AD.chanelName != AD.chanelName1)
            return;
    },
    /**添加到桌面 */
    addDesktop() {
        // if (globalData_taiQiu.showAddToDesk) return;
        // globalData_taiQiu.showAddToDesk = true;
        if (AD.chanelName != AD.chanelName1)
            return;
        qg.hasShortcutInstalled({
            success: function (ret) {
                console.log('hasInstalled success ret---' + ret);
                if (ret) {
                    // 桌面图标已创建    
                } else {
                    // 桌面图标未创建
                    qg.installShortcut({
                        message: '将快捷方式添加到桌面以便下次使用',
                        success: function (ret) {
                            console.log('handling createShortCut success');
                        },
                        fail: function (erromsg, errocode) {
                            console.log('handling createShortCut fail');
                        }.bind(this),
                    })
                }
            }.bind(this),
            fail: function (erromsg, errocode) {
                console.log('hasInstalled fail ret---' + erromsg);
            }.bind(this),
            complete: function () {
            }
        })
    },
    /**添加到小程序 */
    addShowFavoriteGuide() {

    },
    /**自定义事件 */
    TDEvent(_type, level) {
    },

}