module.exports = function(){
    var code = 0;

    for (i=0; i < 6; i++){
        var number = Math.ceil(Math.random() * 10);
        number = number * (10 ** i);
        code += number;
    }
    return code;
}