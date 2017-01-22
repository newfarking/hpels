var Tetromino = cc.Class.extend({

    _unit1: null,
    _unit2: null,
    _unit3: null,
    _unit4: null,
    _type: null,

    ctor: function(type) {

        this._type = type;
        var shapes = TetrominoType.shape[type];

        this._unit1=new Unit(shapes[0][0],shapes[0][1],type);
        this._unit2=new Unit(shapes[1][0],shapes[1][1],type);
        this._unit3=new Unit(shapes[2][0],shapes[2][1],type);
        this._unit4=new Unit(shapes[3][0],shapes[3][1],type);

    },

    offset: function(x, y) {
        this._unit1._x += x;
        this._unit2._x += x;
        this._unit3._x += x;
        this._unit4._x += x;

        this._unit1._y += y;
        this._unit2._y += y;
        this._unit3._y += y;
        this._unit4._y += y;

    },

    fillTo: function(obj) {
        obj.addChild(this._unit1.toDisplay());
        obj.addChild(this._unit2.toDisplay());
        obj.addChild(this._unit3.toDisplay());
        obj.addChild(this._unit4.toDisplay());
    },

    fillWithSmallTo: function(obj) {
        obj.addChild(this._unit1.toSmallDisplay(0, 0));
        obj.addChild(this._unit2.toSmallDisplay(0, 0));
        obj.addChild(this._unit3.toSmallDisplay(0, 0));
        obj.addChild(this._unit4.toSmallDisplay(0, 0));
    }

});
