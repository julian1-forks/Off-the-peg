!function(t){function n(n){for(var a,o,s=n[0],p=n[1],u=n[2],c=0,d=[];c<s.length;c++)o=s[c],i[o]&&d.push(i[o][0]),i[o]=0;for(a in p)Object.prototype.hasOwnProperty.call(p,a)&&(t[a]=p[a]);for(l&&l(n);d.length;)d.shift()();return r.push.apply(r,u||[]),e()}function e(){for(var t,n=0;n<r.length;n++){for(var e=r[n],a=!0,s=1;s<e.length;s++){var p=e[s];0!==i[p]&&(a=!1)}a&&(r.splice(n--,1),t=o(o.s=e[0]))}return t}var a={},i={0:0},r=[];function o(n){if(a[n])return a[n].exports;var e=a[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=t,o.c=a,o.d=function(t,n,e){o.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,n){if(1&n&&(t=o(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(o.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)o.d(e,a,function(n){return t[n]}.bind(null,a));return e},o.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(n,"a",n),n},o.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},o.p="";var s=window.webpackJsonp=window.webpackJsonp||[],p=s.push.bind(s);s.push=n,s=s.slice();for(var u=0;u<s.length;u++)n(s[u]);var l=p;r.push([297,1]),e()}({122:function(t){t.exports=[{constant:!0,inputs:[],name:"name",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_spender",type:"address"},{name:"_value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"totalSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"symbol",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{name:"_owner",type:"address"},{name:"_spender",type:"address"}],name:"allowance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{payable:!0,stateMutability:"payable",type:"fallback"},{anonymous:!1,inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"}]},289:function(t,n,e){"use strict";var a=e(60);e.n(a).a},290:function(t,n,e){(n=t.exports=e(291)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Roboto);",""]),n.push([t.i,"\n/*==================================================\n  Basics\n  ==================================================*/\nbody\n{\n\tfont-family: 'Roboto', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;\n\tfont-size: 14px;\n}\n#app\n{\n\tdisplay: flex;\n\tjustify-content: center;\n}\n#left,\n#right\n{\n\tflex: 1;\n}\n#center\n{\n\tmax-width: 800px;\n\tflex: 3;\n\tjustify-content: center;\n\tflex-direction: column;\n}\n\n/* Mobile */\n@media all and (max-width: 1399px)\n{\n#left,\n\t#right\n\t{\n\t\tflex: 0.5;\n}\n}\n@media all and (max-width: 1023px)\n{\n#left,\n\t#right\n\t{\n\t\tflex: 0.5;\n}\n#center\n\t{\n\t\tdisplay: flex;\n\t\tflex: 4;\n\t\tflex-wrap: wrap;\n\t\tjustify-content: center;\n}\n}\n@media all and (max-width: 767px)\n{\n#left,\n\t#right\n\t{\n\t\tflex: 0;\n}\n}\n\n/* Helper mode */\n@media all and (max-width: 255px)\n{\ndiv.nav-bar-mobile\n\t{\n\t\twidth: 180px;\n}\ndiv.nav-option-mobile\n\t{\n\t\tmargin: 0 2px;\n}\n}\n\n",""])},297:function(t,n,e){"use strict";e.r(n);e(123);var a=e(89),i=e.n(a),r=e(90),o=(e(121),function(){var t=this.$createElement,n=this._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{attrs:{id:"left"}}),this._v(" "),n("div",{attrs:{id:"center"}},[n("h1",[this._v("Off the peg")]),this._v(" "),n("router-view")],1),this._v(" "),n("div",{attrs:{id:"right"}})])});o._withStripped=!0;e(289);var s=e(61),p=Object(s.a)({},o,[],!1,null,null,null);p.options.__file="public/App.vue";var u=p.exports,l=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("div",[t._v("\n\t\tUniswap: "+t._s(t.uniswapPrice)+"\n\t")]),t._v(" "),e("div",[t._v("\n\t\tKyber: "+t._s(t.kyberPrice)+"\n\t")]),t._v(" "),e("div",[t._v("\n\t\tCoinbase Pro: "+t._s(t.coinbaseProPrice)+"\n\t")])])};l._withStripped=!0;var c=e(88),d=e.n(c),f=e(122),y="93e3393c76ed4e1f940d0266e2fdbda2";console.log(y);var m=new d.a.providers.InfuraProvider("mainnet",y);console.log(m);var v={data:function(){return{}},computed:{uniswapPrice:function(){console.log("erc20Abi = ".concat(f)),console.log("ethers = ".concat(d.a)),console.log("provider = ".concat(m));new d.a.Contract("0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",f,m);return 0},kyberPrice:function(){return 0},coinbaseProPrice:function(){return 0}}},b=Object(s.a)(v,l,[],!1,null,null,null);b.options.__file="public/views/DaiPeg.vue";var h=b.exports;i.a.use(r.a);var x=[{path:"/",component:h}],_=new r.a({mode:"history",routes:x});new i.a({router:_,render:function(t){return t(u)},el:"#app"})},60:function(t,n,e){var a=e(290);"string"==typeof a&&(a=[[t.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};e(292)(a,i);a.locals&&(t.exports=a.locals)}});