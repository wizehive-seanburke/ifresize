!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("Server",[],r):"object"==typeof exports?exports.Server=r():(e.PostRPC=e.PostRPC||{},e.PostRPC.Server=r())}(this,function(){return function(e){function r(t){if(n[t])return n[t].exports;var o=n[t]={exports:{},id:t,loaded:!1};return e[t].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var n={};return r.m=e,r.c=n,r.p="",r(0)}([function(e,exports){"use strict";function r(e){if(Array.isArray(e)){for(var r=0,n=Array(e.length);r<e.length;r++)n[r]=e[r];return n}return Array.from(e)}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function e(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,n,t){return n&&e(r.prototype,n),t&&e(r,t),r}}(),s="2.0",i=-32700,u="Parse error",a="Invalid JSON was received by the server",l=-32600,d="Invalid request",c="The JSON sent is not a valid request object",p=-32601,f="Method not found",h="The method does not exist / is not available",g=-32602,v="Invalid params",m="Invalid method parameter(s)",y=-32603,b="Internal error",k="Internal JSON-RPC error",j=-32604,_="Invalid return",w="Invalid method return type",O=-32e3,S=["boolean","null","undefined","number","string","symbol","object","array"],R=function(){function e(r){n(this,e),this.init(r)}return o(e,[{key:"init",value:function(e){var r=this;this._name="PostRPC.Server",this._origin=e,this._registered={},this._logging=!1,window.removeEventListener("message",function(e){return r.messageHandler(e)})}},{key:"post",value:function(e,r,n){e.postMessage(r,n)}},{key:"register",value:function(e,r,n,t,o){return this.logGroup("register",["method: "+e,"params: "+JSON.stringify(r),"return: "+JSON.stringify(n),"function: function() {}","description: "+o]),this._registered[e]={params:r,return:n,function:t,description:o},!0}},{key:"unregister",value:function(e){return!!this._registered.hasOwnProperty(e)&&(delete this._registered[e],!0)}},{key:"isValid",value:function(e){return!(!(e.jsonrpc===s&&e.method&&"method"in e)||e.method&&0===e.method.lastIndexOf("rpc.",0))}},{key:"isMethodFound",value:function(e){return e.method in this._registered}},{key:"parseErrorResponse",value:function(){return{jsonrpc:s,error:{code:i,message:u,data:a},id:null}}},{key:"invalidRequestResponse",value:function(e){return{jsonrpc:s,error:{code:l,message:d,data:c},id:e.id}}},{key:"methodNotFoundResponse",value:function(e){return{jsonrpc:s,error:{code:p,message:f,data:h},id:e.id}}},{key:"invalidParamsResponse",value:function(e){return{jsonrpc:s,error:{code:g,message:v,data:m},id:e.id}}},{key:"internalErrorResponse",value:function(e){return{jsonrpc:s,error:{code:y,message:b,data:k},id:e.id}}},{key:"invalidReturnResponse",value:function(e){return{jsonrpc:s,error:{code:j,message:_,data:w},id:e.id}}},{key:"success",value:function(e,r){return{jsonrpc:s,result:e,id:r}}},{key:"failure",value:function(e,r){return e.hasOwnProperty("name")&&e.hasOwnProperty("message")?{jsonrpc:s,error:{code:O,message:e.name,data:e.message},id:r}:{jsonrpc:s,error:{code:O,message:"Error",data:JSON.stringify(e)},id:r}}},{key:"event",value:function(e,r){return{jsonrpc:s,result:e,event:r,id:null}}},{key:"publish",value:function(e,r){for(var n=["publish: name: "+e+", result: "+JSON.stringify(r)],t=0;t<window.frames.length;t++){var o=window.frames[t];this.post(o,this.event(r,e),"*")}n.push("("+window.frames.length+") post publish"),this.log(n)}},{key:"start",value:function(){var e=this;window.addEventListener("message",function(r){return e.messageHandler(r)})}},{key:"stop",value:function(){var e=this;window.removeEventListener("message",function(r){return e.messageHandler(r)})}},{key:"mapParams",value:function(e,r){for(var n=[],o=0;o<r.length;o++){var s=r[o];Array.isArray(e)?o<e.length&&n.push(e[o]):null!==e&&"object"===("undefined"==typeof e?"undefined":t(e))&&s[0]in e&&n.push(e[s[0]])}return n}},{key:"messageHandler",value:function(e){var n=e.data,o=["request: "+JSON.stringify(n)];if(this.isValid(n))if(this.isMethodFound(n)){var s=this._registered[n.method],i=s.function,u=this.mapParams(n.params,s.params);if(u.length!==s.params.length)o.push("post invalid params"),this.post(e.source,this.invalidParamsResponse(n),"*");else{o.push("call: "+n.method+"("+u.join(", ")+")");try{var a=i.apply(void 0,r(u));if("object"===("undefined"==typeof a?"undefined":t(a))&&"function"==typeof a.then){o.push("func result is a promise");var l=this;a.then(function(r){l.log(["return: "+JSON.stringify(r),"post promise success"]),l.post(e.source,l.success(r,n.id),"*")}).catch(function(r){l.log(["return: "+JSON.stringify(r),"post promise promise failure"]),l.post(e.source,l.failure(r,n.id),"*")})}else S.indexOf("undefined"==typeof a?"undefined":t(a))?(o.push("func result is allowable type"),o.push("return: "+JSON.stringify(a)),o.push("post allowable success"),this.post(e.source,this.success(a,n.id),"*")):(o.push("func result is NOT allowable type"),o.push("type: "+("undefined"==typeof a?"undefined":t(a))),o.push("post invalid return"),this.post(e.source,this.invalidReturnResponse(n),"*"))}catch(r){o.push("error: "+JSON.stringify(r)),o.push("post try failure"),this.post(e.source,this.failure(r,n.id),"*")}}}else o.push("post method not found"),this.post(e.source,this.methodNotFoundResponse(n),"*");else o.push("post invalid"),this.post(e.source,this.invalidRequestResponse(n),"*");this.log(o)}},{key:"logging",value:function(e){this._logging=e}},{key:"log",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"blue";if(this._logging){console.group(this._name);for(var n=0;n<e.length;n++)console.log("%c%s","color:"+r,e[n]);console.groupEnd()}}},{key:"logGroup",value:function(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"blue";if(this._logging){console.group(this._name),console.groupCollapsed(e);for(var t=0;t<r.length;t++)console.log("%c%s","color:"+n,r[t]);console.groupEnd(),console.groupEnd()}}},{key:"logRegistered",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"blue";if(this._logging){console.group(this._name),console.group("registered");for(var r=this,n=Object.keys(r._registered).map(function(e){return[e,r._registered[e]]}),t=n.sort(function(e,r){return e[0]<r[0]?-1:e[0]>r[0]?1:0}),o=0;o<t.length;o++){var s=[],i=t[o][0],u=t[o][1],a=[],l=[];s.push("/**"),s.push(" * "+u.description);for(var d={Boolean:"true",Null:"null",Undefined:"undefined",Number:"1",String:"str",Object:"{a: 1}",Array:"[1,2]"},c=0;c<u.params.length;c++){var p=u.params[c];s.push(" * @param {"+p[1]+"} "+p[0]),a.push(p[0]),l.push(p[0]+": "+d[p[1]])}s.push(" * @return {"+u.return+"}"),s.push(" */"),s.push(i+"("+a.join(", ")+")"),s.push("client.call('"+i+"', {"+l.join(", ")+"}, func)"),console.groupCollapsed(i);for(var f=0;f<s.length;f++)console.log("%c%s","color:"+e,s[f]);console.groupEnd()}console.groupEnd(),console.groupEnd()}}},{key:"name",get:function(){return this._name}},{key:"origin",get:function(){return this._origin}},{key:"registered",get:function(){return this._registered}}]),e}();exports.default=R,e.exports=exports.default}])});
