var GameLayer = cc.Layer.extend({

    _mainHolder: null,
    _pieceHolder: null,
    ui: null,

    useTime: 0,

    _grid: null,
    _curPiece: null,
    _nextPiece: null,
    _moManager: null,
    _speedUpDir: null,

    _gameStarted: false,

    _success: null,

    ctor: function () {

        this._super();
        var size = cc.winSize;
        var bgDraw = new cc.DrawNode();
        this.addChild(bgDraw, 1);
        var left = (size.width - Constant.BOARD_WIDTH * Constant.BOX_SIZE) / 2;
        var bottom = (size.height - Constant.BOARD_HEIGHT * Constant.BOX_SIZE) / 2;

        bgDraw.drawRect(cc.p(left, bottom), cc.p(left + Constant.BOARD_WIDTH * Constant.BOX_SIZE,
            bottom + Constant.BOARD_HEIGHT * Constant.BOX_SIZE), cc.color(58, 58, 58, 255), 1, null);

        this._grid = new Grid(Constant.BOARD_WIDTH, Constant.BOARD_HEIGHT);
        this._moManager = new MotionManager(this._grid);
        this._mainHolder = new cc.Layer();

        this._mainHolder.x = left;
        this._mainHolder.y = bottom;
        this.addChild(this._mainHolder, 1);

        this._pieceHolder = new cc.Layer();
        this._pieceHolder.x = left;
        this._pieceHolder.y = bottom;

        this.addChild(this._pieceHolder, 2);

        this.ui = new GameUI(this);
        this.addChild(this.ui, 3);
        this.ui.showToGameLayer();

        this.init();
        return true;
    },

    init: function () {
        this.initUserEvent();
        this.initMap(Constant.BAD_LINES);
        this._speedUpDir = null;
        //this.start();
    },

    initUserEvent: function () {
        var me = this;
        if ("keyboard" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function (keyCode, event) {
                    me._keyReleased(keyCode, event);
                },
                onKeyPressed :function (keyCode, event) {
                    me._keyPressed(keyCode, event);
                }
            }, this);
        }

        if ("mouse" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event) {
                    if (!me._gameStarted) {
                        me.start();
                    }
                }
            }, this);
        }

        if ("touches" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function(touch, event) {
                    return me._touchDown(touch, event);
                },
                onTouchEnded: function(touch, event) {

                    me._touchUp(touch, event);
                }
            }, this);
        }
    },

    _touchDown: function (touch, event) {
        if (!this._gameStarted) {
            return true;
        }

        var pos = touch.getLocation();
        var opt = this.ui.checkOptPosition(pos.x, pos.y);
        if (opt === "LAND") {
            this._landing();
        } else if (opt === "LEFT") {
            this._leftDownEvent();
        } else if (opt === "RIGHT") {
            this._rightDownEvent();
        } else if (opt === "ROTATE") {
            this._rotate();
        }
        return true;
    },

    _touchUp: function (touch, event) {
        var pos = touch.getLocation();
        var opt = this.ui.checkOptPosition(pos.x, pos.y);

        if (opt === "NONE") {
            if (!this._gameStarted) {
                this.start();
                return true;
            }
        }

        if (opt === "LEFT" || opt === "RIGHT") {
            this._leftRightUpEvent();
        }
    },

    _leftDownEvent: function() {
        this._clearSpeedSchedule();
        this._moveLeft();
        this._speedUpDir = "LEFT";
        this.scheduleOnce(this._speedUpLeft, 0.15);
    },

    _rightDownEvent: function() {
        this._clearSpeedSchedule();
        this._moveRight();
        this._speedUpDir = "RIGHT";
        this.scheduleOnce(this._speedUpRight, 0.15);
    },

    _keyPressed: function (keyCode, event) {
        if (!this._gameStarted) {
            return;
        }

        switch (keyCode) {
            case cc.KEY.up:
                this._rotate();
                break;
            case cc.KEY.left:
                this._leftDownEvent();
                break;
            case cc.KEY.right:
                this._rightDownEvent();
                break;
            case cc.KEY.space:
                this._landing();
                break;
        }
        this._updatePieceHolder();
    },

    _clearSpeedSchedule: function() {
        this.unschedule(this._speedUpLeft);
        this.unschedule(this._speedUpRight);
        this.unschedule(this._speedingLeft);
        this.unschedule(this._speedingRight);
    },

    _speedingLeft: function() {
        if (this._speedUpDir === "LEFT") {
            this._moveLeft();
        }
    },
    _speedingRight: function() {
        if (this._speedUpDir === "RIGHT") {
            this._moveRight();
        }
    },

    _speedUpLeft: function() {
        if (this._speedUpDir === "LEFT") {
            this.schedule(this._speedingLeft, 0.01);
        }
    },
    _speedUpRight: function() {
        if (this._speedUpDir === "RIGHT") {
            this.schedule(this._speedingRight, 0.01);
        }
    },

    _leftRightUpEvent: function() {
        this._clearSpeedSchedule();
        this._speedUpDir = null;
    },

    _keyReleased: function (keyCode, event) {
        if (!this._gameStarted) {
            return;
        }
        switch (keyCode) {
            case cc.KEY.left:
            case cc.KEY.right:
                this._leftRightUpEvent();
                break;
        }
    },

    _moveLeft: function () {
        this._moManager.moveLeft(this._curPiece);
    },

    _moveRight: function () {
        this._moManager.moveRight(this._curPiece);
    },

    _rotate: function () {
        this._moManager.rotate(this._curPiece);
    },

    _landing: function () {
        while (this._moManager.moveDown(this._curPiece));
        this._landed();
    },

    startGravity: function () {
        this.schedule(this.fallPiece, 0.5);
    },

    stopGravity: function () {
        this.unschedule(this.fallPiece);
    },

    calTime: function () {
        this.useTime += 1;
    },

    start: function () {
        this.useTime = 0;
        this.startGravity();
        this.schedule(this.calTime, 1);
        this.initMap(Constant.BAD_LINES);
        this._createPiece();
        this._updateMainHolder();
        this._updatePieceHolder();

        this.ui.hideToGameLayer();
        this._gameStarted = true;
        this._success = null;
    },

    stop: function () {
        this._gameStarted = false;
        this.unschedule(this.calTime);
        this.stopGravity();
        this.ui.showToGameLayer();
    },

    fallPiece: function () {
        // move down
        if (!this._moManager.moveDown(this._curPiece)) {
            this._landed();
        }
    },

    _landPiece: function () {
        this._removeAllFromPieceHolder();
        this._curPiece.fillTo(this._mainHolder);
        this._setUnits();
        this.removeFullLines();
    },

    _setUnits: function () {
        if (this._curPiece._unit1._y > 0 && this._curPiece._unit2._y > 0 &&
            this._curPiece._unit3._y > 0 && this._curPiece._unit4._y > 0) {
            this._grid.setUnit(this._curPiece._unit1);
            this._grid.setUnit(this._curPiece._unit2);
            this._grid.setUnit(this._curPiece._unit3);
            this._grid.setUnit(this._curPiece._unit4);
        } else {
            // game over
            this._success = false;
            this.stop();
        }
    },

    removeFullLines: function () {
        var fullLines = this._grid.clearFullLines();

        if (fullLines >= 3) {
            this._grid.clearLastLine(fullLines - 1);
        }

        if (fullLines > 0) {
            this._updateMainHolder();
        }

        if (!this._grid.findType(TetrominoType.BAD)) {
            this._success = true;
            this.stop();
        }
    },

    _landed: function () {
        this._landPiece();
        this._createPiece();
        this._updatePieceHolder();
    },

    initMap: function (badLines) {
        this._grid.clearLines();
        var gridLines = this._grid._lines;
        var gridColumns = this._grid._columns;
        for (var i = gridLines - badLines; i < gridLines; i++) {
            for (var j = 0; j < gridColumns; j++) {
                if ((i + j) % 2 == 0) {
                    var bad = new Unit(j, i, TetrominoType.BAD);
                    this._grid.setUnit(bad);
                }
            }
        }

        this._updateMainHolder();
    },

    _createPiece: function () {
        var type = null;
        if (!this._nextPiece) {
            type = TetrominoType.random();
            this._nextPiece = new Tetromino(type);
        }

        this._curPiece = this._nextPiece;

        this._curPiece.offset(4, 0);

        type = TetrominoType.random();
        this._nextPiece = new Tetromino(type);
    },

    _updateMainHolder: function () {
        this._removeAllFromMainHolder();

        // Adds the units from the grid to the display list
        for (var i = 0; i < this._grid._lines; i++) {
            for (var j = 0; j < this._grid._columns; j++) {
                if (this._grid.isUnitAt(j, i)) {
                    this._mainHolder.addChild(this._grid._grid[i][j].toDisplay());
                }
            }
        }
    },

    _updatePieceHolder: function () {
        this._removeAllFromPieceHolder();

        this._curPiece.fillTo(this._pieceHolder);
    },

    _removeAllFromMainHolder: function () {
        while (this._mainHolder.getChildrenCount() > 0) {

            // this._mainHolder.removeChildAtIndex(this._mainHolder.getChildrenCount() - 1);
            this._mainHolder.removeAllChildren();
        }
    },

    _removeAllFromPieceHolder: function () {
        while (this._pieceHolder.getChildrenCount() > 0) {
            // this._pieceHolder.removeChildAtIndex(this._pieceHolder.getChildrenCount() - 1);
            this._pieceHolder.removeAllChildren();
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();

        this.addChild(layer);
    }
});

