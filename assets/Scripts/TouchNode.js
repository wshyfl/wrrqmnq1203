

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        //常驻节点
        cc.game.addPersistRootNode(this.node);
    },

    start() {

        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            //点击穿透
            this.node._touchListener.setSwallowTouches(false);
            //点击特效预制体
            let touch = cc.instantiate(Res.loadPrefab("点击"));
            touch.parent = this.node;
            touch.position = this.node.convertToNodeSpaceAR(event.getLocation());
            //动画后销毁
            let spine = touch.getComponent(sp.Skeleton);
            spine.setAnimation(0, "animation", false);
            spine.setCompleteListener(() => {
                touch.destroy();
            });
        }, this);

    },

    // update (dt) {},
});
