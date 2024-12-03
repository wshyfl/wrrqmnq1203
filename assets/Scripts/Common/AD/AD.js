window.AD = {
    chanelName: "oppo2",
    chanelName1: "oppo1",//android touTiao  vivo oppo huaWei QQ uc WX 4399Box BD
    wuDianRate: 0,


    showAD(_caller, _call, ...data) {
        if (_call) {
            console.log("激励视频广告:  " + _call.name)
        }
        this.callN = _call;
        this.callerN = _caller;
        this.dataN = data;

        if (this.chanelName != this.chanelName1)//广告不可用  直接成功
            this.reward();
        else
            this.shiPin();
    },
    //视频广告播放完毕/成功的回调
    reward() {
        setTimeout(() => {
            if (AD.callN && AD.callerN) {
                AD.callerN.call(AD.callN, this.dataN);
            }
        }, 100);
    },
    shiPin() {
        switch (this.chanelName) {
            case "android":
                AD_android.shiPin();
                break;
            case "touTiao":
                AD_TouTiao.shiPin();
                break;
            case "vivo":
                AD_vivo.shiPin();
                break;
            case "oppo":
                AD_oppo.shiPin();
                break;
            case "huaWei":
                AD_HuaWei.shiPin();
                break;
            case "QQ":
                AD_QQ.shiPin();
                break;
            case "uc":
                AD_UC.shiPin();
                break;
            case "WX":
                AD_WX.shiPin();
                break;
            case "4399":
                AD_4399.shiPin();
                break;
            case "4399Box":
                AD_4399Box.shiPin();
                break;
            case "BD":
                AD_BD.shiPin();
                break;
        }
    },
    //插屏
    chaPing(...show) {
        if (this.chanelName != this.chanelName1) return;
        switch (this.chanelName) {
            case "android":
                AD_android.chaPing();
                break;
            case "touTiao":
                AD_TouTiao.chaPing();
                break;
            case "vivo":
                if (AD.wuDianRate > 0 && window.isPingBi == false)
                    AD_vivo.chaPing();
                else {
                    console.log("AD.wuDianRate  " + AD.wuDianRate + " window.isPingBi " + window.isPingBi);
                    // if (AD.wuDianRate > 0)
                    if (show[0] && window.isPingBi == false) AD_vivo.chaPing();
                }
                break;
            case "oppo":
                if (window.isPingBi == false)
                    AD_oppo.chaPing();
                break;
            case "huaWei":
                AD_HuaWei.chaPing();
                break;
            case "QQ":
                AD_QQ.chaPing();
                break;
            case "uc":
                AD_UC.chaPing();
                break;
            case "WX":
                AD_WX.chaPing();
                break;
        }
    },
    //显示banner
    showBanner(...placeName) {
        if (this.chanelName != this.chanelName1) return;
        switch (this.chanelName) {
            case "android":
                AD_android.showBanner();
                break;
            case "touTiao":
                AD_TouTiao.showBanner();
                break;
            case "vivo":
                if (AD.wuDianRate > 0 && window.isPingBi == false)
                    AD_vivo.showBanner(placeName[0]);
                break;
            case "oppo":
                if (window.isPingBi == false)
                    AD_oppo.showBanner();
                break;
            case "huaWei":
                // AD_HuaWei.showBanner();
                AD_HuaWei.chaPing();
                break;
            case "QQ":
                AD_QQ.showBanner();
                break;
            case "uc":
                AD_UC.showBanner();
                break;
            case "WX":
                AD_WX.showBanner();
                break;
            case "4399Box":
                AD_4399Box.showBanner();
                break;
        }
    },
    //隐藏banner
    hideBanner() {


        if (this.chanelName != this.chanelName1) return;
        switch (this.chanelName) {
            case "android":
                AD_android.hideBanner();
                break;
            case "touTiao":
                AD_TouTiao.hideBanner();
                break;
            case "vivo":
                AD_vivo.hideBanner();
                break;
            case "huaWei":
                AD_HuaWei.hideBanner();
                break;
            case "QQ":
                AD_QQ.hideBanner();
                break;
            case "uc":
                AD_UC.hideBanner();
                break;
            case "WX":
                AD_WX.hideBanner();
                break;
            case "4399Box":
                AD_4399Box.hideBanner();
                break;
            case "oppo":
                if (window.isPingBi == false)
                    AD_oppo.hideBanner();
                break;
        }
    },
    moreGame() {
        switch (this.chanelName) {
            case "android":
                AD_android.moreGame();
                break;
            case "WX":
                AD_WX.shareAndCallback("");
                break;
            case "oppo":
                AD_oppo.showBox();
                break;
        }
    },
    gameOverTimes: 0,
    gameOver() {
        if (this.chanelName != this.chanelName1) return;
        this.gameOverTimes++;
        switch (this.chanelName) {
            case "android":
                AD_android.chaPingVideo();
                break;
            case "touTiao":

                break;
            case "vivo":
                break;
            case "oppo":
                break;
            case "huaWei":
                if (this.gameOverTimes % 2 == 0)
                    AD_HuaWei.addDesktop();
                break;
            case "QQ":
                if (AD.wuDianRate > 0)
                    this.showAD(null, null);
                // if (this.gameOverTimes % 3 == 0)
                //     AD_QQ.saveToDesktopQQ();
                break;
        }
    },

    addToDesk() {
        if (this.chanelName != this.chanelName1) return;
        switch (this.chanelName) {
            case "vivo":
                AD_vivo.addDesktop();
                break;
            case "huaWei":
                AD_HuaWei.addDesktop();
                break;
            case "QQ":
                AD_QQ.saveToDesktopQQ();
                break;
            case "oppo":
                AD_oppo.addDesktop();
                break;
            case "touTiao":
                AD_TouTiao.addDesktop();
                break;
        }
    },


    couldZDJ() {
        if (Tools.random(1, 100) < this.wuDianRate)
            return true;
        return false;
    },

    //是否是长屏手机
    isBigScreen() {
        console.log("是长屏吗  " + (cc.winSize.width / cc.winSize.height))
        if (cc.winSize.width / cc.winSize.height > 1.8) {
            return true;
        }
        return false;
    },
    switchZDJ() {
        AD.wuDianRate = 1;
    },
}