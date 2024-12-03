
cc.Class({
    extends: cc.Component,

    properties: {
        /** bundle资源数组 */
        bundleNameArr: [cc.String],
        /** 场景资源bundle */
        sceneBundle: cc.String,
        /** 场景数组 */
        sceneArr: [cc.String],
    },


    onLoad() {
        window.Res = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node);
    },

    start() {

        /**bundle资源数组 */
        this.bundleArr = new Array();
        /** Bundle资源加载个数 */
        this.bundleIndex = 0;
        /** 场景资源加载个数 */
        this.sceneIndex = 0;

        /** 预制体资源 */
        this.prefabResource = null;
        /** 音效资源 */
        this.soundResource = null;

        //加载Bundle以及场景资源
        if (this.bundleNameArr.length > 0) {
            this.loadBundle();
        } else {
            this.loadSceneBundle();
        }
    },

    /** 加载Bundle资源 */
    loadBundle() {
        var self = this;
        cc.assetManager.loadBundle(self.bundleNameArr[self.bundleIndex], (err, bundle) => {
            if (err) {
                console.log("加载错误=>" + err);
            } else {
                self.bundleArr.push(bundle);
                console.log(self.bundleNameArr[self.bundleIndex] + "  bundle加载完毕");
                self.bundleIndex++;
                //进度条增长
                // GameData.LoadScene.barUp();
                if (self.bundleIndex < self.bundleNameArr.length) {
                    //加载下一个Bundle资源
                    self.loadBundle();
                } else {
                    console.log("资源bundle加载完毕 开始加载预制体资源")
                    self.loadPrefabBundle();//加载预制体资源
                }
            }
        });
    },

    /** 加载预制体资源 */
    loadPrefabBundle() {
        this.getPrefabs("", (Prefabs) => {
            this.prefabResource = Prefabs;
            console.log("预制体资源加载完毕 开始加载音效资源")
            this.loadSoundBundle();//加载secene资源
        }, this);
    },

    /** 加载音效组资源 */
    loadSoundBundle() {
        //背景音乐资源组
        this.getSounds("", (Sounds) => {
            this.soundResource = Sounds;
            console.log("音效资源加载完毕 开始加载scene资源")
            this.loadSceneBundle();//加载secene资源
        }, this);
    },

    /** 加载场景资源 */
    loadSceneBundle() {
        if (this.sceneArr.length <= 0) return;
        var self = this;
        cc.assetManager.loadBundle(this.sceneBundle, (err, bundle) => {
            for (var i = 0; i < this.sceneArr.length; i++) {
                bundle.loadScene(self.sceneArr[i], (err, scene) => {
                    self.changeScene(scene);
                })
            }
        }); //加载场景资源
    },
    changeScene(_scene) {
        this.sceneIndex++;
        //进度条增长
        // GameData.LoadScene.barUp();
        console.log(_scene.name + "=>加载成功  " + "  this.sceneIndex  " + this.sceneIndex);
        if (this.sceneIndex >= this.sceneArr.length) {
            console.log("所有场景加载完毕, 正在跳转到下一个场景");
            let time = 1;
            if (AD.chanelName == "oppo" && AD.chanelName == AD.chanelName1) time = 5;
            if (AD.chanelName == "vivo" && AD.chanelName == AD.chanelName1) time = 1;
            setTimeout(() => {
                cc.director.loadScene("MainScene");
            }, time * 1000);
            return;
        }
    },

    /** 加载预制体 */
    loadPrefab(_prefabName) {
        let _prefab = null;
        for (let i = 0; i < this.prefabResource.length; i++) {
            if (this.prefabResource[i].name == _prefabName) {
                _prefab = this.prefabResource[i];
                break;
            }
        }
        if (_prefab == null) console.warn("找不到要加载的预制体=> " + _prefabName);
        else if (_prefab !== null) return _prefab;
    },

    /**
     * 播放音效
     * @param {string} soundName 音效名称
     * @param {boolean} bgm 是否为背景音乐
     * @param {boolean} loop 是否循环
     * @returns soundId 音效ID
     */
    playSound(soundName, bgm, loop) {
        // console.log("播放音效=> " + soundName);
        //寻找目标音效资源
        let sound = null;
        for (let i = 0; i < this.soundResource.length; i++) {
            if (this.soundResource[i].name == soundName) {
                sound = this.soundResource[i];
                break;
            }
        }
        if (sound == null) console.warn("找不到要播放的音效=> " + soundName);
        //播放
        let soundId = null;
        // if (bgm) soundId = cc.audioEngine.playMusic(sound, loop);
        // else soundId = cc.audioEngine.playEffect(sound, loop);
        soundId = cc.audioEngine.play(sound, loop);
        //返回播放音效ID
        return soundId;
    },

    /** 动态加载预制体 */
    getPrefab(_prefabName, callFunc, caller) {
        var bundle = null;
        for (var i = 0; i < this.bundleArr.length; i++) {
            if (this.bundleArr[i].name == "Prefab")
                bundle = this.bundleArr[i];
        }

        if (bundle == null) {
            console.warn("预制体加载失败 =>bundle为空 bundle名称是: Prefab");
            return;
        }
        bundle.load(_prefabName, cc.Prefab, (err, assets) => {
            if (err) {
                console.warn('Prefab error:' + err);
            } else {
                callFunc.call(caller, assets);
            }
        });
    },

    /** 动态加载图片 */
    getSpriteFrame(_sprFrame, callFunc, caller) {
        var bundle = null;
        for (var i = 0; i < this.bundleArr.length; i++) {
            if (this.bundleArr[i].name == "Sprite")
                bundle = this.bundleArr[i];
        }

        if (bundle == null) {
            console.warn("图片加载失败 =>bundle为空 bundle名称是: Sprite");
            return;
        }
        bundle.load(_sprFrame, cc.SpriteFrame, (err, assets) => {
            if (err) {
                console.warn('SpriteFrame error:' + err);
            } else {
                callFunc.call(caller, assets);
            }
        });
    },

    /** 批量动态加载图片 */
    getSpriteFrames(_sprFrame, callFunc, caller) {
        var bundle = null;
        for (var i = 0; i < this.bundleArr.length; i++) {
            if (this.bundleArr[i].name == "Sprite")
                bundle = this.bundleArr[i];
        }

        if (bundle == null) {
            console.warn("批量加载图片失败 =>bundle为空 bundle名称是:" + "Sprite");
            return;
        }

        bundle.loadDir(_sprFrame, cc.SpriteFrame, function (err, assets) {
            if (err) {
                console.warn('piliang error:' + err);
            } else {
                callFunc.call(caller, assets);
            }
        });
    },

    /** 批量动态加载预制体 */
    getPrefabs(_prefabName, callFunc, caller) {
        var bundle = null;
        for (var i = 0; i < this.bundleArr.length; i++) {
            if (this.bundleArr[i].name == "Prefab")
                bundle = this.bundleArr[i];
        }

        if (bundle == null) {
            console.warn("批量加载预制体失败 =>bundle为空 bundle名称是: Prefab");
            return;
        }
        bundle.loadDir(_prefabName, cc.Prefab, (err, assets) => {
            if (err) {
                console.warn('Prefab error:' + err);
            } else {
                callFunc.call(caller, assets);
            }
        });
    },

    /** 加载音效 */
    getSounds(_SoundName, callFunc, caller) {
        // console.log("播放音效=>" + _sound);
        var bundle = null;
        for (var i = 0; i < this.bundleArr.length; i++) {
            if (this.bundleArr[i].name == "Sound")
                bundle = this.bundleArr[i];
        }

        if (bundle == null) {
            console.warn("音效加载失败 =>bundle为空 bundle名称是: Sound");
            return;
        }
        bundle.loadDir(_SoundName, cc.AudioClip, (err, assets) => {
            if (err) {
                console.warn('Sound error:' + err);
            } else {
                callFunc.call(caller, assets);
            }
        });
    },

    // update (dt) {},
});
