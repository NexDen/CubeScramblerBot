import scrambler2 from "./scramblers/2x2x2";
import scrambler3 from "./scramblers/3x3x3";


function getScramble(cube_size: String) {

    var scramble: String;

    switch (cube_size) {
        case "2":
            scramble = scrambler2.getScramble();
            break;
        case "3":
            scramble = scrambler3.getRandomScramble();
            break;
        default:
            scramble = "diğerlerini ekleyecem beklemede kalın"
            break;
    }
}

module.exports = {
    getScramble
}