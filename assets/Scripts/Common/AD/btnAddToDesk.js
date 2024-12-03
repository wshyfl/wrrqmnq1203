

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.active = true;
        
        if (AD.chanelName != "vivo" && AD.chanelName1 != "oppo" && AD.chanelName1 != "QQ") {
            this.node.active = false;
        }
        else {
            if (AD.wuDianRate <= 0) {
                this.node.active = false;
                return;
            }
            // cc.tween(this.node)
            //     .repeatForever(
            //         cc.tween()
            //             .to(0.3, { scale: 1.1 })
            //             .to(0.3, { scale: 1.0 })
            //     )
            //     .start();
        }

        this.node.on("touchend", () => {
            console.log("addToDesk");
            AD.addToDesk();
        }, this);
    },



    // update (dt) {},
});
