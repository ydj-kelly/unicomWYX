/**
 * Created by Yuan on 2017/3/3.
 */
(function (window) {

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = url;
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || /complete|loaded/.test(this.readyState)) {
                console.log("script [" + url + "] load success.");
                if (typeof callback === "function") {
                    callback();
                }
                script.onload = null;
                script.onreadystatechange = null;
            }
        };
        (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
    }

    var WYX = {};

    function dec(str,des3Key){
        var keyHex = CryptoJS.enc.Utf8.parse(des3Key);
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(str)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    /**
     * 将WA复制给WXY
     * */
    function copyWA() {
        WYX.extend = {};
        $.extend(WYX.extend, WA.extend);
        WYX.registerResultHandler = WA.registerResultHandler;
        WYX.registerEventHandler = WA.registerEventHandler;
        WYX.registerStateHandler = WA.registerStateHandler;

        WYX.extend.makeCall = function (initParams) {

            /**
             * 微营销后台请求真实号码后，再进行外呼
             * */
            $.ajax({
                url: "http://ali.jiaxuelei.com:8888/getRealPhone",
                type: "post",
                dataType: "JSON",
                data: {
                    "customerId": initParams.outCallNumber
                },
                success: function (data) {
                    var des3Key= "qingniuweiyingxiaoccoden";
                    if (data.code == "0") {
                        var realPhone = dec(data.realPhone,des3Key);
                        initParams.outCallNumber = realPhone;
                        WA.extend.makeCall(initParams)
                    } else {
                        alert(data.msg);
                    }
                },
                error: function (xhr, errorType, error) {
                    console.log("Ajax request error,errorType: " + errorType + ",error: " + error);
                    console.log(xhr);
                }
            })
        }
    }
    /**
     * 初始化入口函数
     * @initParams initParams
     */
    WYX.init = function (initParams) {
        function loadWA() {
            loadScript("http://202.108.28.18:8086/WAEX/WA.js", function () {
                WA.init({
                    ui: initParams.ui || !("ui" in initParams),
                    callback: function () {
                        copyWA();
                        if (typeof initParams.callback === "function") {
                            initParams.callback()
                        }
                    }
                })
            });
        }

        loadScript("./lib/crypto-js.js");

        if (typeof window.jQuery == 'undefined') {
            loadScript("./lib/jquery-1.11.1.min.js", function () {
                $ = $.noConflict(true);
                loadWA();
            })
        } else {
            loadWA();
        }
    }
    if (!window.WYX) {
        window.WYX = WYX;
    }
})(window);