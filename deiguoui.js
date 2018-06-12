/**
 * Author:derguo
 * Date:2018/6/7 17:16
 */
(function (w,d,undefined) {
    'use strict';
    var derguo,browserMode = IEVersion();
    function isBroswer () {//检测浏览器内核--返回的是两个key，name：浏览器内核的名称---version：浏览器的版本号
        var _broswer = {};
        var sUserAgent = navigator.userAgent;
        var isOpera = sUserAgent.indexOf("Opera") > -1;
        if (isOpera) {
            //首先检测Opera是否进行了伪装
            if (navigator.appName == 'Opera') {
                //如果没有进行伪装，则直接后去版本号
                _broswer.version = parseFloat(navigator.appVersion);
            } else {
                var reOperaVersion = new RegExp("Opera (\\d+.\\d+)");
                //使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
                reOperaVersion.test(sUserAgent);
                _broswer.version = parseFloat(RegExp['$1']);
            }
            _broswer.opera = true;
            _broswer.name = 'opera';
        }
        var isChrome = sUserAgent.indexOf("Chrome") > -1;
        if (isChrome) {
            var reChorme = new RegExp("Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?");
            reChorme.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.chrome = true;
            _broswer.name = 'chrome';
        }
        //排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
        var isKHTML = (sUserAgent.indexOf("KHTML") > -1
            || sUserAgent.indexOf("Konqueror") > -1 || sUserAgent
                .indexOf("AppleWebKit") > -1)
            && !isChrome;
        if (isKHTML) {//判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
            var isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
            var isKonq = sUserAgent.indexOf("Konqueror") > -1;
            if (isSafari) {
                var reAppleWebKit = new RegExp("Version/(\\d+(?:\\.\\d*)?)");
                reAppleWebKit.test(sUserAgent);
                var fAppleWebKitVersion = parseFloat(RegExp["$1"]);
                _broswer.version = parseFloat(RegExp['$1']);
                _broswer.safari = true;
                _broswer.name = 'safari';
            } else if (isKonq) {
                var reKong = new RegExp(
                    "Konqueror/(\\d+(?:\\.\\d+(?\\.\\d)?)?)");
                reKong.test(sUserAgent);
                _broswer.version = parseFloat(RegExp['$1']);
                _broswer.konqueror = true;
                _broswer.name = 'konqueror';
            }
        }
        // !isOpera 避免是由Opera伪装成的IE
        var isIE = sUserAgent.indexOf("compatible") > -1
            && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.msie = true;
            _broswer.name = 'msie';
        }
        // 排除Chrome 及 Konqueror/Safari 的伪装
        var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isChrome && !isKHTML;
        if (isMoz) {
            var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
            reMoz.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.mozilla = true;
            _broswer.name = 'mozilla';
        }
        return _broswer;
    }
    function IEVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }
        } else if(isEdge) {
            return 'edge';//edge
        } else if(isIE11) {
            return 11; //IE11
        }else{
            return 0;//不是ie浏览器
        }
    }
    var browserDetector = function () {
        var e = /(webkit)[ \/]([\w.]+)/,
            t = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            n = /(msie) ([\w.]+)/,
            r = /(safari)[ \/]([\w.]+)/,
            i = /(mozilla)(?:.*? rv:([\w.]+))?/,
            s = /(firefox)[ \/]([\w.]+)/,
            o = /(trident)[ \/]([\w.]+)/,
            u = /(gecko)[ \/]([\w]+)/,
            a = /(chrome)[ \/]([\w.]+)/,
            f = /(presto)[ \/]([\w.]+)/,
            l = /(maxthon|360se|360ee|theworld|se|theworld|greenbrowser|mqqbrowser|qqbrowser|tencenttraveler|bidubrowser|lbbrowser)[ \/]?([\w.]*)/,
            c = /(android)[ \/]([\w.]+)/,
            h = /(ipad)(?:.*os)? ([\d_]+)/,
            p = /(iphone)(?:.*os)? ([\d_]+)/,
            d = /(opera mini)[ \/]([\w.]+)/,
            v = /(blackberry)([\d]+)/,
            m = /(nokia)([\w]+)[ \/]/,
            rsymbian = /(symbianos)[ \/]([\w.]+)(?:.*)(series60)[ \/]([\w.]+)?/,
            rwinmob = /(iris|3g_t|windows ce|opera mobi|windows ce; smartphone;|windows ce; iemobile)/,
            noneDouble = ["", ""],
            noneTriple = ["", "", ""];

        return function (g) {
            var y = {}, b = a.exec(g) || r.exec(g) || t.exec(g) || n.exec(g) || s.exec(g) || g.indexOf("compatible") < 0 && i.exec(g) || noneTriple, w = l.exec(g) || noneTriple, E = function () {
                try {
                    var e = external.twGetRunPath.toLowerCase().indexOf("360se") > -1 ? !0 : !1;
                    if (e)try {
                        var t = external.twGetVersion(external.twGetSecurityID(window));
                        return ["360se", t]
                    } catch (n) {
                        return ["360se", "-"]
                    }
                    return noneDouble
                } catch (n) {
                    return noneDouble
                }
            }(), S = function () {
                try {
                    return /(\d+\.\d)/.test(external.max_version) ? ["maxthon", parseFloat(RegExp.$1)] : noneDouble
                } catch (e) {
                    return noneDouble
                }
            }(), x = o.exec(g) || e.exec(g) || u.exec(g) || f.exec(g) || noneTriple, T = c.exec(g) || p.exec(g) || h.exec(g) || d.exec(g) || v.exec(g) || m.exec(g) || noneTriple;
            if (!T[1]) {
                var N = rwinmob.exec(g);
                N ? T = ["", "Windows Smartphone", ""] : T = ["", "Desktop", "full capability browser"]
            } else if (T[1] === "android")T = [T[0], "Mobile device", "android " + T[2]]; else if (T[1] === "ipad" || T[1] === "iphone")T[2] = "IOS " + T[2].replace(/_/g, "."); else if (T[1] === "nokia") {
                var C = rsymbian.exec(g);
                C ? T = ["", T[1] + T[2], "(" + C[1] + "/" + C[2] + " " + C[3] + "/" + C[4] + ")"] : T = ["", T[1] + T[2], ""]
            }
            return y.layout = [x[1], x[2]], y.core = [b[1], b[2]], y.shell = [w[1], w[2]], E[0] ? y.shell = E : S[0] && (y.shell = S), y.script = function () {
                if (b[1] !== "msie")return noneDouble;
                try {
                    return [ScriptEngine(), [ScriptEngineMajorVersion(), ScriptEngineMinorVersion(), ScriptEngineBuildVersion()].join(".")]
                } catch (e) {
                    return noneDouble
                }
            }(), y.documentMode = document.documentMode, y.browserMode = function () {
                if (browserMode === 7)if (x[2] == "5.0")browserMode += " (IE9\u517c\u5bb9\u6a21\u5f0f)"; else if (b[2] == "8.0" || x[2] == "4.0")browserMode += " (IE8\u517c\u5bb9\u6a21\u5f0f)";
                return browserMode
            }(), y.compatMode = document.compatMode, y.device = [T[1], T[2]], y
        }
    }(),
        getVersionName = function () {
        var e = browserDetector(navigator.userAgent.toLowerCase()),
            t = e.shell[0] != "" ? e.shell[0] : e.core[0];
        console.log(e);
        console.log(t);
        return t.trim().toLowerCase()
    },
        showMatchPage = function () {

        var t = getVersionName();
        alert(t);

    };

    function Derguo() {
        try{jQuery}catch (err){
            throw new Error(err.message+', derguoUI mast be use jQuery. pleace add JQuery first.');
        }
        return{
            name : 'derguoUI',
            whichBrowser : {}
        }
    }
    derguo = new Derguo();
    derguo.whichBrowser = showMatchPage();

    window.derguo = window.$who = derguo;
})(window,document,undefined);