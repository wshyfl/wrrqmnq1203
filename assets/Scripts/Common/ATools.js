if (CC_EDITOR) {
    // 重写update方法 达到在编辑模式下 自动播放动画的功能
    sp.Skeleton.prototype['update'] = function (dt) {
        if (CC_EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }
        if (this.paused) return;
        dt *= this.timeScale * sp['timeScale'];
        if (this.isAnimationCached()) {
            // Cache mode and has animation queue.
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    let frameCache = this._frameCache;
                    if (frameCache && frameCache.isInvalid()) {
                        frameCache.updateToFrame();
                        let frames = frameCache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }
                    return;
                }
                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift();
                }
                this._accTime += dt;
                if (this._accTime > this._headAniInfo.delay) {
                    let aniInfo = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                }
                return;
            }
            this._updateCache(dt);
        } else {
            this._updateRealtime(dt);
        }
    }
}

window.ATools = {

    /**
     * 返回数组中的随机一个元素
     * @param {Array} arr 数组
     * @returns 数组中的随机一个元素 若传入的数组长度为0 则返回null
     */
    getRandomOfArray(arr) {
        if (arr.length) {
            return arr[this.getRandom(0, arr.length - 1)];
        } else {
            return null;
        }
    },

    /**
     * 返回数组中的某个元素的下标
     * @param {Array} arr 
     * @param {*} target 
     * @returns 数组中的该元素的下标 若数组中不存在该元素 则返回null 若数组中存在多个该元素 则返回最前面一个符合元素的下标 
     */
    getIndexOfArray(arr, target) {
        let index = null;
        //遍历数组 
        for (let i = 0; i < arr.length; i++) {
            if (target === arr[i]) {
                index = i;
                break;
            }
        }
        return index;
    },

    /**
     * 获取一个随机整数数（包括上下限）
     * @param {number} min 范围下限
     * @param {number} max 范围上线
     * @returns number 随机的数字结果
     */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * 求两点之间的距离
     * @param {cc.Vec2} pos1 
     * @param {cc.Vec2} pos2 
     * @returns number
     */
    getDistanceByPoints(pos1, pos2) {
        let x = Math.abs(pos2.x - pos1.x);
        let y = Math.abs(pos2.y - pos1.y);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },

    /**
     * 求两点之间的距离
     * @param {cc.Node} node1 
     * @param {cc.Node} node2 
     * @returns number
     */
    getDistanceByNodes(node1, node2) {
        let x = Math.abs(node2.x - node1.x);
        let y = Math.abs(node2.y - node1.y);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },

    /**
     * 得到两个点形成的线在坐标中的弧度
     * @param {cc.Vec2} pos1 
     * @param {cc.Vec2} pos2 
     * @returns number 弧度
     */
    getRadianByPoints(pos1, pos2) {
        return Math.atan2((pos2.y - pos1.y), (pos2.x - pos1.x));
    },

    /**
     * 得到两个点形成的线在坐标中的角度
     * @param {cc.Vec2} pos1 
     * @param {cc.Vec2} pos2 
     * @returns number 角度
     */
    getAngleByPoints(pos1, pos2) {
        return Math.atan2((pos2.y - pos1.y), (pos2.x - pos1.x)) * 180 / Math.PI;
    },

    /**
     * 将数字格式的时间转换为24小时制字符串形式 例：12:03 09:28
     * @param {number} timeNumber 数字格式时间 应大于等于0 小于等于1440
     * @returns 24小时制字符串形式时间 例："12:03" "09:28"
     */
    convertNumberToStringOfTime(timeNumber) {
        let h = Math.floor(timeNumber / 60);
        let m = timeNumber - 60 * h;
        let timeString = "";
        if (h < 10) timeString += "0" + h;
        else timeString += h;
        timeString += ":";
        if (m < 10) timeString += "0" + m;
        else timeString += m;
        return timeString;
    },

    /**
     * 获取时间
     * @param {string} timeType 时间类型 年月日等
     * @returns number 
     */
    getDate(timeType) {
        var date = new Date();
        switch (timeType) {
            //获取当前年份(2位)
            case "year":
                return date.getYear();
            //获取完整的年份(4位,1970-????)
            case "fullYear":
                return date.getFullYear();
            //获取当前月份
            case "month":
                return date.getMonth() + 1;
            //获取当前日(1-31)
            case "day":
                return date.getDate();
            //获取当前星期X(0-6,0代表星期天)
            case "week":
                return date.getDay();
            //获取当前时间(从1970.1.1开始的毫秒数)
            case "millisecond":
                return date.getTime();
            //获取当前小时数(0-23)
            case "hour":
                return date.getHours();
            //获取当前分钟数(0-59)
            case "minute":
                return date.getMinutes();
            //获取当前秒数(0-59)
            case "second":
                return date.getSeconds();
            //获取当前秒数(0-59)
            case "second":
                return date.getSeconds();
            //获取当前秒数(0-59)
            case "second":
                return date.getSeconds();
            //获取当前毫秒数(0-999)
            case "milliSecond":
                return date.getMilliseconds();
        }
    },

    /**
     * 获取当前日期 字符串形式 如20001208
     * @returns string 
     */
    getNowDate() {
        //年
        let year = this.getDate("fullYear").toString();
        //月
        let monthNumber = this.getDate("month");
        let month = null;
        if (monthNumber < 10) {
            month = "0" + monthNumber.toString();
        } else {
            month = monthNumber.toString();
        }
        //日
        let dayNumber = this.getDate("day");
        let day = null;
        if (dayNumber < 10) {
            day = "0" + dayNumber.toString();
        } else {
            day = dayNumber.toString();
        }
        //组合返回
        return year + month + day;
    },

}