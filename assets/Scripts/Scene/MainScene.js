

cc.Class({
    extends: cc.Component,

    properties: {
        /** 主界面节点 */
        mainNode: cc.Node,
        /** 死亡图鉴节点 */
        deathNode: cc.Node,
        /** 结局图鉴节点 */
        endsNode: cc.Node,
        /** 正常模式节点 */
        normalModeNode: cc.Node,
        /** 恐惧模式节点 */
        hardModeNode: cc.Node,
        /** 提示节点 */
        tipNode: cc.Node,
        /** 广告视频按钮 */
        adNode: cc.Node,
    },

    onLoad() {
    },

    start() {
        // cc.audioEngine.stopAllEffects();
        // cc.audioEngine.stopMusic();
        cc.audioEngine.stopAll();
        //主界面
        Res.playSound("主界面bgm", true, true);

        //打开提示
        this.scheduleOnce(() => {
            this.tipNode.active = true;
            cc.tween(this.tipNode.children[1])
                .to(0.15, { scale: 1.1 })
                .to(0.1, { scale: 1 })
                .start();
        }, 0.5);

        if (GameData.userData.mode2Unlock) this.adNode.active = false;

        // console.log("AD.wuDianRate ===> " + AD.wuDianRate);
    },

    // update (dt) {},

    /** 关闭提示 */
    closeTip() {
        Res.playSound("点击", false, false);
        cc.tween(this.tipNode.children[1])
            .to(0.1, { scale: 1.1 })
            .to(0.15, { scale: 0 })
            .call(() => {
                this.tipNode.active = false;
            })
            .start();
    },

    /** 返回主界面 */
    backToMain() {
        Res.playSound("点击", false, false);
        this.mainNode.scale = 1;
        this.deathNode.scale = 0;
        this.normalModeNode.scale = 0;
        this.hardModeNode.scale = 0;
    },

    /** 打开死亡图鉴 */
    showDeath() {
        Res.playSound("点击", false, false);
        this.mainNode.scale = 0;
        this.deathNode.scale = 1;
        //刷新显示结局图鉴
        let ending = GameData.userData.ending;
        for (let i = 0; i < ending.length; i++) {
            if (ending[i] == 0) {
                this.endsNode.children[i].children[0].active = false;
            }
        }
        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing();
        }
    },

    /** 模式选择 */
    chooseMode(event, cData) {
        Res.playSound("点击", false, false);
        this.mainNode.scale = 0;
        this.normalModeNode.scale = 0;
        this.hardModeNode.scale = 0;
        if (cData == "正常模式") {
            this.normalModeNode.scale = 1;
            GameData.gameMode = 1;
        }
        else if (cData == "恐怖模式") {
            this.hardModeNode.scale = 1;
            GameData.gameMode = 2;
        }
        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing();
        }
    },

    /** 开始游戏 */
    startGame() {
        Res.playSound("点击", false, false);

        //困难模式检测解锁
        if (GameData.gameMode == 2 && this.adNode.active) {
            AD.showAD(() => {
                this.adNode.active = false;
                GameData.userData.mode2Unlock = true;
                GameData.saveUserData();
            }, this);
            return;
        }

        //检测新手
        if (GameData.userData.newPlayer) cc.director.loadScene("NewScene");
        else cc.director.loadScene("GameScene");
    },

});
