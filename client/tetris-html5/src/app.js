var GameLayer = cc.Layer.extend({

    _mainHolder: null,
    _pieceHolder: null,
    ui: null,

    _debug: false,
    useTime: 0,

    _grid: null,
    _curPiece: null,
    _nextPiece: null,
    _moManager: null,
    _speedUpDir: null,

    _gameStarted: false,

    _success: null,

    _record: null,
    _replay: null,
    _frameIndex: 0,
    _tetrisRecordsIndex: 0,
    _motionRecordsIndex: 0,

    _keyboardListener: null,
    _mouseListener: null,
    ctor: function () {

        this._super();
        var size = cc.winSize;
        var bgDraw = new cc.DrawNode();
        this.addChild(bgDraw, 1);
        var left = (size.width - Constant.BOARD_WIDTH * Constant.BOX_SIZE) / 2;
        var bottom = (size.height - Constant.BOARD_HEIGHT * Constant.BOX_SIZE) / 2;
        cc.log(left);
        cc.log(bottom);

        bgDraw.drawRect(cc.p(left, bottom), cc.p(left + Constant.BOARD_WIDTH * Constant.BOX_SIZE + 1,
            bottom + Constant.BOARD_HEIGHT * Constant.BOX_SIZE + 1), cc.color(58, 58, 58, 255), 1, null);

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

        this._init();
        this.scheduleUpdate(); 
        return true;
    },

    _currentFrameIndex: -1,
    _currentAction: -1,

    getCurrentFrameIndex: function() {
        if (this._currentFrameIndex == -1) {
            var index = parseInt(this._record._motionRecords[this._motionRecordsIndex] / 100);
            this._currentAction =  this._record._motionRecords[this._motionRecordsIndex] % 100;
            this._motionRecordsIndex ++;
            this._currentFrameIndex = index;
            return index;
        } else {
            return this._currentFrameIndex;
        }
    },

    update:function(dt){  
        if (this._replay) {
            while (this._frameIndex == this.getCurrentFrameIndex()) {
                var action = this._currentAction;
                var ret = this.doAction(action);
                if (ret == false && action == 2) {
                    this._landed();
                }
                this._currentFrameIndex = -1;
            }
        }
        this._frameIndex ++;      
    },
    
    doAction: function(action) {
        var ret = -1;
        switch (action) {
            case 0:
                ret = this._moManager.moveLeft(this._curPiece);
                break;
            case 1:
                ret = this._moManager.moveRight(this._curPiece);
                break;
            case 2:
                ret = this._moManager.moveDown(this._curPiece);
                break;
            case 3:
                ret = this._moManager.rotate(this._curPiece);
                break;
        } 
        if (this._replay) {
            ; 
        } else {
            var motionRecord = this._frameIndex * 100 + action;
            this._record._motionRecords[this._motionRecordsIndex ++] = motionRecord; 
        }
        return ret;
    },
    
    _init: function () {
        this.initMouseEvent();
        this.initMap(Constant.BAD_LINES);
        this._speedUpDir = null;

        // this.startBestReplay();
        /*
        var me = this;
        cc.loader.loadTxt("res/bestrank.txt", function(err, data){
            var rank = eval('(' + data + ')');
            me.doReplay(rank, me);
        });*/
    },

    onEnter: function () {
        this._super();
        this._replayRankId = "best";
        this.scheduleOnce(function() {
            this.waitForReplay();
        }, 1);
    },

    _replayRankId: null,

    waitForReplay: function() {
        if (this._debug) { 
            var me = this;
            if (!this._gameStarted) {
                cc.loader.loadTxt("res/bestrank.txt", function(err, data){
                    var rank = eval('(' + data + ')');
                    me.doReplay(rank, me, false);
                });
            } 
        } else {
            this.startReplay(this._replayRankId, this._replayRankId != "best");
        }
    },

    doReplay: function(record, me, force) {

        if (!(me._gameStarted && me._replay == false) || force) {
            me._gameStarted = true;
            me.start(record);
        }
    },
    startReplay: function(rankId, force) {
        // get best records 
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "/getRank/" + rankId);
        xhr.setRequestHeader("Content-Type", "application/json");
        var me = this;
        this._replayRankId = rankId;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var res = xhr.responseText;
                var rank = eval('(' + res + ')');
                me.doReplay(eval("(" + rank.result.records + ")"), me, force);
            }
        }
        xhr.send();
    },

    initMouseEvent: function() {
        var me = this;
        if ("mouse" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(event.getLocation())
                    var rect = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
                    cc.log(rect);
                    cc.log(locationInNode);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        if (!(me._gameStarted && !me._replay)) {
                            me.start(null);
                        }
                    } else {
                        return true;
                    }
                }
            }, this);
        }
    },

    initKeyboardEvent: function () {
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


        /*
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
        }*/
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
                this.start(null);
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
        this.doAction(0);
        // this._moManager.moveLeft(this._curPiece);
    },

    _moveRight: function () {
        this.doAction(1);
        // this._moManager.moveRight(this._curPiece);
    },

    _rotate: function () {
        this.doAction(3);
        // this._moManager.rotate(this._curPiece);
    },

    _landing: function () {
        while (this.doAction(2));
        this._landed();
    },

    startGravity: function () {
        this.schedule(this.fallPiece, 0.8);
    },

    stopGravity: function () {
        this.unschedule(this.fallPiece);
    },

    calTime: function () {
        this.useTime += 1;
    },

    // if record is null run normal else run in replay model.
    start: function (record) {
        if (record == null) { // in play model
            this._record = new Record(); // new for save records
            this._replay = false;
            this.initKeyboardEvent();
        } else {
            this._record = record;
            this._replay = true;
        }
        this._tetrisRecordsIndex = 0;
        this._motionRecordsIndex = 0;
        this._frameIndex = 0;
        this._currentFrameIndex = -1;
        
        this.useTime = 0;
        if (!this._replay) {
            this.startGravity();
        }
        this.schedule(this.calTime, 1);
        this.initMap(Constant.BAD_LINES);
        this._nextPiece = null;
        this._createPiece();
        this._updateMainHolder();
        this._updatePieceHolder();

        if (!this._replay) {
            this.ui.hideToGameLayer();
        }
        this._gameStarted = true;
        this._success = null;
    },

    getCookie: function (c_name) {
        if (document.cookie.length>0) {
            c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1) {
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) {
                    c_end=document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    },
 
    stop: function () {
        if (this._replay) {
            this._replay = false;
            this.scheduleOnce(function() {
                this.waitForReplay();
            }, 1);
        } else {
            this.ui.showToGameLayer();
            this.stopGravity();
        }
        
        this._gameStarted = false;
        this.unschedule(this.calTime);
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);

        var coo = this.getCookie("hpels-0908");
        if (this._success == true && coo != "") {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", "/upload");
            xhr.setRequestHeader("Content-Type", "application/json");
            var time = coo + "|" + this.useTime + "|" + hex_md5(coo + this.useTime + "19920908");
            var params = {"time": time, records: JSON.stringify(this._record)};
            xhr.send(JSON.stringify(params));
        }
    },

    fallPiece: function () {
        // move down
        if (!this.doAction(2)) {
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

    _getNewType: function() {
        if (this._replay) {
            return this._record._tetrisRecords[this._tetrisRecordsIndex ++]; 
        } else {
            var type = TetrominoType.random();
            this._record._tetrisRecords[this._tetrisRecordsIndex ++] = type;
            return type;
        }
    },

    _createPiece: function () {
        var type = null;
        if (!this._nextPiece) {
            type = this._getNewType();
            this._nextPiece = new Tetromino(type);
        }
        this._curPiece = this._nextPiece;
        this._curPiece.offset(4, 0);
        type = this._getNewType();
        if (type == null) {
            this.stop();
        }
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
    _layer: null,
    onEnter: function () {
        this._super();
        this._layer = new GameLayer();
        this.addChild(this._layer);
    }
});

