module.exports = function (obj){
    if (obj.keyValue.email){
        return "email"
    }
    if (obj.keyValue.phoneNumber){
        return "phone Number"
    }
}