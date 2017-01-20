var Unit = cc.Class.extend({

    _type: null,
    _x: null,
    _y: null,

    _display: null,

    _smallDisplay: null,

    ctor: function (x, y, type) {
        this._type = type;
        this._x = x;
        this._y = y;
    },

    setX: function (x) {
        this._x = x;
        if (this._display) {
            this._display.x = this._x * Constant.BOX_SIZE + Constant.BOX_SIZE / 2;
        }
    },

    setY: function (y) {
        this._y = y;
        if (this._display) {
            this._display.y = (Constant.BOARD_HEIGHT - this._y - 1) * Constant.BOX_SIZE + Constant.BOX_SIZE / 2;
        }
    },

    toDisplay: function() {
        this._display = this._display ? this._display : new Box(this._type);
        this._display.x = (this._x) * Constant.BOX_SIZE + Constant.BOX_SIZE / 2;
        this._display.y = (Constant.BOARD_HEIGHT - this._y - 1) * Constant.BOX_SIZE + Constant.BOX_SIZE / 2;
        return this._display;
    },

    toSmallDisplay: function (x, y) {

        this._smallDisplay = this._smallDisplay ? this._smallDisplay : new SmallBox(this._type);

        var shapeWidth = 0, maxShapeWidth = 0, minShapeWidth = 100;
        var shapeHeight = 0, maxShapeHeight = 0, minShapeHeight = 100;

        var shape = TetrominoType.shape[this._type];
        for (var i = 0;i < shape.length ; i++) {
            if (shape[i][0] > maxShapeWidth) {
                maxShapeWidth = shape[i][0];
            }
            if (shape[i][0] < minShapeWidth) {
                minShapeWidth = shape[i][0];
            }
            if (shape[i][1] > maxShapeHeight) {
                maxShapeHeight = shape[i][0];
            }
            if (shape[i][1] < minShapeHeight) {
                minShapeHeight = shape[i][0];
            }
        }

        this._smallDisplay.x = (this._x - (maxShapeWidth - minShapeWidth + 1) / 2.0) * Constant.SMALL_BOX_SIZE + Constant.SMALL_BOX_SIZE / 2;
        this._smallDisplay.y = (1 - this._y - (maxShapeHeight - minShapeHeight + 1) / 2.0) * Constant.SMALL_BOX_SIZE + Constant.SMALL_BOX_SIZE / 2;
        return this._smallDisplay;
    }


});