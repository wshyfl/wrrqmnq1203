window.GameData = {

    //获取用户数据
    getUserData() {
        let item = cc.sys.localStorage.getItem(this._USER_DATA);
        // console.log(item)
        if (item == undefined || item == null || item.length == 0) {
            console.log("新用户");
            this.saveUserData();
        } else {
            console.log("老用户");
            this.checkUserData(JSON.parse(item));
        }
    },

    //存储用户数据
    saveUserData() {
        console.log("存储用户数据");
        cc.sys.localStorage.setItem(this._USER_DATA, JSON.stringify(this.userData));
    },

    //检测用户数据
    checkUserData(tempData) {
        // GameData.log("校验前数据1：" + JSON.stringify(tempData));
        if (tempData.dataVersion == null || tempData.dataVersion == undefined || tempData.dataVersion < this.userData.dataVersion) {
            //数据不统一
            let tmp = [];
            for (let dataKey in this.userData) {
                if (tempData.hasOwnProperty(dataKey)) {
                    //有这个属性
                    if (Array.isArray(tempData[dataKey])) {
                        for (let i = 0; i < tempData[dataKey].length; i++) {
                            //一维数组
                            if (Array.isArray(tempData[dataKey][i])) {
                                //二维数组
                                for (let j = 0; j < tempData[dataKey][i].length; j++) {
                                    this.userData[dataKey][i][j] = tempData[dataKey][i][j]
                                }
                            }
                            this.userData[dataKey][i] = tempData[dataKey][i];
                        }
                        tempData[dataKey] = this.userData[dataKey];
                    } else {
                        // console.log("not array")
                    }
                } else {
                    tmp.push(dataKey)
                }
            }
            for (let i = 0; i < tmp.length; i++) {
                let dateKey = tmp[i];
                if (!tempData.hasOwnProperty(dateKey)) {
                    //没有这个属性
                    tempData[dateKey] = this.userData[dateKey]
                }
            }
            tempData.dataVersion = this.userData.dataVersion;
            this.userData = tempData;
            this.saveUserData();
            console.log("用户数据更新");
        } else {
            this.userData = tempData;
            console.log("用户数据正常");
        }
    },

    /** 游戏数据存储 */
    _USER_DATA: "WEIRENYOUXIRUQIN",
    /** 用户数据 */
    userData: {
        /** 数据版本 */
        dataVersion: 1,
        /** 是否首次游玩 */
        newPlayer: true,
        /** 是否解锁恐怖模式 */
        mode2Unlock: false,
        /**
         * 游戏结局
         * 好结局
         * 0
         * 坏结局
         * 1 - 7
         */
        ending: [0, 0, 0, 0, 0, 0, 0, 0],
    },

    /** 游戏模式 1正常 2恐怖 */
    gameMode: 0,

    /** 各个点位被攻击间隔冷却时间（点位）（当前难度等级）（正常模式） */
    POINTS_ATTACKED_TIME_MODE_1: [
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 12, 11, 11, 10, 10, 9, 9, 8, 8, 6],
        [15, 15, 12, 11, 11, 10, 10, 9, 9, 8, 8, 6],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 15, 13, 13, 13, 12, 11, 10, 9, 8, 7],
        [15, 15, 10, 13, 13, 10, 10, 9, 9, 7, 6, 5],
        [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 12, 12, 11, 10, 8, 8, 6, 5, 4, 3],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
        [15, 15, 12, 11, 11, 10, 8, 7, 6, 5, 4, 4],
    ],
    /** 各个点位被攻击间隔冷却时间（点位）（当前难度等级）（恐怖模式） */
    POINTS_ATTACKED_TIME_MODE_2: [
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [12, 12, 10, 10, 9, 8, 7, 7, 6, 6, 5, 5],
        [10, 10, 8, 8, 6, 5, 5, 4, 4, 4, 4, 4],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [15, 15, 12, 10, 9, 8, 7, 7, 7, 6, 6, 6],
        [15, 15, 10, 13, 13, 10, 10, 9, 9, 7, 6, 5],
        [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [10, 10, 9, 9, 7, 6, 5, 5, 4, 4, 3, 3],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3],
        [10, 10, 8, 8, 6, 5, 4, 4, 3, 3, 3, 3]
    ],

    /** 难度对应的攻击冷却时间（正常）*/
    ATTACK_CD_BY_LEVEL_1: [35, 35, 35, 30, 28, 26, 26, 24, 22, 20, 18, 18],
    /** 难度对应的攻击冷却时间（恐怖）*/
    ATTACK_CD_BY_LEVEL_2: [32, 32, 32, 28, 26, 25, 22, 20, 20, 18, 15, 15],

    /** 首次进攻延迟时间（正常） */
    TIME_DELAY_FIRST_ATTACK_1: 45,
    /** 首次进攻延迟时间（恐怖） */
    TIME_DELAY_FIRST_ATTACK_2: 40,

}