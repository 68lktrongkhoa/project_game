// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        audioPGM: {
            type: cc.AudioClip,
            default: null
        },

        audioClick: {
            type: cc.AudioClip,
            default: null
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playBGM();
        
    },

    start () {

    },
    
    playBGM(){
        console.log("Playe BGM");
        this.playBGM = cc.audioEngine.play(this.audioPGM, false, 1);
    },

    playOnclickSound(){
        console.log("Play Onclick");
        this.click = cc.audioEngine.play(this.audioClick, false, 1);
    },

    // update (dt) {},
});
