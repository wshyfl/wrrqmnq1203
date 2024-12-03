
var LabelUtils2 = require("LabelUtils2");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {

        this.chanelName1 = AD.chanelName1;
        this.chanelName = AD.chanelName;

        if (this.chanelName1 == "android") {
            return
        }

        cc.game.addPersistRootNode(this.node);

        switch (this.chanelName1) {
            case "WX":
                this.yuanShengSecond = 0;
                this.schedule(function () {
                    if (AD_WX.yuanShengIsOk == false) {
                        AD_WX.showYuanSheng();
                        this.yuanShengSecond = 0;
                    }
                    else {
                        this.yuanShengSecond++;
                        if (this.yuanShengSecond == 30) {
                            AD_WX.hideYuanSheng();
                        }
                    }
                }, 1);
                break;
            case "huaWei":
                cc.game.on(cc.game.EVENT_HIDE, event => {
                    console.log("------------>后台了");
                }, this);
                cc.game.on(cc.game.EVENT_SHOW, event => {
                    console.log("------------>前台了,开始上报");
                    cc.director.emit("chaPingReportAdShow");
                }, this);
                break;
        }

        //获取开关
        if (this.chanelName == this.chanelName1) {
            this.getSwitchKey();
            if (this.key == "" || this.switch == "") {
                // console.warn("传入的可以有问题  this.key:  " + this.key + "   this.switch: " + this.switch)
                return;
            }
            cc.director.once("服务器获取完毕", (_switchOn) => {
                // console.log("服务器获取完毕  " + _switchOn);

                if (_switchOn)
                    this.switchOn();
                cc.director.emit("服务器获取完毕1", _switchOn)
            }, this);
            LabelUtils2.getInstance().initLabel(this.key);
            LabelUtils2.getInstance().getLabel(this.switch);
        }


    },

    getSwitchKey() {
        switch (this.chanelName1) {
            case "touTiao":  //
                this.key = "";
                this.switch = "switch";
                break;
            case "oppo":  //OPPO
                this.key = "com.wrrqmnq.oppo0617";
                this.switch = "switch";
                break;
            case "vivo":  //vivo 
                this.key = "com.wrrqmnq.vivo0517";
                this.switch = "switch";
                break;
            case "huaWei":  //华为 
                this.key = "";
                this.switch = "switch";
                break;
            case "QQ":  //QQ
                AD_QQ.initQQ();
                this.key = "";
                this.switch = "switch";
                break;
            case "WX":  //WX
                this.key = "";
                this.switch = "switch";
                break;
        }
    },

    switchOn() {
        switch (this.chanelName1) {
            case "vivo":
                AD_vivo.switchOn()
                break;
            case "oppo":
                AD_oppo.switchOn();
                break;
            case "huaWei":
                AD_HuaWei.switchOn();
                break;
            default:
                AD.wuDianRate = 1;//自点击概率
                break;
        }
    },
    // update (dt) {},
});

