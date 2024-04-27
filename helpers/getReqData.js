module.exports = function(body, query, params){
    console.log(body, query, params);
    if (Object.values(body).length != 0){
        console.log("body");
        return body;
    }else
    if (Object.values(query).length != 0){
        return query;
    }else
    return params;
}