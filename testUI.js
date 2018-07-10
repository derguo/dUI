/**
 * Author:wangzhiguo
 * Date:2018/7/6 15:20
 */
(function () {

    function mapInterface() {
        this.info = {
            mapZoom:15,
            centerPoint:{longitude:116.397428,latitude:39.90923},
            points:[{longitude:116.397428,latitude:39.90923},{longitude:116.667428,latitude:39.11923}]
        };
        this.Obj = null;
        this.mapInit = $.noop;
        this.addPoint = $.noop;
        this.container = null;
    }

    var baiduMap = $.extend(new mapInterface(),{
        mapInit:function () {
            this.obj = new BMap.Map(this.info.container.id);
            var point = new BMap.Point(this.info.centerPoint.longitude, this.info.centerPoint.latitude);
            this.obj.centerAndZoom(point, this.info.mapZoom);
        }
    });

    var qqMap = $.extend(new mapInterface(),{
        mapInit:function () {
            var myLatlng = new qq.maps.LatLng(this.info.centerPoint.latitude,this.info.centerPoint.longitude);
            var myOptions = {
                zoom: this.info.mapZoom,
                center: myLatlng,
                mapTypeId: qq.maps.MapTypeId.ROADMAP
            };
            this.obj = new qq.maps.Map(document.getElementById(this.info.container.id), myOptions);
        }
    });

    var gaodeMap = $.extend(new mapInterface(),{
        mapInit:function () {
            this.obj = new AMap.Map(this.info.container.id, {
                resizeEnable: true,
                zoom:this.info.mapZoom,
                center: [this.info.centerPoint.longitude, this.info.centerPoint.latitude]
            });
        }
    });

    jQuery.extend({
        mapTypes:{
            baidu:{
                tip:"百度地图",
                mapType:baiduMap,
                mapObj:"BMap",
                api:"https://api.map.baidu.com/api?v=3.0&ak=lSyBkQb06bczAu34h2VwbiWlxOkAkPzd"},
            qq:{
                tip:"腾讯地图",
                mapType:qqMap,
                mapObj:"qq.maps",
                api:"https://map.qq.com/api/js?v=2.exp"},
            gaode:{
                tip:"高德地图",
                mapType:gaodeMap,
                mapObj:"AMap",
                api:"https://webapi.amap.com/maps?v=1.4.8"}
        },
        maps:{},
        addMapApi:function (mapType,mapTypeInfo) {
            $.mapTypes[mapType] = mapTypeInfo;
            for(var mapKey in mapTypeInfo.mapType){
                //这里添加判断新添加的地图插件是否满足接口（接口是否实现）。
            }

        }
    });

    jQuery.fn.addMap = function (mapType,info) {
        if(!(mapType == $.mapTypes.baidu || mapType == $.mapTypes.qq || mapType == $.mapTypes.gaode))
            throw new Error("地图类型错误！请选择$.mapTypes对象中的属性，作为参数");

        if (this.length != 1 || this[0].id == undefined) return null;//只支持带有id的唯一容器。

        this.empty();

        mapType.mapType.info.container =  this[0];
        $.extend(mapType.mapType.info,info);

        $.maps[this[0].id] = $.extend(this,mapType.mapType);

        if(window[mapType.mapObj]){
            this.mapInit();
        }else{
            window[this[0].id] = (function (c) {
                return function () {
                    window[c[0].id] = null;
                    c.mapInit();
                }
            })(this);

            //$.getScript(mapType.api+"&callback=$.map."+this[0].id+".init");//qq baidu可以 高德直接.call(window)
            $.getScript(mapType.api+"&callback="+this[0].id);
        }
        return this;//$.map;
    };
})();