var Box = cc.Sprite.extend({
    _type: null,

    ctor: function(type) {
        this._super("res/" + type + ".jpg");
        this._type = type;
        this.setScaleX((Constant.BOX_SIZE - 1) / this._getWidth())
        this.setScaleY((Constant.BOX_SIZE - 1) / this._getHeight())
    }
});
