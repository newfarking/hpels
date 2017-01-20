var SmallBox = cc.Sprite.extend({
    _type: null,

    ctor: function(type) {
        this._super("res/small_" + type + ".jpg");

        this._type = type;
        this.setOpacity(200);
    }
});