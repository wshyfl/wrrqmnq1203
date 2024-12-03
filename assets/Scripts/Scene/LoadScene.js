

cc.Class({
    extends: cc.Component,

    properties: {
        /** 进度条节点 */
        barNode: cc.Node,
    },

    onLoad() {
        //清除玩家数据
        // cc.sys.localStorage.clear();

        GameData.getUserData();
    },

    start() {
        this.bar = { length: 0 };
        cc.tween(this.bar)
            .to(5, { length: 1 })
            .start();
    },

    update(dt) {
        this.barNode.getComponent(cc.Sprite).fillRange = this.bar.length;
    },
});
