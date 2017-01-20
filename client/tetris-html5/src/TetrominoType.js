var TetrominoType = cc.Class.extend({

    _type: null,

    ctor: function(type) {
        this._type = type;
    },
});

TetrominoType.I = "I";
TetrominoType.J = "J";
TetrominoType.L = "L";
TetrominoType.O = "O";
TetrominoType.S = "S";
TetrominoType.Z = "Z";
TetrominoType.T = "T";
TetrominoType.BAD = "BAD";
TetrominoType.history = [TetrominoType.Z, TetrominoType.O, ""];
TetrominoType.shape = {
    "I": [[0, 0], [1, 0], [2, 0], [3, 0]],
    "J": [[0, 0], [0, 1], [1, 1], [2, 1]],
    "L": [[2, 0], [0, 1], [1, 1], [2, 1]],
    "O": [[0, 0], [1, 0], [0, 1], [1, 1]],
    "S": [[1, 0], [2, 0], [1, 1], [0, 1]],
    "Z": [[0, 0], [1, 0], [1, 1], [2, 1]],
    "T": [[1, 0], [0, 1], [1, 1], [2, 1]]
};
TetrominoType.random = function() {
    var t;

    for (var i = 0; i < 4; i++) {
        var p = TetrominoType.randomPosition();
        t = TetrominoType.ALL[p];

        if (TetrominoType.isRecent(t)) {
            continue;
        } else {
            break;
        }
    }
    TetrominoType.addToHistory(t);
    return t;
};

TetrominoType.isRecent = function(type) {
    return TetrominoType.history.indexOf(type) != -1;
}

TetrominoType.addToHistory = function (type) {
    TetrominoType.history.pop();
    TetrominoType.history.unshift(type);
};

TetrominoType.randomPosition= function() {
        return Math.round(Math.random() * 6);
    };
TetrominoType.ALL = [TetrominoType.I, TetrominoType.J, TetrominoType.L,
    TetrominoType.O, TetrominoType.S, TetrominoType.Z, TetrominoType.T];
