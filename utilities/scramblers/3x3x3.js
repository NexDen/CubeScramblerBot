/*

scramble_333.js

3x3x3 Solver / Scramble Generator in Javascript.

The core 3x3x3 code is from a min2phase solver by Shuang Chen.
Compiled to Javascript using GWT.
(There may be a lot of redundant code right now, but it's still really fast.)

*/

const min2phase = require("../min2phase")
const mathlib = require("../mathlib")

var Ux1 = 0,
    Ux2 = 1,
    Ux3 = 2,
    Rx1 = 3,
    Rx2 = 4,
    Rx3 = 5,
    Fx1 = 6,
    Fx2 = 7,
    Fx3 = 8,
    Dx1 = 9,
    Dx2 = 10,
    Dx3 = 11,
    Lx1 = 12,
    Lx2 = 13,
    Lx3 = 14,
    Bx1 = 15,
    Bx2 = 16,
    Bx3 = 17;

function renderFacelet(solved, cc, resultMap) {
    var f = cc.toPerm();
    var ret = [];
    for (var i = 0; i < resultMap.length; i++) {
        ret[i] = solved[f[resultMap[i]]];
    }
    return ret.join('');
}

// SCRAMBLERS

var search = new min2phase.Search();

function getRandomScramble() {
    return getAnyScramble(0xffffffffffff, 0xffffffffffff, 0xffffffff, 0xffffffff);
}

function cntU(b) {
    for (var c = 0, a = 0; a < b.length; a++) - 1 == b[a] && c++;
    return c
}

function fixOri(arr, cntU, base) {
    var sum = 0;
    var idx = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != -1) {
            sum += arr[i];
        }
    }
    sum %= base;
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] == -1) {
            if (cntU-- == 1) {
                arr[i] = ((base << 4) - sum) % base;
            } else {
                arr[i] = mathlib.rn(base);
                sum += arr[i];
            }
        }
        idx *= base;
        idx += arr[i];
    }
    if (cntU == 1) {
        arr.splice(-1, 1, ((base << 4) - sum) % base);
    }
    return idx;
}

function fixPerm(arr, cntU, parity) {
    var val = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != -1) {
            val[arr[i]] = -1;
        }
    }
    for (var i = 0, j = 0; i < val.length; i++) {
        if (val[i] != -1) {
            val[j++] = val[i];
        }
    }
    var last;
    for (var i = 0; i < arr.length && cntU > 0; i++) {
        if (arr[i] == -1) {
            var r = mathlib.rn(cntU);
            arr[i] = val[r];
            for (var j = r; j < 11; j++) {
                val[j] = val[j + 1];
            }
            if (cntU-- == 2) {
                last = i;
            }
        }
    }
    if (mathlib.getNParity(mathlib.getNPerm(arr, arr.length), arr.length) == 1 - parity) {
        var temp = arr[i - 1];
        arr[i - 1] = arr[last];
        arr[last] = temp;
    }
    return mathlib.getNPerm(arr, arr.length);
}

//arr: 53 bit integer
function parseMask(arr, length) {
    if ('number' !== typeof arr) {
        return arr;
    }
    var ret = [];
    for (var i = 0; i < length; i++) {
        var val = arr & 0xf; // should use "/" instead of ">>" to avoid unexpected type conversion
        ret[i] = val == 15 ? -1 : val;
        arr /= 16;
    }
    return ret;
}

var aufsuff = [
    [],
    [Ux1],
    [Ux2],
    [Ux3]
];

var rlpresuff = [
    [],
    [Rx1, Lx3],
    [Rx2, Lx2],
    [Rx3, Lx1]
];

var rlappsuff = ["", "x'", "x2", "x"];

var emptysuff = [
    []
];

function getAnyScramble(_ep, _eo, _cp, _co, neut, _rndapp, _rndpre, firstAxisFilter, lastAxisFilter) {
    _rndapp = _rndapp || emptysuff;
    _rndpre = _rndpre || emptysuff;
    _ep = parseMask(_ep, 12);
    _eo = parseMask(_eo, 12);
    _cp = parseMask(_cp, 8);
    _co = parseMask(_co, 8);
    var solution = "";
    do {
        var eo = _eo.slice();
        var ep = _ep.slice();
        var co = _co.slice();
        var cp = _cp.slice();
        var neo = fixOri(eo, cntU(eo), 2);
        var nco = fixOri(co, cntU(co), 3);
        var nep, ncp;
        var ue = cntU(ep);
        var uc = cntU(cp);
        if (ue == 1) {
            fixPerm(ep, ue, -1);
            ue = 0;
        }
        if (uc == 1) {
            fixPerm(cp, uc, -1);
            uc = 0;
        }
        if (ue == 0 && uc == 0) {
            nep = mathlib.getNPerm(ep, 12);
            ncp = mathlib.getNPerm(cp, 8);
        } else if (ue != 0 && uc == 0) {
            ncp = mathlib.getNPerm(cp, 8);
            nep = fixPerm(ep, ue, mathlib.getNParity(ncp, 8));
        } else if (ue == 0 && uc != 0) {
            nep = mathlib.getNPerm(ep, 12);
            ncp = fixPerm(cp, uc, mathlib.getNParity(nep, 12));
        } else {
            nep = fixPerm(ep, ue, -1);
            ncp = fixPerm(cp, uc, mathlib.getNParity(nep, 12));
        }
        if (ncp + nco + nep + neo == 0) {
            continue;
        }
        var rndpre = mathlib.rndEl(_rndpre);
        var rndapp = mathlib.rndEl(_rndapp);
        var cc = new mathlib.CubieCube();
        var cd = new mathlib.CubieCube();
        for (var i = 0; i < 12; i++) {
            cc.ea[i] = ep[i] << 1 | eo[i];
            if (i < 8) {
                cc.ca[i] = co[i] << 3 | cp[i];
            }
        }
        for (var i = 0; i < rndpre.length; i++) {
            mathlib.CubieCube.CubeMult(mathlib.CubieCube.moveCube[rndpre[i]], cc, cd);
            cc.init(cd.ca, cd.ea);
        }
        for (var i = 0; i < rndapp.length; i++) {
            mathlib.CubieCube.CubeMult(cc, mathlib.CubieCube.moveCube[rndapp[i]], cd);
            cc.init(cd.ca, cd.ea);
        }
        if (neut) {
            cc.ori = mathlib.mathlib.rn([1, 4, 8, 1, 1, 1, 24][neut]);
            cc.selfConj();
            cc.ori = 0;
        }
        var posit = cc.toFaceCube();
        solution = search.solution(posit, 21, 1e9, 50, 2, lastAxisFilter, firstAxisFilter);
    } while (solution.length <= 3);
    return solution.replace(/ +/g, ' ');
}

module.exports = {
    getRandomScramble
}