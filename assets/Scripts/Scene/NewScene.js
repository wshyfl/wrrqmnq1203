

cc.Class({
    extends: cc.Component,

    properties: {
        /** 房间节点 */
        roomsNode: cc.Node,
        /** 餐厅门动画 */
        doorSpine: sp.Skeleton,
        /** 转场节点 */
        trunNode: cc.Node,
        /** 开门按钮节点 */
        openDoorNode: cc.Node,
        /** 房间图标节点 */
        roomIconNode: cc.Node,
        /** 信封图标节点 */
        letterIconNode: cc.Node,
        /** 信封节点 */
        letterNode: cc.Node,
        /** 指引手节点 */
        guideHandNode: cc.Node,
        /** 关灯动画 */
        lightOutSpine: sp.Skeleton,
        /** 转场节点2 */
        trunNode2: cc.Node,
    },

    onLoad() {
        /** 当前步骤 */
        this.nowStep = 0;
        /** 是否可以播放打雷音效 */
        this.canPlayThunderSound = true;
    },

    start() {

        //音效
        // cc.audioEngine.stopAllEffects();
        // cc.audioEngine.stopMusic();
        cc.audioEngine.stopAll();
        //下雨背景音
        Res.playSound("下雨", true, true);
        //每秒尝试打雷一次
        this.schedule(this.thunderSound, 1);

        //房屋大门
        this.changeRoom(null, "0");
        //开幕
        cc.tween(this.trunNode2)
            .to(2, { opacity: 0 })
            .call(() => {
                this.node.getChildByName("跳过").active = true;
                this.nextStep();
            })
            .start();
    },

    update(dt) {

    },


    /** 打雷声 */
    thunderSound() {
        if (!this.canPlayThunderSound) return;
        //打雷音效冷却时间 随机范围内
        this.canPlayThunderSound = false;
        this.scheduleOnce(() => {
            this.canPlayThunderSound = true;
        }, ATools.getRandom(5, 30));
        //音效
        Res.playSound("打雷", false, false);
    },

    /** 下一步 */
    nextStep() {
        this.nowStep++;
        //步骤
        if (this.nowStep == 1) {
            //对话提示
            this.showTip("突然下了这么大的雨");
            this.scheduleOnce(() => {
                this.nextStep();
            }, 3);
        }
        if (this.nowStep == 2) {
            //对话提示
            this.showTip("幸亏有这么个木屋可以避雨");
            this.scheduleOnce(() => {
                this.nextStep();
            }, 3);
        }
        if (this.nowStep == 3) {
            for (let i = 0; i < 6; i++) {
                this.scheduleOnce(() => {
                    //敲门音效
                    if (i == 0) Res.playSound("敲门声", false, false);
                    //说话提示
                    if (i == 1) this.showTip("有人吗？请问有人在吗？");
                    //敲门音效
                    if (i == 2) Res.playSound("敲门声", false, false);
                    //下一步
                    if (i == 5) {
                        //显示开门按钮
                        this.openDoorNode.active = true;
                        this.guideHandNode.opacity = 255;
                    }
                }, i);
            }
        }
        if (this.nowStep == 4) {
            //音效
            Res.playSound("开门", false, false);
            //说话提示
            this.scheduleOnce(() => {
                this.showTip("奇怪，怎么没有人呢。");
            }, 3);
            //下一步
            this.scheduleOnce(() => {
                this.nextStep();
            }, 6);
        }
        if (this.nowStep == 5) {
            //说话提示
            this.showTip("这里有一封信");
            this.scheduleOnce(() => {
                //显示信封图标
                this.letterIconNode.active = true;
                //显示指引手
                this.guideHandNode.opacity = 255;
            }, 3);
        }
        if (this.nowStep == 6) {
            for (let i = 0; i < 15; i++) {
                this.scheduleOnce(() => {
                    //说话提示
                    if (i == 0) this.showTip("他们是指谁？好奇怪的信件。。。");
                    //伪人说话
                    if (i == 2) Res.playSound("伪人说话1", false, false);
                    //说话提示
                    if (i == 5) this.showTip("什么声音 过去看看");
                    //显示指引
                    if (i == 7) {
                        this.roomIconNode.active = true;
                        this.guideHandNode.opacity = 255;
                    }
                }, i);
            }
        }
        if (this.nowStep == 7) {
            //关灯动画
            this.lightOutSpine.setAnimation(0, "animation", false);
            this.lightOutSpine.setCompleteListener(() => {
                //伪人攻击
                this.doorSpine.setAnimation(0, "攻击", false);
                Res.playSound("鬼突袭", false, false);
                this.scheduleOnce(() => {
                    //屏幕抖动
                    cc.tween(this.roomsNode.children[2])
                        .by(0.05, { x: 50, y: 0 })
                        .by(0.05, { x: -50, y: 0 })
                        .by(0.05, { x: -50, y: 0 })
                        .by(0.05, { x: 50, y: 0 })
                        .call(() => {
                            //结束
                            Res.playSound("女孩惊叫", false, false);
                            this.storyEnd(null, null);
                        })
                        .start();
                }, 1.8);
            });
        }
    },

    /** 进入房间 */
    goInRooms() {
        Res.playSound("点击", false, false);
        //隐藏按钮和指引手
        this.openDoorNode.active = false;
        this.guideHandNode.opacity = 0;
        this.guideHandNode.position = cc.v2(150, -150);
        //走进
        cc.tween(this.roomsNode.children[0])
            .to(0.75, { x: -100, y: 100, scale: 1.5 })
            .call(() => {
                this.changeRoom(null, "1");
            })
            .start();
    },

    /** 切换场景 */
    changeRoom(event, cData) {
        cc.tween(this.trunNode)
            .to(0.5, { opacity: 255 })
            .call(() => {

                for (let i = 0; i < this.roomsNode.children.length; i++) {
                    let roomNode = this.roomsNode.children[i];
                    if (i == parseInt(cData)) roomNode.scale = 1;
                    else roomNode.scale = 0;
                }

                //下一步 
                if (this.nowStep == 3) {
                    //下一步 
                    this.nextStep();
                }

                //下一步 
                if (this.nowStep == 6) {
                    //隐藏按钮和指引手
                    this.roomIconNode.active = false;
                    this.guideHandNode.opacity = 0;
                    //下一步 
                    this.nextStep();
                }

            })
            .to(0.5, { opacity: 0 })
            .start();
    },

    /** 玩家提示 */
    showTip(word) {
        //创建提示
        let tip = cc.instantiate(Res.loadPrefab("提示栏"));
        tip.parent = this.node.getChildByName("Tip");
        tip.position = cc.v2(0, 200);
        //显示相应的语句
        tip.children[0].getComponent(cc.Label).string = word;
        //渐渐出现
        cc.tween(tip)
            .to(0.3, { opacity: 255 })
            .delay(1.5)
            .to(0.3, { opacity: 0 })
            .call(() => {
                tip.destroy();
            })
            .start();
    },

    /** 打开信封 */
    openLetter() {
        Res.playSound("点击", false, false);
        //信封图标消失
        this.letterIconNode.active = false;
        //指引手移动
        this.guideHandNode.opacity = 0;
        this.guideHandNode.position = cc.v2(-580, -50);
        //打开信封
        this.letterNode.active = true;
        cc.tween(this.letterNode.getChildByName("信"))
            .to(0.15, { scale: 1.1 })
            .to(0.1, { scale: 1 })
            .start();
    },

    /** 关闭信封 */
    closeLetter() {
        Res.playSound("点击", false, false);
        cc.tween(this.letterNode.getChildByName("信"))
            .to(0.1, { scale: 1.1 })
            .to(0.15, { scale: 0 })
            .call(() => {
                this.letterNode.active = false;
                //下一步
                this.nextStep();
            })
            .start();
    },

    /** 剧情结束 */
    storyEnd(event, cData) {
        if (cData) Res.playSound("点击", false, false);
        //转场
        cc.tween(this.trunNode2)
            .to(0.4, { opacity: 255 })
            .delay(1)
            .call(() => {
                cc.director.loadScene("GameScene");
            })
            .start();
    },

});
