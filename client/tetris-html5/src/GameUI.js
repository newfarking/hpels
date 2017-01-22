var GameUI = cc.Layer.extend({
    useTimeControl: null,
    nextPieceControl: null,

    optLandControl: null,
    optLeftControl: null,
    optRightControl: null,
    optRotateControl: null,

    gameLayer: null,

    toGameLayer: null,
    successGameLayer: null,
    failGameLayer: null,
    successUsedTimeField: null,


    optLandRadius: null,
    optLandCenterX: null,
    optLandCenterY: null,

    optLeftRadius: null,
    optLeftCenterX: null,
    optLeftCenterY: null,

    optRightRadius: null,
    optRightCenterX: null,
    optRightCenterY: null,

    optRotateRadius: null,
    optRotateCenterX: null,
    optRotateCenterY: null,

    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;

        this._initGameingPanel();
        this._initGamedPanel();
        this.scheduleUpdate();
    },

    showToGameLayer: function () {
        if (this.gameLayer._success != null) {
            if (this.gameLayer._success === true) {
                this._initSuccessGamePanel();
                this.successUsedTimeField.setString("耗时" + this.gameLayer.useTime + "秒,顺利!");
                this.addChild(this.successGameLayer, 12);
            } else {
                this._initFailGamePanel();
                this.addChild(this.failGameLayer, 11);
            }

        } else {
            this._initToGamePanel();
            this.addChild(this.toGameLayer, 10);
        }
    },

    hideToGameLayer: function () {
        if (this.toGameLayer != null) {
            this.removeChild(this.toGameLayer);
            this.toGameLayer = null;
        }
        if (this.successGameLayer != null) {
            this.removeChild(this.successGameLayer);
            this.successGameLayer = null;
        }
        if (this.failGameLayer != null) {
            this.removeChild(this.failGameLayer);
            this.failGameLayer = null;
        }
    },
    _initFailGamePanel: function () {
        var size = cc.director.getWinSize();
        this.failLabel = new cc.LabelTTF("灰色方块未消完,失败!", "arial", 16);

        this.failGameLayer = new cc.LayerColor(cc.color(255, 255, 255, 10),
            Constant.BOARD_WIDTH * Constant.BOX_SIZE, Constant.BOARD_HEIGHT * Constant.BOX_SIZE);

        this.failGameLayer.addChild(this.failLabel);
        this.failLabel.x = size.width / 2;
        this.failLabel.y = size.height * 2 / 3;

        var toGameLabel = new cc.LabelTTF("点击开始游戏", "arial", 12);
        this.failGameLayer.addChild(toGameLabel);
        toGameLabel.x = size.width / 2;
        toGameLabel.y = size.height / 2;
    },

    _initSuccessGamePanel: function () {
        var size = cc.director.getWinSize();
        this.successUsedTimeField = new cc.LabelTTF("耗时XX秒", "arial", 16);

        this.successGameLayer = new cc.LayerColor(cc.color(255, 255, 255, 10),
            Constant.BOARD_WIDTH * Constant.BOX_SIZE, Constant.BOARD_HEIGHT * Constant.BOX_SIZE);

        this.successGameLayer.addChild(this.successUsedTimeField);
        this.successUsedTimeField.x = size.width / 2;
        this.successUsedTimeField.y = size.height * 2 / 3;

        var toGameLabel = new cc.LabelTTF("点击开始游戏");
        toGameLabel.setFontSize(16);
        this.successGameLayer.addChild(toGameLabel);
        toGameLabel.x = size.width / 2;
        toGameLabel.y = size.height / 2;
    },
    _initToGamePanel: function () {
        var size = cc.director.getWinSize();

        var toGameLabel = new cc.LabelTTF("点击开始游戏", "arial", 12);
        var rankLabel = new cc.LabelTTF("查看排行榜", "arial", 12);
        var shareLabel = new cc.LabelTTF("分享到朋友圈", "arial", 12);
        var followLabel = new cc.LabelTTF("关注游戏公众号", "arial", 12);

        this.toGameLayer = new cc.LayerColor(cc.color(255, 255, 255, 10),
            Constant.BOARD_WIDTH * Constant.BOX_SIZE, Constant.BOARD_HEIGHT * Constant.BOX_SIZE);


//        this.toGameLayer.addChild(toGameLabel);
//        this.toGameLayer.addChild(rankLabel);
//        this.toGameLayer.addChild(shareLabel);
//        this.toGameLayer.addChild(followLabel);

        var interval = 12;

        toGameLabel.x = size.width / 2;
        toGameLabel.y = size.height / 2;
    },
    _initGameingPanel: function () {

        var useTimeBg = new cc.DrawNode();

        var radius = 23;
        var size = cc.director.getWinSize();

        var centerX = size.width - Constant.BOARD_WIDTH * Constant.BOX_SIZE + radius;
        var centerY = size.height / 2 + Constant.BOARD_HEIGHT * Constant.BOX_SIZE / 2 - radius;

        useTimeBg.x = centerX;
        useTimeBg.y = centerY;
        // useTimeBg.drawDot(cc.p(0, 0), radius, cc.color(255, 255, 255, 30));

        this.addChild(useTimeBg);

        this.useTimeControl = new cc.LabelTTF("0", "arial", 20);
        this.useTimeControl.x = 0;
        this.useTimeControl.y = 0;
        this.useTimeControl.setColor(cc.color(255, 215, 00, 255));
        useTimeBg.addChild(this.useTimeControl);


        this.nextPieceControl = new cc.DrawNode();
        var nextPieceCenterX = size.width / 2 + Constant.BOARD_WIDTH * Constant.BOX_SIZE / 2 - radius;

        this.nextPieceControl.x = nextPieceCenterX;
        this.nextPieceControl.y = centerY;
        // this.nextPieceControl.drawDot(cc.p(0, 0), radius, cc.color(255, 255, 255, 30));
        this.addChild(this.nextPieceControl);


        this.optLandRadius = Constant.BOX_SIZE * 2;
        this.optLandCenterX = (size.width - Constant.BOARD_WIDTH * Constant.BOX_SIZE) / 2 + Constant.BOX_SIZE * 2;
        this.optLandCenterY = (size.height - Constant.BOARD_HEIGHT * Constant.BOX_SIZE) / 2 + Constant.BOX_SIZE * 2;

        // this._addOptLabel(this.optLandControl, this.optLandRadius, this.optLandCenterX, this.optLandCenterY, "D");


        this.optLeftRadius = Constant.BOX_SIZE * 1.5;
        this.optLeftCenterX = (size.width / 2 + Constant.BOARD_WIDTH * Constant.BOX_SIZE / 2) - Constant.BOX_SIZE * 5;
        this.optLeftCenterY = (size.height - Constant.BOARD_HEIGHT * Constant.BOX_SIZE) / 2 + Constant.BOX_SIZE * 1.5;

        // this._addOptLabel(this.optLeftControl, this.optLeftRadius, this.optLeftCenterX, this.optLeftCenterY, "L");


        this.optRightRadius = Constant.BOX_SIZE * 1.5;
        this.optRightCenterX = (size.width / 2 + Constant.BOARD_WIDTH * Constant.BOX_SIZE / 2) - Constant.BOX_SIZE * 1.5;
        this.optRightCenterY = (size.height - Constant.BOARD_HEIGHT * Constant.BOX_SIZE) / 2 + Constant.BOX_SIZE * 1.5;

        // this._addOptLabel(this.optLeftControl, this.optRightRadius, this.optRightCenterX, this.optRightCenterY, "R");


        this.optRotateRadius = Constant.BOX_SIZE * 1.5;
        this.optRotateCenterX = (this.optLeftCenterX + this.optRightCenterX) / 2;
        this.optRotateCenterY = this.optLeftCenterY + this.optLeftRadius * 2.1;

        // this._addOptLabel(this.optLeftControl, this.optRotateRadius, this.optRotateCenterX, this.optRotateCenterY, "C");
    },

    checkOptPosition: function (x, y) {
        if (this.checkInter(this.optLandCenterX, this.optLandCenterY, x, y, this.optLandRadius)) {
            return "LAND";
        }
        if (this.checkInter(this.optLeftCenterX, this.optLeftCenterY, x, y, this.optLeftRadius)) {
            return "LEFT";
        }
        if (this.checkInter(this.optRightCenterX, this.optRightCenterY, x, y, this.optRightRadius)) {
            return "RIGHT";
        }
        if (this.checkInter(this.optRotateCenterX, this.optRotateCenterY, x, y, this.optRotateRadius)) {
            return "ROTATE";
        }
        return "NONE";
    },

    checkInter: function (centerX, centerY, x, y, radius) {
        return (centerX - x) * (centerX - x) + (centerY - y) * (centerY - y) <= radius * radius;
    },

    _addOptLabel: function (obj, radius, centerX, centerY, text) {
        obj = new cc.DrawNode();
        obj.x = centerX;
        obj.y = centerY;
        obj.drawDot(cc.p(0, 0), radius, cc.color(255, 255, 255, 30));

        this.addChild(obj);
        var label = new cc.LabelTTF(text, "arial", 32);
        label.x = 0;
        label.y = 0;
        label.setColor(cc.color(58, 58, 58, 20));
        obj.addChild(label);
    },
    _initGamedPanel: function () {

    },

    update: function () {
        this.useTimeControl.setString(this.gameLayer.useTime);

        if (this.gameLayer._nextPiece != null) {
            this.nextPieceControl.removeAllChildren();
            (new Tetromino(this.gameLayer._nextPiece._type)).fillWithSmallTo(this.nextPieceControl);
        }
    }
});
