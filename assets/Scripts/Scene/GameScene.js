

cc.Class({
    extends: cc.Component,

    properties: {
        /** 房间节点 */
        roomsNode: cc.Node,
        /** UI节点 */
        uiNode: cc.Node,
        /** 防守点位节点 */
        defenseNodes: [cc.Node],
        /** 防守点伪人节点 */
        enemyNodes: [cc.Node],
        /** 惊吓伪人节点 */
        scareEnemyNodes: [cc.Node],
        /** 玩家防守触摸点 */
        touchNodes: [cc.Node],
        /** 开窗帘节点 */
        openCurtainNodes: [cc.Node],
        /** 关窗帘节点 */
        closeCurtainNodes: [cc.Node],
        /** 物品藏匿地点节点 */
        thingsHideNodes: [cc.Node],
        /** 遥控器藏匿点 */
        tvRemoteHideNode: cc.Node,
        /** 厨房柜橱节点 */
        cupboardNode: cc.Node,
        /** 仓库木柴节点 */
        warehourseWoodsNode: cc.Node,
        /** 木板生成点 */
        woodNodes: [cc.Node],
        /** 场景图标列表节点 */
        roomIconsNode: cc.Node,
        /** 物品图标列表节点 */
        thingIconsNode: cc.Node,
        /** 空十字架节点 */
        noCrossNode: cc.Node,
        /** 时间文字 */
        timeLabel: cc.Label,
        /** 监控伪人节点 */
        monitorEnemyNode: cc.Node,
        /** 攻击按钮节点 */
        attackBtnNode: cc.Node,
        /** 死亡结局动画 */
        deadSpines: [sp.Skeleton],
        /** 转场黑幕节点 */
        trunNode: cc.Node,
        /** 监控效果点 */
        watchEffectNode: cc.Node,
        /** 异常提醒节点 */
        abnormalEffectNode: cc.Node,
        /** 暂停游戏界面节点 */
        gamePuaseViewNode: cc.Node,
        /** 监控界面节点 */
        monitorViewNode: cc.Node,
        /** 监测器界面节点 */
        detectorViewNode: cc.Node,
        /** 监测器有效时长文字 */
        detectorTimeLabel: cc.Label,
        /** 关灯动画 */
        lightOutSpine: sp.Skeleton,
        /** 心跳节点 */
        heartNode: cc.Node,
        /** 心率数 */
        heartNumberLabel: cc.Label,
        /** 指引手节点 */
        guideHandNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        if (GameData.gameMode == 1) console.log("正常模式");
        if (GameData.gameMode == 2) console.log("恐怖模式");

        /** 各个点位所属房间 */
        this.ROOMS_POINTS = [
            { point: 0, room: 0, deadType: 6 }, { point: 1, room: 1, deadType: 4 }, { point: 2, room: 2, deadType: 5 },
            { point: 3, room: 2, deadType: 2 }, { point: 4, room: 3, deadType: 4 }, { point: 5, room: 3, deadType: 4 },
            { point: 6, room: 4, deadType: 3 }, { point: 7, room: 5, deadType: 1 }, { point: 8, room: 5, deadType: 0 },
            { point: 9, room: 5, deadType: 4 }, { point: 10, room: 6, deadType: 6 }, { point: 11, room: 6, deadType: 4 },
            { point: 12, room: 6, deadType: 4 },
        ];
        /** 各个房间名 */
        this.ROOMS_NAME = ["0仓库", "1卧室", "2卫生间", "3厨房", "4客厅", "5娱乐房", "6餐厅", "7监控"];
        /** 各个点位名称 */
        this.POINTS_NAME = ["0仓库门", "1卧室窗户", "2卫生间通风管道", "3卫生间马桶", "4厨房窗户1",
            "5厨房窗户2", "6客厅壁炉", "7娱乐房电视", "8娱乐房画像", "9娱乐房窗户", "10餐厅门", "11餐厅窗户1", "12餐厅窗户2"];
        /** 各个点位被攻破所需要攻击的次数 */
        this.POINTS_ATTACKED_NUMBER = [3, 4, 3, 3, 4, 4, 3, 3, 2, 3, 3, 3, 3];
        /** 各个点位被攻击间隔冷却时间（点位）（当前难度等级） */
        this.pointsAttackedTime = null;
        if (GameData.gameMode == 1) this.pointsAttackedTime = GameData.POINTS_ATTACKED_TIME_MODE_1;
        if (GameData.gameMode == 2) this.pointsAttackedTime = GameData.POINTS_ATTACKED_TIME_MODE_2;
        /** 各个点位被攻击次数 */
        this.pointsAttckedTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        /** 各个点位是否正在被攻击 */
        this.pointsBeAttcking = [false, false, false, false, false, false, false, false, false, false, false, false, false];

        /** 当前难度等级 */
        this.nowLevel = 0;
        /** 难度对应的攻击点位数量 （随机上下限） */
        this.ATTACK_POINT_NUMBER_BY_LEVEL = [
            [1, 1], [1, 1], [1, 1], [1, 1], [1, 2], [1, 2],
            [1, 2], [2, 2], [1, 2], [1, 1], [2, 2], [2, 2]
        ];
        /** 难度对应的攻击冷却时间 */
        this.attackCdByLecel = null;
        if (GameData.gameMode == 1) this.attackCdByLecel = GameData.ATTACK_CD_BY_LEVEL_1;
        if (GameData.gameMode == 2) this.attackCdByLecel = GameData.ATTACK_CD_BY_LEVEL_2;
        /** 首次进攻延迟时间 */
        this.firstAttackTime = null;
        if (GameData.gameMode == 1) this.firstAttackTime = GameData.TIME_DELAY_FIRST_ATTACK_1;
        if (GameData.gameMode == 2) this.firstAttackTime = GameData.TIME_DELAY_FIRST_ATTACK_2;
        /** 多次进攻时 每次进攻间隔时间 */
        this.TIME_DELAY_EACH_ATTACK = 8;
        /** 下次攻击是否会延缓10% */
        this.delayAttack = false;
        /** 当前可攻击的点位 */
        this.pointsCanBeAttacked = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
        //正常模式减少攻击点位
        if (GameData.gameMode == 1) this.pointsCanBeAttacked = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12];
        /** 当前不可攻击点位 */
        this.pointsCanNotBeAttacked = [];
        /** 当前已经封锁的点位 */
        this.lockPoints = [false, false, false, false, false, false, false, false, false, false, false, false, false];
        /** 三个带有窗帘的窗户 窗帘是否拉开 0卧室窗户 1厨房窗户1 2厨房窗户2*/
        this.windowWithCurtain = [false, false, false];
        /** 窗户被攻击时抬高高度 3次或4次*/
        this.windowRiseHeight = [50, 100, 200, 200];
        /** 窗户抬高时间（秒） */
        this.TIME_WINDOW_RISE = 1;

        /** 出现惊吓伪人概率 */
        this.RATE_SHOW_SCARE = 0.5;
        /** 会出现惊吓伪人的房间 */
        this.ROOMS_SHOW_SCARE_ENEMY = [false, true, false, true, false, true, true, false];
        /** 惊吓伪人出现冷却时间 */
        this.TIME_COOL_DOWN_SHOW_SCARE_ENEMY = 15;
        /** 惊吓伪人是否可以出现 */
        this.showScareEnemy = true;
        /** 监控为人是否会否出现 */
        this.showMonitorEnemy = false;
        /** 监控伪人消失延迟 */
        this.TIME_DELAY_CLOSE_MONITOR_ENEMY = 5;
        /** 是否已经攻击过伪人了 */
        this.attackedEnemy = false;

        /** 是否已经解锁床头柜 */
        this.bedsideTableUnlock = false;
        /** 是否已经放置十字架 */
        this.putCrossOn = false;

        /** 当前房间序号 */
        this.nowRoomOrder = 5;
        /** 玩家当前获得的物品 0十字架 1大门钥匙 2床头柜钥匙 3木板 4木柴 5符纸 6遥控器*/
        this.playerGotThings = [0, 0, 0, 0, 0, 0, 0];
        /** 原始节点数组 */
        this.originalNodes = [];

        /** 玩家可视化操作节点 */
        this.tempNode = null;
        /** 玩家是否可以操作 */
        this.playerControl = true;
        /** 伪人是否可以进攻 */
        this.enemyCanAttack = true;
        /** 伪人攻击冷却时间 */
        this.enemyAttackTime = 0;
        /** 游戏结束 */
        this.gameOver = false;
        /** 玩家存活时间 */
        this.playerLiveTime = 0;
        /** 玩家死亡原因 */
        this.deadPoint = -1;

        /** 画像音效 */
        this.portraitSound = null;
        /** 壁炉持续燃烧音效 */
        this.fireSound = null;
        /** 钟摆音效 */
        this.clockSound = null;
        /** 电视雪花音效 */
        this.tvSound = null;
        /** 是否可以播放打雷音效 */
        this.canPlayThunderSound = true;
        /** 是否播放过伪人开门警告 */
        this.openDoorSoundPlayed = false;

        /** 是否激活监控 */
        this.monitorOnline = false;
        /** 是否激活了探测器 */
        this.detectorOnline = false;
        /** 监测器有效时间 */
        this.detectorTime = 0;

        /** 心跳缓动 */
        this.heartTween = null;
        /** 心跳间隔时间 */
        this.heartTime = 0.6;

        /** 当前新手指引步骤 */
        this.newPlayerGuideOrder = 0;
        /** 是否可以出AD */
        this.canShowAD = false;

    },

    start() {

        //UI适配屏幕
        this.uiNode.height = cc.winSize.height;
        this.uiNode.width = cc.winSize.width;

        //注册点击防守事件
        for (let i = 0; i < this.touchNodes.length; i++) {
            if (i !== 6 && i !== 8) this.touchNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                //点击
                this.clickSound();
                this.playerDefensePoint(i)
            }, this);
            else if (i == 6) this.touchNodes[i].on(cc.Node.EventType.TOUCH_START, () => {
                //新手限制
                if (GameData.userData.newPlayer) return;
                //点击
                this.clickSound();
                this.showTip("我需要一根木材");
            }, this);
            else if (i == 8) this.touchNodes[i].on(cc.Node.EventType.TOUCH_START, () => {
                //新手限制
                if (GameData.userData.newPlayer) return;
                //点击
                this.clickSound();
                //画像点击
                if (!this.lockPoints[8]) this.showTip("一张充满邪气的画像");
                if (this.lockPoints[8]) this.showTip("画像暂时没有威胁了");
            }, this);

        }
        //开关窗帘点击事件
        for (let i = 0; i < 3; i++) {
            this.openCurtainNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                //音效
                Res.playSound("开关窗帘", false, false);
                this.closeCurtainNodes[i].active = true;
                this.openCurtainNodes[i].active = false;
            }, this);
            this.closeCurtainNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                //音效
                Res.playSound("开关窗帘", false, false);
                this.openCurtainNodes[i].active = true;
                this.closeCurtainNodes[i].active = false;
            }, this);
        }

        //记录物品列表初始顺序
        for (let i = 0; i < this.thingIconsNode.children.length; i++) {
            this.originalNodes.push(this.thingIconsNode.children[i]);
        }

        //正常模式去掉客厅的木板
        if (GameData.gameMode == 1) this.woodNodes.splice(2, 1);
        //随机生成两个木板
        //新手则必定会在卧室生成一个
        if (GameData.userData.newPlayer) {
            let wood1 = this.woodNodes.splice(1, 1)[0];
            let wood2 = this.woodNodes.splice(0, 1)[0];
            wood1.active = true;
            wood2.active = true;
            //赋予点击事件
            wood1.on(cc.Node.EventType.TOUCH_END, () => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 2) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                this.playerGetThing("木板", wood1);
            }, this);
            wood2.on(cc.Node.EventType.TOUCH_END, () => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 2) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                this.playerGetThing("木板", wood2)
            }, this);
        }
        else {
            let wood1 = this.woodNodes.splice(ATools.getRandom(0, this.woodNodes.length - 1), 1)[0];
            let wood2 = this.woodNodes.splice(ATools.getRandom(0, this.woodNodes.length - 1), 1)[0];
            wood1.active = true;
            wood2.active = true;
            //赋予点击事件
            wood1.on(cc.Node.EventType.TOUCH_END, () => {
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                this.playerGetThing("木板", wood1);
            }, this);
            wood2.on(cc.Node.EventType.TOUCH_END, () => {
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //点击
                this.clickSound();
                this.playerGetThing("木板", wood2);
            }, this);
        }

        //正常模式 没有客厅 仓库 没有十字架
        if (GameData.gameMode == 1) {
            //取出客厅藏匿点
            this.thingsHideNodes.splice(6);
            //在所有藏匿地点中 随机产生三个不同物品
            for (let i = 0; i < 3; i++) {
                let thingsHideNode = this.thingsHideNodes.splice(ATools.getRandom(0, this.thingsHideNodes.length - 1), 1)[0];
                //确定物品
                let thingName = null;
                if (i == 0) thingName = "大门钥匙";
                if (i == 1) thingName = "床头柜钥匙";
                if (i == 2) thingName = "符纸";
                //留下相应的东西 其他东西销毁
                for (let i = thingsHideNode.children.length - 1; i >= 0; i--) {
                    let thing = thingsHideNode.children[i];
                    if (thing.name !== thingName) thing.destroy();
                }
                // 藏匿点点击事件
                thingsHideNode.on(cc.Node.EventType.TOUCH_END, () => {
                    //游戏结束
                    if (!this.playerControl || this.gameOver) return;
                    //新手限制
                    if (GameData.userData.newPlayer) return;
                    //点击
                    this.clickSound();
                    //拿取物品
                    if (thingsHideNode.opacity > 0 && thingsHideNode.childrenCount > 0) {
                        //获得物品
                        this.playerGetThing(thingsHideNode.children[0].name, thingsHideNode.children[0])
                    }
                    //关闭
                    else if (thingsHideNode.opacity > 0) {
                        //音效
                        Res.playSound("关柜子", false, false);
                        thingsHideNode.opacity = 0;
                        if (thingsHideNode.childrenCount > 0) thingsHideNode.children[0].active = false;
                    }
                    //打开
                    else {
                        //音效
                        Res.playSound("开柜子", false, false);
                        thingsHideNode.opacity = 255;
                        if (thingsHideNode.childrenCount > 0) thingsHideNode.children[0].active = true;
                    }
                }, this);
            }
        }
        //恐怖模式 全
        else {
            //在所有藏匿地点中 随机产生四个不同物品
            for (let i = 0; i < 4; i++) {
                let thingsHideNode = this.thingsHideNodes.splice(ATools.getRandom(0, this.thingsHideNodes.length - 1), 1)[0];
                //确定物品
                let thingName = null;
                if (i == 0) thingName = "十字架";
                if (i == 1) thingName = "大门钥匙";
                if (i == 2) thingName = "床头柜钥匙";
                if (i == 3) thingName = "符纸";
                //留下相应的东西 其他东西销毁
                for (let i = thingsHideNode.children.length - 1; i >= 0; i--) {
                    let thing = thingsHideNode.children[i];
                    if (thing.name !== thingName) thing.destroy();
                }
                // 藏匿点点击事件
                thingsHideNode.on(cc.Node.EventType.TOUCH_END, () => {
                    //游戏结束
                    if (!this.playerControl || this.gameOver) return;
                    //新手限制
                    if (GameData.userData.newPlayer) return;
                    //点击
                    this.clickSound();
                    //拿取物品
                    if (thingsHideNode.opacity > 0 && thingsHideNode.childrenCount > 0) {
                        //获得物品
                        this.playerGetThing(thingsHideNode.children[0].name, thingsHideNode.children[0])
                    }
                    //关闭
                    else if (thingsHideNode.opacity > 0) {
                        //音效
                        Res.playSound("关柜子", false, false);
                        thingsHideNode.opacity = 0;
                        if (thingsHideNode.childrenCount > 0) thingsHideNode.children[0].active = false;
                    }
                    //打开
                    else {
                        //音效
                        Res.playSound("开柜子", false, false);
                        thingsHideNode.opacity = 255;
                        if (thingsHideNode.childrenCount > 0) thingsHideNode.children[0].active = true;
                    }
                }, this);
            }
        }
        //将其他没有用得到的地方的物品销毁
        for (let i = 0; i < this.thingsHideNodes.length; i++) {
            let thingsHideNode = this.thingsHideNodes[i];
            //销毁多余的物品
            thingsHideNode.destroyAllChildren();
            // 藏匿点点击事件
            thingsHideNode.on(cc.Node.EventType.TOUCH_END, () => {
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //新手限制
                if (GameData.userData.newPlayer) return;
                //点击
                this.clickSound();
                //关闭
                if (thingsHideNode.opacity > 0) {
                    //音效
                    Res.playSound("关柜子", false, false);
                    thingsHideNode.opacity = 0;
                }
                //打开
                else {
                    //音效
                    Res.playSound("开柜子", false, false);
                    thingsHideNode.opacity = 255;
                }
            }, this);
        }

        //床头柜点击事件
        this.tvRemoteHideNode.on(cc.Node.EventType.TOUCH_END, () => {
            //游戏结束
            if (!this.playerControl || this.gameOver) return;
            //新手限制
            if (GameData.userData.newPlayer) return;
            //点击
            this.clickSound();
            //床头柜提示
            //检查是否已经解锁床头柜
            if (!this.bedsideTableUnlock) {
                this.showTip("不行，柜子被上锁了");
                return;
            }
            //拿取物品
            if (this.tvRemoteHideNode.opacity > 0 && this.tvRemoteHideNode.childrenCount > 0) {
                //获得物品
                this.playerGetThing("遥控器", this.tvRemoteHideNode.children[0])
            }
            //关闭
            else if (this.tvRemoteHideNode.opacity > 0) {
                //音效
                Res.playSound("关柜子", false, false);
                this.tvRemoteHideNode.opacity = 0;
                if (this.tvRemoteHideNode.childrenCount > 0) this.tvRemoteHideNode.children[0].active = false;
            }
            //打开
            else {
                //音效
                Res.playSound("开柜子", false, false);
                this.tvRemoteHideNode.opacity = 255;
                if (this.tvRemoteHideNode.childrenCount > 0) this.tvRemoteHideNode.children[0].active = true;
            }
        }, this);

        //厨房柜橱点击事件
        this.cupboardNode.on(cc.Node.EventType.TOUCH_END, () => {
            //游戏结束
            if (!this.playerControl || this.gameOver) return;
            //点击
            this.clickSound();
            //关闭
            if (this.cupboardNode.opacity > 0) {
                //音效
                Res.playSound("关柜子", false, false);
                this.cupboardNode.opacity = 0;
            }
            //打开
            else {
                //音效
                Res.playSound("开柜子", false, false);
                this.cupboardNode.opacity = 255;
            }
        }, this);

        //空十字架点击
        this.noCrossNode.on(cc.Node.EventType.TOUCH_END, () => {
            //游戏结束
            if (!this.playerControl || this.gameOver) return;
            //放置十字架后不会显示
            if (this.putCrossOn) return;
            //点击
            this.clickSound();
            //十字架提示
            this.showTip("这里可以挂些什么呢");
        }, this);

        //仓库木柴点击事件
        this.warehourseWoodsNode.on(cc.Node.EventType.TOUCH_END, () => {
            //游戏结束
            if (!this.playerControl || this.gameOver) return;
            //点击
            this.clickSound();
            //获得物品
            this.playerGetThing("木柴", this.warehourseWoodsNode)
        }, this);

        //UI物品栏点击拖动事件
        for (let i = 0; i < this.thingIconsNode.children.length; i++) {
            let thingIconNode = this.thingIconsNode.children[i];
            //点击生成复制体
            thingIconNode.on(cc.Node.EventType.TOUCH_START, (event => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 5) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //没有物品时 不能点击
                if (!thingIconNode.children[0].active) return;
                //点击
                this.clickSound();
                //生成可视化节点
                this.tempNode = cc.instantiate(thingIconNode.children[0]);
                //改变节点父节点 并保持原位置
                let pos1 = thingIconNode.convertToWorldSpaceAR(thingIconNode.children[0].getPosition());
                let pos2 = this.uiNode.convertToNodeSpaceAR(pos1);
                this.tempNode.parent = this.uiNode;
                this.tempNode.position = pos2;
                //放大
                this.tempNode.scale = 2;
                //停止滚动视图
                this.thingIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = false;
            }), this);
            //移动可视化节点
            thingIconNode.on(cc.Node.EventType.TOUCH_MOVE, (event => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 5) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //没有物品时 不能点击
                if (!thingIconNode.children[0].active) return;
                if (this.tempNode == null) return;
                //生成可视化节点
                this.tempNode.x += event.getDelta().x;
                this.tempNode.y += event.getDelta().y;
            }), this);
            //释放以判定使用物品位置
            thingIconNode.on(cc.Node.EventType.TOUCH_END, (event => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 5) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //没有物品时 不能点击
                if (!thingIconNode.children[0].active) return;
                //点击
                this.clickSound();
                //没有拖动 可视化节点消失
                this.tempNode.destroy();
                this.tempNode = null;
                //恢复滚动视图
                this.thingIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = true;
            }), this);
            thingIconNode.on(cc.Node.EventType.TOUCH_CANCEL, (event => {
                //新手限制
                if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 5) return;
                //游戏结束
                if (!this.playerControl || this.gameOver) return;
                //没有物品时 不能点击
                if (!thingIconNode.children[0].active) return;
                //点击
                this.clickSound();

                //根据当前场景 使用的物品 和位置 判断是否使用正确
                let name = this.tempNode.name;
                let x = this.tempNode.x;
                let y = this.tempNode.y;
                // console.log("放置" + name);
                //封锁仓库大门
                if (this.nowRoomOrder == 0 && name == "大门钥匙" && x >= -105 && x <= 75 && y >= -150 && y <= 165) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(0);
                    //锁门提示
                    this.showTip("大门已经锁上了");
                    //关闭
                    if (this.pointsBeAttcking[0]) this.playerDefensePoint(0);
                }
                //封锁卧室窗户
                if (this.nowRoomOrder == 1 && name == "木板" && x >= 220 && x <= 380 && y >= -80 && y <= 195) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(1);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[1]) this.playerDefensePoint(1);
                    if (this.newPlayerGuideOrder == 5) this.nextNewPlayerGuide();
                }
                //打开卧室床头柜
                if (this.nowRoomOrder == 1 && name == "床头柜钥匙" && x >= 370 && x <= 470 && y >= -160 && y <= -80) {
                    //使用物品
                    this.playerUseThing(name);
                    //打开床头柜
                    this.bedsideTableUnlock = true;
                    //音效
                    Res.playSound("开柜子", false, false);
                    this.tvRemoteHideNode.opacity = 255;
                    if (this.tvRemoteHideNode.childrenCount > 0) this.tvRemoteHideNode.children[0].active = true;
                }
                //封锁厨房窗户1
                if (this.nowRoomOrder == 3 && name == "木板" && x >= -500 && x <= -170 && y >= -225 && y <= 180) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(4);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[4]) this.playerDefensePoint(4);
                }
                //封锁厨房窗户2
                if (this.nowRoomOrder == 3 && name == "木板" && x >= 270 && x <= 570 && y >= -330 && y <= 200) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(5);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[5]) this.playerDefensePoint(5);
                }
                //放置十字架
                if (this.nowRoomOrder == 4 && name == "十字架" && x >= 430 && x <= 530 && y >= -10 && y <= 140) {
                    //使用物品
                    this.playerUseThing(name);
                    //已放置十字架
                    this.putCrossOn = true;
                    //显示十字架
                    this.roomsNode.children[this.nowRoomOrder].getChildByName("十字架").active = true;
                    //十字架作用提示
                    this.showTip("怪物的进攻延缓10%");
                }
                //放置木柴 防守客厅壁炉
                if (this.nowRoomOrder == 4 && name == "木柴" && x >= -420 && x <= -280 && y >= -260 && y <= -100) {
                    //使用物品
                    this.playerUseThing(name);
                    //防守壁炉进攻点
                    this.playerDefensePoint(6);
                    //放木柴提示
                    this.showTip("火势更旺了");
                }
                //封锁娱乐房电视
                if (this.nowRoomOrder == 5 && name == "遥控器" && x >= 50 && x <= 250 && y >= -80 && y <= 120) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(7);
                    //关电视提示
                    this.showTip("电视已关闭");
                    //关闭电视
                    if (this.pointsBeAttcking[7]) this.playerDefensePoint(7);
                }
                //封锁娱乐房画像
                if (this.nowRoomOrder == 5 && name == "符纸" && x >= -520 && x <= -320 && y >= 20 && y <= 275) {
                    //关电视提示
                    this.showTip("画像已被封印");
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(8);
                    //关闭画像
                    if (this.pointsBeAttcking[8]) this.playerDefensePoint(8);
                }
                //封锁娱乐房窗户
                if (this.nowRoomOrder == 5 && name == "木板" && x >= -220 && x <= 0 && y >= -100 && y <= 300) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(9);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[9]) this.playerDefensePoint(9);
                }
                //封锁餐厅门
                if (this.nowRoomOrder == 6 && name == "大门钥匙" && x >= -155 && x <= -50 && y >= -180 && y <= 100) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(10);
                    //锁门提示
                    this.showTip("大门已经锁上了");
                    //关闭
                    if (this.pointsBeAttcking[10]) this.playerDefensePoint(10);
                }
                //封锁餐厅窗户1
                if (this.nowRoomOrder == 6 && name == "木板" && x >= 160 && x <= 400 && y >= -160 && y <= 150) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(11);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[11]) this.playerDefensePoint(11);
                }
                //封锁餐厅窗户2
                if (this.nowRoomOrder == 6 && name == "木板" && x >= -525 && x <= -355 && y >= -100 && y <= 80) {
                    //使用物品
                    this.playerUseThing(name);
                    this.lockDefensePoints(12);
                    //封窗提示
                    this.showTip("窗户用木板封死了");
                    //关闭
                    if (this.pointsBeAttcking[12]) this.playerDefensePoint(12);
                }

                //清除可视化节点
                this.tempNode.destroy();
                this.tempNode = null;
                //恢复滚动视图
                this.thingIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = true;
                //刷新显示
                this.refreshRoomsShow();
            }), this);
        }

        //首次攻击延迟
        // console.log("首次进攻冷却时间 " + this.firstAttackTime);
        this.enemyCanAttack = false;

        //每2秒刷新心率显示
        this.schedule(() => {
            if (this.gameOver) return;
            if (this.heartTime == 0.6)
                this.heartNumberLabel.string = "" + ATools.getRandom(70, 80);
            if (this.heartTime == 0.4)
                this.heartNumberLabel.string = "" + ATools.getRandom(90, 100);
            if (this.heartTime == 0.2)
                this.heartNumberLabel.string = "" + ATools.getRandom(110, 120);
        }, 1.78);

        //音效
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        //下雨背景音
        Res.playSound("下雨", true, true);

        //监控显示点 闪烁
        cc.tween(this.watchEffectNode)
            .repeatForever(
                cc.tween()
                    .to(0.8, { opacity: 0 })
                    .to(0.8, { opacity: 255 })
            )
            .start();

        //正常模式没有客厅 仓库
        if (GameData.gameMode == 1) {
            this.roomIconsNode.getChildByName("4客厅").active = false;
            this.roomIconsNode.getChildByName("0仓库").active = false;
            //关闭场景栏滑动
            this.roomIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = false;
            //没有上下箭头
            this.roomIconsNode.parent.parent.getChildByName("s").active = false;
            this.roomIconsNode.parent.parent.getChildByName("x").active = false;
        }

        //广告
        if (AD.wuDianRate > 0) {
            this.canShowAD = true;
        }

        //刷新显示
        this.refreshRoomsShow();
        this.refreshThingsShow();
        //刷新异常提醒
        this.refreshAbnormalEffect();

        //隐藏UI 停止控制
        this.playerControl = false;
        this.uiNode.opacity = 0;
        this.uiNode.getChildByName("交互显示").getChildByName("目标").opacity = 0;
        this.uiNode.getChildByName("交互显示").getChildByName("时间").opacity = 0;
        //眨眼动画
        let startSpineNode = this.node.getChildByName("眨眼");
        let startSpine = startSpineNode.getComponent(sp.Skeleton);
        startSpine.setAnimation(0, "animation", false);
        startSpine.setCompleteListener(() => {
            startSpineNode.destroy();
            //显示UI
            cc.tween(this.uiNode)
                .to(0.5, { opacity: 255 })
                .call(() => {
                    //新手教程
                    if (GameData.userData.newPlayer) {
                        this.showTip("奇怪，头好痛啊");
                        this.scheduleOnce(() => {
                            this.showTip("那个恐怖的黑影到底是什么东西");
                            this.scheduleOnce(() => {
                                //新手
                                this.newPlayerGuide();
                            }, 2);
                        }, 2);
                    }
                    //直接开始 
                    else {
                        //可以点击
                        this.playerControl = true;
                        this.startGame();
                    }
                })
                .start();
        });

    },

    update(dt) {
        //检测壁炉火焰
        if (this.nowRoomOrder == 4 && this.pointsAttckedTimes[6] == 0) {
            if (this.fireSound == null) this.fireSound = Res.playSound("壁炉火持续燃烧", false, true);
        } else {
            if (this.fireSound !== null) {
                cc.audioEngine.stopEffect(this.fireSound);
                this.fireSound = null;
            }
        }
    },

    /** 开始游戏 */
    startGame() {
        //首次攻击延迟
        // console.log("首次进攻冷却时间 " + this.firstAttackTime);
        this.enemyCanAttack = false;
        this.enemyAttackTime = this.firstAttackTime;

        // 开始计时
        this.schedule(this.timeLose1, 1.33);
        this.schedule(this.timeLose2, 1);

        //显示UI时间目标
        this.uiNode.getChildByName("交互显示").getChildByName("目标").opacity = 255;
        this.uiNode.getChildByName("交互显示").getChildByName("时间").opacity = 255;
    },

    /** 新手指引 */
    newPlayerGuide() {
        //关闭场景栏和物品栏的滑动
        this.roomIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = false;
        this.thingIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = false;
        //下一步
        this.nextNewPlayerGuide();
    },

    /** 新手指引步骤 */
    nextNewPlayerGuide() {
        this.newPlayerGuideOrder++;
        // console.log("新手指引步骤=> " + this.newPlayerGuideOrder);
        //重置手
        this.guideHandNode.position = cc.v2(1000, 0);
        this.guideHandNode.opacity = 0;
        //暂时不可点击
        this.playerControl = false;
        //步骤
        //进入卧室
        if (this.newPlayerGuideOrder == 1) {
            this.showTip("先去卧室看看吧");
            this.scheduleOnce(() => {
                this.guideHandNode.position = cc.v2(-600, 80);
                this.guideHandNode.opacity = 255;
                this.scheduleOnce(() => {
                    //恢复点击
                    this.playerControl = true;
                    // console.log("可以点击了");
                }, 0.5);
            }, 2);
        }
        //拿起木板
        if (this.newPlayerGuideOrder == 2) {
            this.showTip("这个木板或许可以用来做什么");
            this.scheduleOnce(() => {
                this.guideHandNode.position = cc.v2(210, -190);
                this.guideHandNode.opacity = 255;
                this.scheduleOnce(() => {
                    //恢复点击
                    this.playerControl = true;
                    // console.log("可以点击了");
                }, 0.5);
            }, 3);
        }
        //伪人进攻卧室窗户
        if (this.newPlayerGuideOrder == 3) {
            this.scheduleOnce(() => {
                this.pointsBeAttcking[1] = true;
                this.pointsAttcked(1);
            }, 1);
        }
        //指引玩家关闭窗户
        if (this.newPlayerGuideOrder == 4) {
            this.showTip("什么东西 快把窗户关上！");
            this.scheduleOnce(() => {
                this.guideHandNode.position = cc.v2(340, 20);
                this.guideHandNode.opacity = 255;
                this.scheduleOnce(() => {
                    //恢复点击
                    this.playerControl = true;
                    // console.log("可以点击了");
                }, 0.5);
            }, 1.5);
        }
        //关上窗户
        if (this.newPlayerGuideOrder == 5) {
            this.showTip("这个黑手好诡异啊");
            this.scheduleOnce(() => {
                this.showTip("也许我可以用木板封住窗户");
                this.scheduleOnce(() => {
                    this.showTip("拖拽木板放到窗户上");
                    this.scheduleOnce(() => {
                        this.guideHandNode.opacity = 255;
                        this.guideHandNode.position = cc.v2(680, 120);
                        let ani = this.guideHandNode.getComponent(cc.Animation);
                        ani.play("指引手动画2");
                        this.scheduleOnce(() => {
                            //恢复点击
                            this.playerControl = true;
                            // console.log("可以点击了");
                        }, 0.5);
                    }, 3);
                }, 3);
            }, 3);
        }
        //封上窗户
        if (this.newPlayerGuideOrder == 6) {
            //清除指引手
            this.guideHandNode.destroy();
            //说话
            for (let i = 0; i < 4; i++) {
                this.scheduleOnce(() => {
                    if (i == 0) this.showTip("看来那封信说的是真的");
                    if (i == 1) this.showTip("这个木屋隐藏着什么危险");
                    if (i == 2) this.showTip("我要活下去 不能让那些恐怖的东西进来");
                    if (i == 3) {
                        // console.log("完成新手指引");
                        this.newPlayerGuideOrder == 0;
                        GameData.userData.newPlayer = false;
                        GameData.saveUserData();
                        //回复滑动
                        //关闭场景栏和物品栏的滑动
                        if (GameData.gameMode == 2) this.roomIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = true;
                        this.thingIconsNode.parent.parent.getComponent(cc.ScrollView).enabled = true;
                        //开始游戏
                        this.startGame();
                        //恢复点击
                        this.playerControl = true;
                        // console.log("可以点击了");
                    }
                }, i * 3);
            }
        }
    },

    /** 切换房间 */
    changeRoom(event, cData) {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //新手限制
        if (GameData.userData.newPlayer && cData !== "1") return;
        //正常模式屏蔽客厅
        if (GameData.gameMode == 1 && cData == "4") {
            this.showTip("恐怖模式解锁该场景");
            return;
        }
        //点击
        this.clickSound();
        //改变序号
        let order = parseInt(cData);
        if (this.nowRoomOrder == order) return;
        this.nowRoomOrder = order;

        //音效
        Res.playSound("走路声", false, false);
        //转场
        cc.tween(this.trunNode)
            .call(() => {
                this.playerControl = false;
            })
            .to(0.5, { opacity: 255 })
            .call(() => {
                //刷新房间显示
                this.refreshRoomsShow();
                if (!GameData.userData.newPlayer) this.playerControl = true;
            })
            .to(0.5, { opacity: 0 })
            .start();

        if (this.canShowAD && AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing();
            this.canShowAD = false;
            this.scheduleOnce(() => {
                this.canShowAD = true;
            }, 30);
        }

    },

    /** 刷新房间显示 */
    refreshRoomsShow() {
        // console.log("当前房间=>" + this.ROOMS_NAME[this.nowRoomOrder]);

        //列表中房间图标选中框显示
        for (let i = 0; i < this.roomIconsNode.children.length; i++) {
            let roomIconNode = this.roomIconsNode.children[i];
            if (roomIconNode.name == this.ROOMS_NAME[this.nowRoomOrder]) roomIconNode.getChildByName("选中框").active = true;
            else roomIconNode.getChildByName("选中框").active = false;
        }
        //新手指引
        if (this.newPlayerGuideOrder == 1) this.nextNewPlayerGuide();

        //检查封锁点
        for (let i = 0; i < this.lockPoints.length; i++) {
            let lock = this.lockPoints[i];
            //窗户封锁显示木板 
            if ((i == 1 || i == 4 || i == 5 || i == 9 || i == 11 || i == 12) && lock)
                this.defenseNodes[i].getChildByName("封窗").active = true;
            //画封锁显示符纸
            if (i == 8 && lock) this.defenseNodes[i].parent.getChildByName("符纸").active = true;
        }

        //显示对应的房间
        for (let i = 0; i < this.roomsNode.children.length; i++) {
            let roomNode = this.roomsNode.children[i];
            if (i == this.nowRoomOrder) roomNode.scale = 1;
            else roomNode.scale = 0;
        }

        //若是客厅 钟表音效
        if (this.clockSound) cc.audioEngine.stopEffect(this.clockSound);
        if (this.nowRoomOrder == 4) this.clockSound = Res.playSound("钟摆", false, true);

        //清除攻击按钮
        this.attackBtnNode.active = false;

        //若为监控视角
        if (this.nowRoomOrder == 7) {
            //清除监控伪人
            this.monitorEnemyNode.active = false;
            //显示攻击按钮
            this.attackBtnNode.active = true;
            //重置攻击
            this.attackedEnemy = false;
            //检查监控伪人是否会出现
            if (!this.showMonitorEnemy) return;
            //每次攻击最多看到一次
            this.showMonitorEnemy = false;
            //显示监控伪人
            this.monitorEnemyNode.active = true;
            //显示动画
            this.monitorEnemyNode.getComponent(sp.Skeleton).setAnimation(0, "看监控", true);
        }

        //不是监控视角
        else {
            //游戏结束
            if (this.gameOver) return;
            //显示惊吓伪人
            //检查当前房间是否有惊吓伪人
            if (!this.ROOMS_SHOW_SCARE_ENEMY[this.nowRoomOrder]) return;
            //出现几率
            if (ATools.getRandom(1, 10) / 10 <= this.RATE_SHOW_SCARE) return;
            //冷却时间
            if (!this.showScareEnemy) return;
            this.showScareEnemy = false;
            this.scheduleOnce(() => {
                this.showScareEnemy = true;
            }, this.TIME_COOL_DOWN_SHOW_SCARE_ENEMY);
            //延迟
            this.scheduleOnce(() => {
                //不同房间
                //卧室
                if (this.nowRoomOrder == 1) {
                    this.scareEnemyNodes[0].getComponent(sp.Skeleton).setAnimation(0, "卧室", false);
                }
                //厨房
                else if (this.nowRoomOrder == 3) {
                    if (ATools.getRandom(0, 1)) {
                        this.scareEnemyNodes[1].getComponent(sp.Skeleton).setAnimation(0, "厨房L", false);
                    } else {
                        this.scareEnemyNodes[2].getComponent(sp.Skeleton).setAnimation(0, "厨房R", false);
                    }
                }
                //娱乐房
                else if (this.nowRoomOrder == 5) {
                    this.scareEnemyNodes[3].getComponent(sp.Skeleton).setAnimation(0, "电视", false);
                }
                //餐厅
                else if (this.nowRoomOrder == 6) {
                    if (ATools.getRandom(0, 1)) {
                        this.scareEnemyNodes[4].getComponent(sp.Skeleton).setAnimation(0, "餐厅R", false);
                    } else {
                        this.scareEnemyNodes[5].getComponent(sp.Skeleton).setAnimation(0, "餐厅L", false);
                    }
                }
            }, 0.75);
        }

    },

    /** 玩家攻击监控伪人 */
    attackMonitorEnemy() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //攻击
        if (this.monitorEnemyNode.active) {
            //检查是否已经攻击过了
            if (this.attackedEnemy) return;
            this.attackedEnemy = true;
            //自动防守点11
            this.playerDefensePoint(11);
            //监控伪人消失
            this.showMonitorEnemy = false;
            //下一次攻击时间延缓10%
            this.delayAttack = true
            //播放动画
            let spine = this.monitorEnemyNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "颤抖", false);
            //动作完以后关闭伪人节点
            spine.setCompleteListener((a, evt) => {
                if (a.animation.name !== "颤抖") return;
                if (this.monitorEnemyNode) this.monitorEnemyNode.active = false;
                //提示
                this.showTip("攻击成功 怪物下次进攻延缓10%");
            });
        } else {
            //提示
            this.showTip("暂无怪物进攻");
        }
    },

    /**
     * 玩家获得物品
     * @param {string} thingName 物品名称
     * @param {cc.Node} effectNode 作用节点
     */
    playerGetThing(thingName, effectNode) {
        //新手限制
        if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 2) return;
        //停止操作
        this.playerControl = false;
        //玩家提示
        this.showTip(thingName + "+1");
        //显示物品获得效果 木柴区分
        let thingNode = null;
        if (thingName == "木柴") {
            //检查身上是否已经携带木柴了 如果有则 不能超过一个
            if (this.playerGotThings[4] >= 1) {
                //恢复操作
                this.playerControl = true;
                return;
            }
            thingNode = cc.instantiate(Res.loadPrefab("单木柴"));
            thingNode.parent = effectNode.parent;
            thingNode.position = effectNode.position;
        } else thingNode = effectNode;
        //改变节点父节点 并保持原位置
        let pos1 = thingNode.parent.convertToWorldSpaceAR(thingNode.getPosition());
        let pos2 = this.uiNode.convertToNodeSpaceAR(pos1);
        thingNode.parent = this.uiNode;
        thingNode.position = pos2;
        //计算移动时间
        // let moveTime = (535 - thingNode.x) / 900;
        let moveTime = 0.5;
        //音效
        Res.playSound("获取道具", false, false);
        //移动到道具栏
        cc.tween(thingNode)
            .by(0.08, { scale: 0.1 })
            .by(0.08, { scale: -0.1 })
            .to(moveTime, { position: cc.v2(535, 0) })
            .call(() => {
                //判断物品 增加数量
                if (thingName == "十字架") this.playerGotThings[0]++;
                else if (thingName == "大门钥匙") this.playerGotThings[1]++;
                else if (thingName == "床头柜钥匙") this.playerGotThings[2]++;
                else if (thingName == "木板") this.playerGotThings[3]++;
                else if (thingName == "木柴") this.playerGotThings[4]++;
                else if (thingName == "符纸") this.playerGotThings[5]++;
                else if (thingName == "遥控器") this.playerGotThings[6]++;
                //刷新物品显示
                this.refreshThingsShow();
                //恢复操作
                this.playerControl = true;
                //销毁
                thingNode.destroy();
            })
            .start();
    },

    /** 玩家使用物品 */
    playerUseThing(thingName) {
        // console.log("玩家使用" + thingName);
        //判断物品 减少数量
        if (thingName == "十字架") this.playerGotThings[0]--;
        else if (thingName == "大门钥匙") {
            //音效
            Res.playSound("锁门", false, false);
            this.playerGotThings[1]--;
        }
        else if (thingName == "床头柜钥匙") this.playerGotThings[2]--;
        else if (thingName == "木板") {
            //音效
            Res.playSound("钉木板", false, false);
            this.playerGotThings[3]--;
        }
        else if (thingName == "木柴") this.playerGotThings[4]--;
        else if (thingName == "符纸") this.playerGotThings[5]--;
        else if (thingName == "遥控器") this.playerGotThings[6]--;
        //刷新物品显示
        this.refreshThingsShow();
    },

    /** 刷新物品显示 */
    refreshThingsShow() {
        //所有节点重新排序
        for (let i = this.originalNodes.length - 1; i >= 0; i--) {
            this.originalNodes[i].setSiblingIndex(0);
        }
        //显示玩家已经获得的物品与数量
        for (let i = 0; i < this.playerGotThings.length; i++) {
            let thingNumber = this.playerGotThings[i];
            let thingIconNode = this.thingIconsNode.children[i];
            //显示物品
            if (thingNumber > 0) thingIconNode.children[0].active = true;
            else thingIconNode.children[0].active = false;
            //若物品数量大于1 则显示数量
            if (thingNumber > 1) {
                thingIconNode.children[1].active = true;
                thingIconNode.children[1].getComponent(cc.Label).string = "X" + thingNumber;
            } else {
                thingIconNode.children[1].active = false;
            }
        }
        //根据已经获得的物品排序显示物品栏
        let showNodes = [];
        for (let i = this.thingIconsNode.children.length - 1; i >= 0; i--) {
            let thingIconNode = this.thingIconsNode.children[i];
            if (thingIconNode.children[0].active) showNodes.push(thingIconNode);
        }
        for (let i = 0; i < showNodes.length; i++) {
            showNodes[i].setSiblingIndex(0);
        }

        //新手指引
        if (this.newPlayerGuideOrder == 2) this.nextNewPlayerGuide();
    },

    /** 生存计时 */
    timeLose1() {
        //游戏结束
        if (this.gameOver) return;
        this.playerLiveTime++;
        //转换并显示时间
        this.timeLabel.string = ATools.convertNumberToStringOfTime(this.playerLiveTime);
        //显示监测器有效时间
        if (this.detectorOnline) {
            if (this.detectorTime <= 0) {
                this.detectorOnline = false;
                //刷新异常提醒
                this.refreshAbnormalEffect();
                cc.find("交互显示/监测器按钮/icon_shiPin", this.uiNode).active = true;
            }
            else {
                this.detectorTime--;
                //转换并显示时间
                this.detectorTimeLabel.string = ATools.convertNumberToStringOfTime(this.detectorTime);
            }
        }

        // //每秒尝试打雷一次
        // this.thunderSound();
        // //每秒尝试一次进攻
        // this.enemyAttacked();
        //每30秒难度提升一次
        if (this.playerLiveTime % 30 == 0) {
            this.nowLevel++;
            // console.log("难度提升");
        }
        //每60秒钟表响一次
        if (this.playerLiveTime % 60 == 0 && this.playerLiveTime < 360) {
            // console.log("过了一个小时");
            let times = Math.floor(this.playerLiveTime / 60);
            // console.log(times);
            this.clockTime(times);
        }
        //坚持360秒 玩家胜利
        if (this.playerLiveTime == 360) this.gameWin();
    },

    /** 游戏逻辑计时 */
    timeLose2() {
        //游戏结束
        if (this.gameOver) return;
        //伪人攻击冷却
        this.enemyAttackTime--;
        if (this.enemyAttackTime <= 0) {
            // console.log("伪人可以攻击了");
            this.enemyAttackTime = 0;
            this.enemyCanAttack = true;
        } else {
            // console.log("伪人不可以攻击");
            // console.log("为人攻击冷却=> " + this.enemyAttackTime);
            this.enemyCanAttack = false;
        }
        //每秒尝试打雷一次
        this.thunderSound();
        //每秒尝试一次进攻
        this.enemyAttacked();
    },

    /** 钟表报时声 */
    clockTime(number) {
        for (let i = 0; i < number; i++) {
            this.scheduleOnce(() => {
                //音效
                Res.playSound("报时间", false, false);
            }, i * 2);
        }
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

    /**
     * 封锁防守点
     * @param {number} pointOrder 防守点序号
     */
    lockDefensePoints(pointOrder) {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        // console.log("玩家封锁=> " + this.POINTS_NAME[pointOrder]);
        //记录已封锁
        this.lockPoints[pointOrder] = true;
        //将此防守点从进攻点位中永久删除
        //检查可进攻点位数组
        let index1 = ATools.getIndexOfArray(this.pointsCanBeAttacked, pointOrder);
        if (index1 !== null) this.pointsCanBeAttacked.splice(index1, 1);
        //检查不可进攻点位数组
        let index2 = ATools.getIndexOfArray(this.pointsCanNotBeAttacked, pointOrder);
        if (index2 !== null) this.pointsCanNotBeAttacked.splice(index2, 1);
    },

    /** 伪人进攻 */
    enemyAttacked() {
        //游戏结束
        if (this.gameOver) return;
        //检查是否可以进攻
        if (!this.enemyCanAttack) return;
        // console.log("=====伪人进攻=====");
        // console.log("当前难度=>" + this.nowLevel);
        //伪人进攻进入冷却
        //冷却时间 
        let coolDownTime = this.attackCdByLecel[this.nowLevel] * (this.putCrossOn ? 1.1 : 1) * (this.delayAttack ? 1.1 : 1);
        //重置延缓时间
        this.delayAttack = false;
        // console.log("进攻冷却时间 " + coolDownTime);
        this.enemyAttackTime = coolDownTime;
        //记录此次进攻的点位
        let attackPoints = [];
        //根据当前难度确定攻击点位数量
        let attackNumbers =
            ATools.getRandom(this.ATTACK_POINT_NUMBER_BY_LEVEL[this.nowLevel][0], this.ATTACK_POINT_NUMBER_BY_LEVEL[this.nowLevel][1]);
        //进攻随机点位 并记录下次不可进攻
        for (let i = 0; i < attackNumbers; i++) {
            //随机点位
            let random = ATools.getRandom(0, this.pointsCanBeAttacked.length - 1);
            //记录此次进攻的点位
            let pointOrder = this.pointsCanBeAttacked.splice(random, 1)[0];
            attackPoints.push(pointOrder);
            //进攻
            this.scheduleOnce(() => {
                // console.log("伪人攻击=> " + this.POINTS_NAME[pointOrder]);
                //记录点位正在被攻击
                this.pointsBeAttcking[pointOrder] = true;
                this.pointsAttcked(pointOrder);
                //马桶警告
                if (pointOrder == 3) {
                    this.scheduleOnce(() => {
                        //音效
                        Res.playSound("伪人说话2", false, false);
                    }, 3);
                }
            }, i * this.TIME_DELAY_EACH_ATTACK);
        }
        //8级时 攻击画像
        if (this.nowLevel == 9 && !this.pointsBeAttcking[8] && !this.lockPoints[8]) {
            this.scheduleOnce(() => {
                // console.log("伪人攻击=> 画像");
                //记录点位正在被攻击
                this.pointsBeAttcking[8] = true;
                this.pointsAttcked(8);
            }, this.TIME_DELAY_EACH_ATTACK);
        }
        //所有进攻执行完成后
        this.scheduleOnce(() => {
            //将上次进攻的点位放回可进攻点位
            for (let i = this.pointsCanNotBeAttacked.length - 1; i >= 0; i--) {
                this.pointsCanBeAttacked.push(this.pointsCanNotBeAttacked.splice(i, 1)[0]);
            }
            //将此次进攻的点位放入不可进攻
            for (let i = attackPoints.length - 1; i >= 0; i--) {
                this.pointsCanNotBeAttacked.push(attackPoints.splice(i, 1)[0]);
            }
        }, this.TIME_DELAY_EACH_ATTACK + 0.1);
    },

    /**
     * 防守点被进攻
     * @param {number} n 点位序号
     */
    pointsAttcked(pointOrder) {
        // console.log(this.POINTS_NAME[pointOrder] + "被攻击");
        //游戏结束
        if (this.gameOver) return;
        //检查是否正在被攻击
        if (!this.pointsBeAttcking[pointOrder]) return;
        //检查攻击点是否已经被封锁
        if (this.lockPoints[pointOrder]) {
            this.pointsBeAttcking[pointOrder] = false;
            return;
        }
        //刷新异常提醒
        this.refreshAbnormalEffect();
        //记录进攻次数
        this.pointsAttckedTimes[pointOrder]++;
        // console.log(this.POINTS_NAME[pointOrder] + "被攻击次数" + this.pointsAttckedTimes[pointOrder]);
        //分不同情况
        let defenseNode = this.defenseNodes[pointOrder];
        //仓库门
        if (pointOrder == 0) {
            //伪人开门警告音效
            if (!this.openDoorSoundPlayed) {
                this.openDoorSoundPlayed = true;
                //音效
                Res.playSound("伪人说话1", false, false);
            }
            //音效
            Res.playSound("开门", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "开门" + this.pointsAttckedTimes[pointOrder], false);
            //每次攻击完后检查是否失败
            this.scheduleOnce(() => {
                this.checkGameLose(pointOrder);
            }, 2)
        }
        //卧室窗户
        if (pointOrder == 1) {
            //检查窗帘
            if (this.pointsAttckedTimes[pointOrder] == 3) {
                if (defenseNode.getChildByName("开窗帘").active) {
                    //拉开窗帘
                    // console.log("拉开窗帘");
                    //音效
                    Res.playSound("开关窗帘", false, false);
                    defenseNode.getChildByName("开窗帘").active = false;
                    defenseNode.getChildByName("关窗帘").active = true;
                    //每次攻击完后检查是否失败
                    this.checkGameLose(pointOrder);
                    return;
                } else {
                    //窗帘处于拉开状态 直接下一步
                    this.pointsAttckedTimes[pointOrder]++;
                }
            }
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //卫生间通风管道
        if (pointOrder == 2) {
            //音效
            Res.playSound("通风口开", false, false);
            let riseHeight = 0;
            if (this.pointsAttckedTimes[pointOrder] == 1) riseHeight = 30;
            if (this.pointsAttckedTimes[pointOrder] == 2) riseHeight = 70;
            if (this.pointsAttckedTimes[pointOrder] == 3) riseHeight = 140;
            //随着攻击次数升高
            cc.tween(defenseNode)
                .to(this.TIME_WINDOW_RISE, { y: riseHeight })
                .call(() => {
                    //检查是否失败
                    this.checkGameLose(pointOrder);
                })
                .start();
        }
        //卫生间马桶
        if (pointOrder == 3) {
            //音效
            Res.playSound("马桶冲水", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            //每次攻击完后检查是否失败
            spine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //厨房窗户1
        if (pointOrder == 4) {
            //检查窗帘
            if (this.pointsAttckedTimes[pointOrder] == 3) {
                if (defenseNode.getChildByName("开窗帘").active) {
                    //拉开窗帘
                    // console.log("拉开窗帘");
                    //音效
                    Res.playSound("开关窗帘", false, false);
                    defenseNode.getChildByName("开窗帘").active = false;
                    defenseNode.getChildByName("关窗帘").active = true;
                    //每次攻击完后检查是否失败
                    this.checkGameLose(pointOrder);
                    return;
                } else {
                    //窗帘处于拉开状态 直接下一步
                    this.pointsAttckedTimes[pointOrder]++;
                }
            }
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //厨房窗户2
        if (pointOrder == 5) {
            //检查窗帘
            if (this.pointsAttckedTimes[pointOrder] == 3) {
                if (defenseNode.getChildByName("开窗帘").active) {
                    //拉开窗帘
                    // console.log("拉开窗帘");
                    //音效
                    Res.playSound("开关窗帘", false, false);
                    defenseNode.getChildByName("开窗帘").active = false;
                    defenseNode.getChildByName("关窗帘").active = true;
                    //每次攻击完后检查是否失败
                    this.checkGameLose(pointOrder);
                    return;
                } else {
                    //窗帘处于拉开状态 直接下一步
                    this.pointsAttckedTimes[pointOrder]++;
                }
            }
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //壁炉火
        if (pointOrder == 6) {
            //音效
            Res.playSound("火焰熄灭", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            if (this.pointsAttckedTimes[pointOrder] == 1) spine.setAnimation(0, "中", true);
            if (this.pointsAttckedTimes[pointOrder] == 2) spine.setAnimation(0, "小", false);
            if (this.pointsAttckedTimes[pointOrder] == 3) spine.setAnimation(0, "灭", false);
            //每次攻击完后检查是否失败
            this.checkGameLose(pointOrder);
        }
        //娱乐房电视
        if (pointOrder == 7) {
            let attackOrder = this.pointsAttckedTimes[pointOrder];
            //电视音效
            if (attackOrder == 1) {
                this.tvSound = Res.playSound("电视雪花故障", false, true);
            } else if (attackOrder == 3) {
                if (this.tvSound) cc.audioEngine.stopEffect(this.tvSound);
                Res.playSound("电视鬼脸出现", false, false);
            }
            //慢慢显示
            if (defenseNode.opacity < 255) {
                cc.tween(defenseNode)
                    .to(1, { opacity: 255 })
                    .start();
            }
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "" + attackOrder, true);
            //每次攻击完后检查是否失败
            this.checkGameLose(pointOrder);
        }
        //娱乐房画
        if (pointOrder == 8) {
            //画像异常音效
            this.portraitSoundPlay();
            //慢慢显示
            if (defenseNode.opacity < 255) {
                cc.tween(defenseNode)
                    .to(1, { opacity: 255 })
                    .start();
            }
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "" + this.pointsAttckedTimes[pointOrder], true);
            //每次攻击完后检查是否失败
            this.checkGameLose(pointOrder);
        }
        //娱乐房窗户
        if (pointOrder == 9) {
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //餐厅门
        if (pointOrder == 10) {
            //伪人开门警告音效
            if (!this.openDoorSoundPlayed) {
                this.openDoorSoundPlayed = true;
                //音效
                Res.playSound("伪人说话1", false, false);
            }
            //音效
            Res.playSound("开门", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "开门" + this.pointsAttckedTimes[pointOrder], false);
            //每次攻击完后检查是否失败
            this.scheduleOnce(() => {
                this.checkGameLose(pointOrder);
            }, 2)
        }
        //餐厅窗户1
        if (pointOrder == 11) {
            //可以出现监控伪人
            this.showMonitorEnemy = true;
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
        //餐厅窗户2
        if (pointOrder == 12) {
            //播放打开动画
            let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            windowSpine.setAnimation(0, "开" + this.pointsAttckedTimes[pointOrder], false);
            windowSpine.setEventListener(() => {
                this.scheduleOnce(() => {
                    //音效
                    Res.playSound("开窗户", false, false);
                });
            });
            //每次攻击完后检查是否失败
            windowSpine.setCompleteListener(() => {
                this.checkGameLose(pointOrder);
            });
        }
    },

    /** 画像异常音效 */
    portraitSoundPlay() {
        //游戏结束
        if (this.gameOver) return;
        //检测攻击
        if (!this.pointsBeAttcking[8]) return;
        //播放音效
        this.portraitSound = Res.playSound("画像异常", false, false);
        //间隔三秒播放
        this.scheduleOnce(() => {
            this.portraitSoundPlay()
        }, 8.5);
    },

    /** 检查当前点位是否失败 */
    checkGameLose(pointOrder) {
        //新手限制
        if (this.newPlayerGuideOrder == 3) {
            //新手指引
            this.nextNewPlayerGuide();
            return;
        }
        //游戏结束
        if (this.gameOver) return;
        //完全攻破 判定输赢 
        if (this.pointsAttckedTimes[pointOrder] >= this.POINTS_ATTACKED_NUMBER[pointOrder]) this.gameLose(pointOrder);
        //没有完全攻破 则继续攻击
        else {
            this.scheduleOnce(() => {
                this.pointsAttcked(pointOrder);
            }, this.pointsAttackedTime[pointOrder][this.nowLevel]);
        }
    },

    /** 玩家防守点位 */
    playerDefensePoint(pointOrder, all) {
        // console.log("触发防守=> " + this.POINTS_NAME[pointOrder]);
        // console.log("this.playerControl=> " + this.playerControl);
        // console.log("this.gameOver=> " + this.gameOver);
        // console.log("正在攻击=> " + this.pointsBeAttcking[pointOrder]);
        //新手限制
        if (GameData.userData.newPlayer && pointOrder !== 1) return;
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //新手
        if (GameData.userData.newPlayer && this.newPlayerGuideOrder !== 4) return;
        // console.log("点击");
        if (!all && !GameData.userData.newPlayer) {
            //如果没有进攻 则不用防守
            if (!this.pointsBeAttcking[pointOrder]) {
                //门点击
                if (pointOrder == 0) this.showTip("仓库门没有异常");
                if (pointOrder == 10) this.showTip("大门没有异常");
                //窗户
                if (pointOrder == 1 || pointOrder == 4 || pointOrder == 5 || pointOrder == 9 || pointOrder == 11 || pointOrder == 12)
                    this.showTip("窗户没有异常");
                //通风管道
                if (pointOrder == 2) this.showTip("通风管道没有异常");
                //马桶
                if (pointOrder == 3) this.showTip("马桶没有异常");
                //电视机
                if (pointOrder == 7) this.showTip("电视机没有异常");
                return;
            }
            //正在被攻击的门点击
            if ((pointOrder == 0 || pointOrder == 10) && !(this.lockPoints[0] || this.lockPoints[10]))
                this.showTip("我需要大门钥匙");
        }
        if (!this.pointsBeAttcking[pointOrder]) return;
        //防守
        // console.log("玩家成功防守=> " + this.POINTS_NAME[pointOrder]);
        //阻止进攻
        this.pointsBeAttcking[pointOrder] = false;
        //刷新异常提醒
        this.refreshAbnormalEffect();
        //重置攻击点位
        //分不同情况
        let defenseNode = this.defenseNodes[pointOrder];
        //仓库门
        if (pointOrder == 0) {
            //音效
            Res.playSound("关门", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "关门" + this.pointsAttckedTimes[pointOrder], false);
        }
        //卧室窗户
        if (pointOrder == 1) {
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //重置动画
            // spine.clearTrack(0);
            // spine.setToSetupPose();
            //关闭动画
            if (this.pointsAttckedTimes[pointOrder] == 3) spine.setAnimation(0, "关2", false);
            else spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
            //新手指引
            if (this.newPlayerGuideOrder == 4) {
                this.scheduleOnce(() => {
                    this.playerControl = false;
                    this.nextNewPlayerGuide();
                }, 1.5);
            }
        }
        //卫生间通风管道
        if (pointOrder == 2) {
            if (this.enemyNodes[0].active) this.enemyNodes[0].active = false;
            //音效
            Res.playSound("通风口关", false, false);
            //通风管道门归位
            cc.tween(defenseNode)
                .to(this.TIME_WINDOW_RISE, { y: 0 })
                .start();
        }
        //卫生间马桶
        if (pointOrder == 3) {
            if (this.enemyNodes[1].active) this.enemyNodes[1].active = false;
            //音效
            Res.playSound("关马桶", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }
        //厨房窗户1
        if (pointOrder == 4) {
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //关闭动画
            if (this.pointsAttckedTimes[pointOrder] == 3) spine.setAnimation(0, "关2", false);
            else spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }
        //厨房窗户2
        if (pointOrder == 5) {
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //关闭动画
            if (this.pointsAttckedTimes[pointOrder] == 3) spine.setAnimation(0, "关2", false);
            else spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }
        //壁炉火
        if (pointOrder == 6) {
            if (this.enemyNodes[2].active) this.enemyNodes[2].active = false;
            //音效
            Res.playSound("火焰燃烧", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "大", true);
        }
        //娱乐房电视
        if (pointOrder == 7) {
            //音效
            Res.playSound("关闭电视", false, false);
            if (this.tvSound) cc.audioEngine.stopEffect(this.tvSound);
            //播放动画
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "1", true);
            //慢慢消失
            if (defenseNode.opacity > 0) {
                cc.tween(defenseNode)
                    .to(this.TIME_WINDOW_RISE, { opacity: 0 })
                    .start();
            }
        }
        //娱乐房画
        if (pointOrder == 8) {
            //停止画像音效
            if (this.portraitSound !== null) cc.audioEngine.stopEffect(this.portraitSound);
            //音效
            Res.playSound("画像镇压", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            spine.setAnimation(0, "1", true);
            //慢慢消失
            if (defenseNode.opacity > 0) {
                cc.tween(defenseNode)
                    .to(this.TIME_WINDOW_RISE, { opacity: 0 })
                    .start();
            }
        }
        //娱乐房窗户
        if (pointOrder == 9) {
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //关闭动画
            spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }
        //餐厅门
        if (pointOrder == 10) {
            //音效
            Res.playSound("关门", false, false);
            let spine = defenseNode.getComponent(sp.Skeleton);
            //关闭动画
            spine.setAnimation(0, "关门" + this.pointsAttckedTimes[pointOrder], false);
        }
        //餐厅窗户1
        if (pointOrder == 11) {
            //防守后一定延迟后关闭监控视角伪人
            this.scheduleOnce(() => {
                if (this.showMonitorEnemy == true) this.showMonitorEnemy = false;
            }, this.TIME_DELAY_CLOSE_MONITOR_ENEMY);
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //关闭动画
            spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }
        //餐厅窗户2
        if (pointOrder == 12) {
            //音效
            Res.playSound("关窗户", false, false);
            let spine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
            //关闭动画
            spine.setAnimation(0, "关" + this.pointsAttckedTimes[pointOrder], false);
        }

        //重置攻击点次数
        this.pointsAttckedTimes[pointOrder] = 0;
    },

    /** 游戏胜利 */
    gameWin() {
        console.log("玩家胜利");
        //停止操作和敌人进攻
        this.playerControl = false;
        this.enemyCanAttack = false;
        //游戏结束
        this.gameOver = true;
        if (this.tempNode) this.tempNode.destroy();
        //停止画像音效
        if (this.portraitSound !== null) cc.audioEngine.stopEffect(this.portraitSound);
        //关闭UI
        this.uiNode.getChildByName("交互显示").opacity = 0;
        //记录用户数据
        GameData.userData.ending[0] = 1;
        GameData.saveUserData();
        //公鸡打鸣音效
        Res.playSound("公鸡打鸣", false, false);
        //显示钟表动画
        this.uiNode.getChildByName("钟表").active = true;
        let clockSpine = this.uiNode.getChildByName("钟表").getComponent(sp.Skeleton);
        clockSpine.setAnimation(0, "animation", false);
        //钟表声响
        clockSpine.setEventListener(() => {
            //音效
            Res.playSound("报时间", false, false);
        });
        //结束
        clockSpine.setCompleteListener(() => {
            // this.uiNode.getChildByName("钟表").active = false;
            //显示胜利界面
            let winNode = this.uiNode.getChildByName("游戏胜利");
            winNode.active = true;
            cc.tween(winNode)
                .to(0.5, { opacity: 255 })
                .call(() => {
                    Res.playSound("游戏胜利", false, false);
                })
                .start();
        });
        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing(true);
        }
    },

    /**
     * 游戏失败
     * @param {number} pointOrder 伪人突破点位
     */
    gameLose(pointOrder) {
        if (this.gameOver) return;
        //游戏结束
        this.gameOver = true;
        if (this.tempNode) this.tempNode.destroy();
        console.log("玩家失败 " + this.POINTS_NAME[pointOrder] + "被攻破");
        //停止操作和敌人进攻
        this.playerControl = false;
        this.enemyCanAttack = false;
        //停止画像音效
        if (this.portraitSound !== null) cc.audioEngine.stopEffect(this.portraitSound);
        //根据失败的地方转移画面
        for (let i = 0; i < this.ROOMS_POINTS.length; i++) {
            let roomspoint = this.ROOMS_POINTS[i];
            if (pointOrder == roomspoint.point) {
                //转换场景
                this.nowRoomOrder = roomspoint.room;
                this.refreshRoomsShow();
                break;
            }
        }
        //关闭UI
        this.uiNode.getChildByName("交互显示").opacity = 0;

        //关灯动画
        this.lightOutSpine.node.active = true;
        this.lightOutSpine.setAnimation(0, "animation", false);
        this.lightOutSpine.setCompleteListener(() => {

            //特殊
            if (pointOrder == 2 || pointOrder == 3 || pointOrder == 6) {
                //通风口
                if (pointOrder == 2) {
                    if (!this.enemyNodes[0].active) this.enemyNodes[0].active = true;
                    let spine = this.enemyNodes[0].getComponent(sp.Skeleton);
                    spine.setAnimation(0, "animation", false);
                }
                //马桶
                if (pointOrder == 3) {
                    if (!this.enemyNodes[1].active) this.enemyNodes[1].active = true;
                    let spine = this.enemyNodes[1].getComponent(sp.Skeleton);
                    spine.setAnimation(0, "animation", false);
                }
                //壁炉
                else if (pointOrder == 6) {
                    if (!this.enemyNodes[2].active) this.enemyNodes[2].active = true;
                    let spine = this.enemyNodes[2].getComponent(sp.Skeleton);
                    spine.setAnimation(0, "出现", false);
                    spine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        this.scheduleOnce(() => {
                            spine.setAnimation(0, "待机", true);
                        });
                    });
                }
            }
            //画像 电视
            else if (pointOrder == 7 || pointOrder == 8) { }
            //门窗
            else {
                //分不同情况
                let defenseNode = this.defenseNodes[pointOrder];
                //仓库门
                if (pointOrder == 0) {
                    let spine = defenseNode.getComponent(sp.Skeleton);
                    spine.setAnimation(0, "攻击", false);
                }
                //卧室窗户
                if (pointOrder == 1) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
                //厨房窗户1
                if (pointOrder == 4) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
                //厨房窗户2
                if (pointOrder == 5) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
                //娱乐房窗户
                if (pointOrder == 9) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
                //餐厅门
                if (pointOrder == 10) {
                    let spine = defenseNode.getComponent(sp.Skeleton);
                    spine.setAnimation(0, "攻击", false);
                }
                //餐厅窗户1
                if (pointOrder == 11) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
                //餐厅窗户2
                if (pointOrder == 12) {
                    let windowSpine = cc.find("遮罩/窗户", defenseNode).getComponent(sp.Skeleton);
                    windowSpine.setAnimation(0, "出现", false);
                    windowSpine.setCompleteListener((a, evt) => {
                        if (a.animation.name !== "出现") return;
                        windowSpine.setAnimation(0, "待机", false);
                    });
                }
            }
            //音效
            Res.playSound("伪人现身", false, false);

            let time = (pointOrder == 0 || pointOrder == 10) ? 1.8 : 3;
            //延迟后显示鬼影
            this.scheduleOnce(() => {
                //创建鬼影
                let ghostShadow = cc.instantiate(Res.loadPrefab("死亡鬼影"));
                ghostShadow.parent = this.uiNode;
                ghostShadow.position = cc.v2(0, 0);
                //音效
                Res.playSound("突脸", false, false);
                let spine = ghostShadow.getComponent(sp.Skeleton);
                spine.setAnimation(0, "animation", false);
                //动画播放完毕
                spine.setCompleteListener(() => {
                    ghostShadow.destroy();
                    //显示失败界面
                    this.showGameLose(pointOrder);
                });
            }, time);

        });

        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing(true);
        }

    },

    /** 显示失败界面 */
    showGameLose(pointOrder) {
        //记录死亡地点
        this.deadPoint = pointOrder;
        //根据死亡地点判断显示哪种死亡类型
        let dead = null;
        for (let i = 0; i < this.ROOMS_POINTS.length; i++) {
            let roomspoint = this.ROOMS_POINTS[i];
            if (roomspoint.point == pointOrder) {
                dead = roomspoint.deadType;
                break;
            }
        }
        //记录用户数据
        GameData.userData.ending[dead + 1] = 1;
        GameData.saveUserData();
        //失败音效
        Res.playSound("游戏失败", false, false);
        //显示对应的死亡类型
        let gameLoseNode = this.uiNode.getChildByName("游戏失败");
        gameLoseNode.active = true;
        gameLoseNode.getChildByName("show").children[dead].active = true;
        //播放死亡结局动画
        if (dead < 6) {
            if (dead == 0 || dead == 5) this.deadSpines[dead].setAnimation(0, "animation", false);
            else this.deadSpines[dead].setAnimation(0, "animation", true);
        }
        // this.scheduleOnce(() => {
        //     //游戏内逻辑暂停
        //     cc.director.pause();
        // }, 4);
    },

    /** 复活 */
    btnRevive() {
        // //恢复游戏
        // cc.director.resume();
        //点击
        this.clickSound();
        //看视频后恢复
        AD.showAD(() => {
            //继续游戏
            this.gameOver = false;
            //恢复玩家操作和敌人攻击
            this.playerControl = true;
            this.enemyCanAttack = true;
            //所有被攻击点位恢复
            for (let i = 0; i < this.pointsBeAttcking.length; i++) {
                if (this.pointsBeAttcking[i]) this.playerDefensePoint(i, true);
            }
            //关闭死亡结算界面
            let gameLoseNode = this.uiNode.getChildByName("游戏失败");
            for (let i = 0; i < gameLoseNode.getChildByName("show").children.length; i++) {
                gameLoseNode.getChildByName("show").children[i].active = false;
            }
            gameLoseNode.active = false;
            //关闭UI
            this.uiNode.getChildByName("交互显示").opacity = 255;
            //关灯动画
            this.lightOutSpine.node.active = false;
        }, this);
    },


    /** 监控按钮 */
    btnMonitor() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //新手限制
        if (GameData.userData.newPlayer) return;
        //点击
        this.clickSound();
        //显示弹窗
        this.monitorViewNode.active = true;
        cc.tween(this.monitorViewNode.getChildByName("弹窗"))
            .to(0.15, { scale: 1.1 })
            .to(0.1, { scale: 1 })
            .start();
        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing();
        }
    },

    /** 激活监控 */
    btnActivateMonitor() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //激活中点击转到监控视角
        if (!cc.find("交互显示/监控按钮/icon_shiPin", this.uiNode).active) {
            this.changeRoom(null, 7);
        } else {
            //没激活则广告激活
            AD.showAD(() => {
                this.monitorOnline = true;
                this.btnCloseMonitorView();
                //自动转到监控画面
                this.changeRoom(null, 7);
                //去掉视频图标
                cc.find("交互显示/监控按钮/icon_shiPin", this.uiNode).active = false;
            }, this);
        }
    },

    /** 关闭监控界面 */
    btnCloseMonitorView() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //关闭监控界面
        let node = this.monitorViewNode.getChildByName("弹窗");
        cc.tween(node)
            .to(0.1, { scale: 1.1 })
            .to(0.15, { scale: 0 })
            .call(() => {
                this.monitorViewNode.active = false;
            })
            .start();
    },

    /** 监测器按钮 */
    btnDetector() {
        //新手限制
        if (GameData.userData.newPlayer) return;
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //打开监测器页面
        this.detectorViewNode.active = true;
        let node = this.detectorViewNode.getChildByName("弹窗");

        //判断是都已经激活监测器
        if (this.detectorOnline) {
            // node.getChildByName("使用按钮").active = false;
            node.getChildByName("使用中").active = true;
        } else {
            // node.getChildByName("使用按钮").active = true;
            node.getChildByName("使用中").active = false;
        }

        cc.tween(node)
            .to(0.15, { scale: 1.1 })
            .to(0.1, { scale: 1 })
            .start();
        //广告
        if (AD.wuDianRate > 0) {
            AD.showBanner();
            AD.chaPing();
        }
    },

    /** 关闭监测器界面 */
    btnCloseDetectorView() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //关闭暂停界面
        let node = this.detectorViewNode.getChildByName("弹窗");
        cc.tween(node)
            .to(0.1, { scale: 1.1 })
            .to(0.15, { scale: 0 })
            .call(() => {
                this.detectorViewNode.active = false;
            })
            .start();
    },

    /** 激活监测器 */
    btnActivateDetector() {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        if (cc.find("交互显示/监测器按钮/icon_shiPin", this.uiNode).active) {
            AD.showAD(() => {
                //计时
                this.detectorTime = 120;
                //激活
                this.detectorOnline = true;
                cc.find("交互显示/监测器按钮/icon_shiPin", this.uiNode).active = false;
                //关闭监测器界面
                this.btnCloseDetectorView();
                //刷新异常提醒
                this.refreshAbnormalEffect();
            }, this);
        } else {
            //打开监测器页面
            this.detectorViewNode.active = true;
            let node = this.detectorViewNode.getChildByName("弹窗");

            //判断是都已经激活监测器
            if (this.detectorOnline) {
                node.getChildByName("使用按钮").active = false;
                node.getChildByName("使用中").active = true;
            } else {
                // node.getChildByName("使用按钮").active = true;
                // node.getChildByName("使用中").active = false;
            }

            cc.tween(node)
                .to(0.15, { scale: 1.1 })
                .to(0.1, { scale: 1 })
                .start();
        }
    },

    /** 刷新异常提醒显示 */
    refreshAbnormalEffect() {
        //没有激活时不显示异常提示
        if (!this.detectorOnline) this.abnormalEffectNode.opacity = 0;
        else this.abnormalEffectNode.opacity = 255;
        //重置
        let node = this.abnormalEffectNode.getChildByName("异响");
        node.getChildByName("1").opacity = 0;
        let node1 = node.getChildByName("1").getChildByName("名称");
        for (let i = 0; i < node1.children.length; i++) {
            node1.children[i].opacity = 0;
        }
        node.getChildByName("2").opacity = 0;
        let node2 = node.getChildByName("2").getChildByName("名称");
        for (let i = 0; i < node2.children.length; i++) {
            node2.children[i].opacity = 0;
        }

        // console.log("攻击点位");
        // console.log(this.POINTS_NAME);
        // console.log(this.pointsBeAttcking);
        // console.log("封锁点位");
        // console.log(this.lockPoints);

        //判断当前有没有被攻击的点位 并记录被攻击的房间
        let attackedRooms = [];
        for (let i = 0; i < this.pointsBeAttcking.length; i++) {
            if (this.pointsBeAttcking[i]) {
                // console.log("检测到" + this.POINTS_NAME[i] + "正在被攻击");
                //辨别被攻击点位的所在房间
                for (let j = 0; j < this.ROOMS_POINTS.length; j++) {
                    let roomspoint = this.ROOMS_POINTS[j];
                    if (roomspoint.point == i) {
                        //记录被攻击的房间
                        attackedRooms.push(roomspoint.room);
                        break;
                    }
                }
            }
        }
        //当前是否正在被攻击
        if (attackedRooms.length > 0) {
            this.abnormalEffectNode.getChildByName("暂无异响").opacity = 0;

            let node = this.abnormalEffectNode.getChildByName("异响");
            node.opacity = 255;
            //显示被攻击房间
            node.getChildByName("1").opacity = 255;
            node.getChildByName("1").getChildByName("名称").children[attackedRooms[0]].opacity = 255;
            if (attackedRooms.length > 1) {
                node.getChildByName("2").opacity = 255;
                node.getChildByName("2").getChildByName("名称").children[attackedRooms[1]].opacity = 255;
            }
        }
        else if (attackedRooms.length == 0) {
            this.abnormalEffectNode.getChildByName("暂无异响").opacity = 255;
            this.abnormalEffectNode.getChildByName("异响").opacity = 0;
        }

        //刷新心跳
        if (attackedRooms.length == 0) this.heartTime = 0.6;
        if (attackedRooms.length == 1) this.heartTime = 0.4;
        if (attackedRooms.length == 2) this.heartTime = 0.2;
        //重置心跳缓动
        if (this.heartTween !== null) this.heartTween.stop();
        //心跳缓动
        this.heartTween = cc.tween(this.heartNode)
            .repeatForever(
                cc.tween()
                    .to(0.1, { scale: 1.2 })
                    .to(0.3, { scale: 1 })
                    .delay(this.heartTime)
            )
        this.heartTween.start();

    },

    /** 暂停游戏 */
    btnGamePause() {
        //游戏结束
        if (this.gameOver) return;
        //点击
        this.clickSound();
        //显示暂停界面
        this.gamePuaseViewNode.active = true;
        let node = this.gamePuaseViewNode.getChildByName("弹窗");
        cc.tween(node)
            .to(0.15, { scale: 1.1 })
            .to(0.1, { scale: 1 })
            .call(() => {
                //广告
                if (AD.wuDianRate > 0) {
                    AD.showBanner();
                    AD.chaPing();
                }
                //暂停游戏
                cc.director.pause();
            })
            .start();
    },

    /** 继续游戏 */
    btnGameContinue() {
        //恢复游戏
        cc.director.resume();
        //点击
        this.clickSound();
        //关闭暂停界面
        let node = this.gamePuaseViewNode.getChildByName("弹窗");
        cc.tween(node)
            .to(0.1, { scale: 1.1 })
            .to(0.15, { scale: 0 })
            .call(() => {
                this.gamePuaseViewNode.active = false;
            })
            .start();
    },

    /** 重新开始 */
    btnGameAgain() {
        //恢复游戏
        cc.director.resume();
        //点击
        this.clickSound();
        //重新加载游戏场景
        cc.director.loadScene("GameScene");
    },

    /** 返回主界面 */
    btnBackMain() {
        //恢复游戏
        cc.director.resume();
        //点击
        this.clickSound();
        //加载主界面
        cc.director.loadScene("MainScene");
    },

    /** 场景栏移动 */
    moveRoomsUI(event, cData) {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //向下
        if (cData == "1") {
            cc.tween(this.roomIconsNode)
                .to(0.2, { y: 550 })
                .start();
        }
        //向上
        else if (cData == "2") {
            cc.tween(this.roomIconsNode)
                .to(0.2, { y: 314 })
                .start();
        }
    },

    /** 道具栏移动 */
    moveThingsUI(event, cData) {
        //游戏结束
        if (!this.playerControl || this.gameOver) return;
        //点击
        this.clickSound();
        //向下
        if (cData == "1") {
            cc.tween(this.thingIconsNode)
                .to(0.2, { y: 530 })
                .start();
        }
        //向上
        else if (cData == "2") {
            cc.tween(this.thingIconsNode)
                .to(0.2, { y: 225 })
                .start();
        }
    },

    /** 玩家提示 */
    showTip(word) {
        //创建提示
        let tip = cc.instantiate(Res.loadPrefab("提示栏"));
        tip.parent = this.uiNode;
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

    /** 点击 */
    clickSound() {
        Res.playSound("点击", false, false);
    },

});
