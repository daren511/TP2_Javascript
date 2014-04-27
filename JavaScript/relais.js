// JavaScript source code

var http = require("http");
var querystring = require('querystring');
var url = require("url");

var toBase64 = function (str) {
    return (new Buffer(str || "", "ascii")).toString("base64");
};
var fromBase64 = function (str) {
    return (new Buffer(str || "", "base64")).toString("ascii");
};

function start() {
    http.createServer(onRequest).listen(8888);
    console.log("Le serveur a ete demarre.");
}

function onRequest(request, response) {
    var parsedUrl = url.parse(request.url);
    var pathname = parsedUrl.pathname;
    var query = parsedUrl.query;
    var search = parsedUrl.search;
    var inputText = decodeURIComponent(escape(fromBase64(querystring.parse(query).input)));
    var zeQuery = querystring.stringify({
        input: inputText
    });
    if (pathname !== '/minify') {
        // service non supporté
    }
    else if (request.method === 'POST') {
        console.log("post");
        var req = http.request({
            method: 'POST',
            hostname: 'javascript-minifier.com',
            path: '/raw',
        },
           function (resp) {
               var msgRecu = "";
               resp.on('data', function (moton) {
                   msgRecu += moton;
               });
               resp.on('end', function () {
                   response.writeHead(200, {
                       "Content-Type": "text/plain",
                       "Access-Control-Allow-Origin": "*",
                       "Access-Control-Allow-Headers": "X-Requested-With"
                   });
                   response.write(toBase64(unescape(encodeURIComponent(msgRecu))));
                   response.end();
               });
               if (resp.statusCode !== 200) {
                   return;
               }
           }
        );
        req.on('error', function (err) {
            throw err;
        });
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', zeQuery.length);
        req.end(zeQuery, 'utf8');
    }
    else if (request.method == 'GET') {
        console.log("get...");
    }
    else {
        console.log("duh?...");
    }
}

exports.start = start;