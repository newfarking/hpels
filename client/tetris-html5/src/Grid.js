var Grid = cc.Class.extend({

    _lines: null,
    _columns: null,
    _grid: null,

    ctor: function (columns, lines) {
        this._columns = columns;
        this._lines = lines;
        this._createGrid();
    },

    _createGrid: function () {
        this._grid = [];
        for (var i = 0; i < this._lines; i++) {
            this._grid[i] = new Array(this._columns);
        }
    },

    setUnit: function (unit) {
        if (unit._x >= 0 && unit._x < this._columns
            && unit._y >= 0 && unit._y < this._lines) {
            this._grid[unit._y][unit._x] = unit;
        }
    },

    isUnitAt: function (x, y) {
        if (y < 0) {
            return false;
        } else if (x >= 0 && x < this._columns && y < this._lines) {
            return this._grid[y][x] != null;
        } else {
            return true;
        }
    },

    clearFullLines: function () {
        var lines = 0;
        var isFull = true;
        for (var i = 0; i < this._lines; i++) {
            for (var j = 0; j < this._columns; j++) {
                if (this._grid[i][j] == null) {
                    isFull = false;
                    break;
                }
            }
            if (isFull == true) {
                this._grid.splice(i, 1);
                this._grid.unshift(new Array(this._columns));
                lines++;
            }
            isFull = true;
        }

        this._updateUnits();
        return lines;
    },

    clearLastLine: function (lines) {
        for (var i = this._lines - lines; i < this._lines; i++) {
            this._grid.splice(i, 1);
            this._grid.unshift(new Array(this._columns));
        }

        this._updateUnits();
    },

    findType: function (type) {
        for (var i = 0; i < this._lines; i++) {
            for (var j = 0; j < this._columns; j++) {
                if (this._grid[i][j] != null) {
                    if (this._grid[i][j]._type == type) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    _updateUnits: function () {
        for (var i = 0; i < this._lines; i++) {
            for (var j = 0; j < this._columns; j++) {
                if (this._grid[i][j] != null) {
                    this._grid[i][j]._x = j;
                    this._grid[i][j]._y = i;
                }
            }
        }
    },

    clearLines: function () {
        for (var i = 0; i < this._lines; i++) {
            this._grid[i] = new Array(this._columns);
        }
    }
});