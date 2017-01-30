
var MotionManager = cc.Class.extend({

    _grid: null,
    ctor: function(grid) {
        this._grid = grid;
    },

    rotate: function (tetromino) {
        var angle = 90;
        if (tetromino.type != TetrominoType.O) {
            var x = tetromino._unit3._x;
            var y = tetromino._unit3._y;

            var x1 = tetromino._unit1._x;
            var x2 = tetromino._unit2._x;
            var x3 = tetromino._unit4._x;
            var y1 = tetromino._unit1._y;
            var y2 = tetromino._unit2._y;
            var y3 = tetromino._unit4._y;

            var d1 = this.getDistance(x1, y1, x, y);
            var d2 = this.getDistance(x2, y2, x, y);
            var d3 = this.getDistance(x3, y3, x, y);
            var o1 = this.getOrientation(x1, y1, x, y);
            var o2 = this.getOrientation(x2, y2, x, y);
            var o3 = this.getOrientation(x3, y3, x, y);

            o1 -= angle * Math.PI / 180;
            o2 -= angle * Math.PI / 180;
            o3 -= angle * Math.PI / 180;


            x1 = x + Math.round(d1 * Math.cos(o1));
            y1 = y + Math.round(d1 * Math.sin(o1));
            x2 = x + Math.round(d2 * Math.cos(o2));
            y2 = y + Math.round(d2 * Math.sin(o2));
            x3 = x + Math.round(d3 * Math.cos(o3));
            y3 = y + Math.round(d3 * Math.sin(o3));

            if (!this._grid.isUnitAt(x1, y1) && !this._grid.isUnitAt(x2, y2) && !this._grid.isUnitAt(x3, y3)) {
                tetromino._unit1.setX(x1);
                tetromino._unit1.setY(y1);
                tetromino._unit2.setX(x2);
                tetromino._unit2.setY(y2);
                tetromino._unit4.setX(x3);
                tetromino._unit4.setY(y3);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    getDistance: function(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;

        return Math.sqrt(dx * dx + dy * dy);
    },

    getOrientation: function(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var add = 0;
        if ((dx < 0 && dy < 0) || (dx < 0 && dy > 0)) {
            add = 180;
        } else if (dx > 0 && dy < 0) {
            add = 360;
        }
        return Math.atan2(dy, dx);
    },

    moveDown: function(tetromino) {

        var u1 = tetromino._unit1;
        var u2 = tetromino._unit2;
        var u3 = tetromino._unit3;
        var u4 = tetromino._unit4;
        if (u1._y < this._grid._lines - 1 && u2._y < this._grid._lines - 1 &&
            u3._y < this._grid._lines - 1 && u4._y < this._grid._lines - 1) {
            if (!this._grid.isUnitAt(u1._x, u1._y + 1) && !this._grid.isUnitAt(u2._x, u2._y + 1) && !this._grid.isUnitAt(u3._x, u3._y + 1) && !this._grid.isUnitAt(u4._x, u4._y + 1)) {
                u1.setY(u1._y + 1);
                u2.setY(u2._y + 1);
                u3.setY(u3._y + 1);
                u4.setY(u4._y + 1);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    moveLeft: function (tetromino) {
        var u1 = tetromino._unit1;
        var u2 = tetromino._unit2;
        var u3 = tetromino._unit3;
        var u4 = tetromino._unit4;

        if (u1._x > 0 && u2._x > 0 && u3._x > 0 && u4._x > 0) {
            if (!this._grid.isUnitAt(u1._x - 1, u1._y) && !this._grid.isUnitAt(u2._x - 1, u2._y) && !this._grid.isUnitAt(u3._x - 1, u3._y) && !this._grid.isUnitAt(u4._x - 1, u4._y)) {

                u1.setX(u1._x - 1);
                u2.setX(u2._x - 1);
                u3.setX(u3._x - 1);
                u4.setX(u4._x - 1);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    moveRight: function (tetromino) {


        var u1 = tetromino._unit1;
        var u2 = tetromino._unit2;
        var u3 = tetromino._unit3;
        var u4 = tetromino._unit4;

        if (u1._x < this._grid._columns - 1 && u2._x < this._grid._columns - 1 &&
            u3._x < this._grid._columns - 1 && u4._x < this._grid._columns - 1) {
            if (!this._grid.isUnitAt(u1._x + 1, u1._y) && !this._grid.isUnitAt(u2._x + 1, u2._y) && !this._grid.isUnitAt(u3._x + 1, u3._y) && !this._grid.isUnitAt(u4._x + 1, u4._y)) {
                u1.setX(u1._x + 1);
                u2.setX(u2._x + 1);
                u3.setX(u3._x + 1);
                u4.setX(u4._x + 1);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
});

MotionManager.DOWN = "DOWN";
MotionManager.LEFT = "LEFT";
MotionManager.RIGHT = "RIGHT";
MotionManager.RORATE = "RORATE";
