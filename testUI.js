/**
 * Author:Administrator
 * Date:2018/7/6 15:20
 */
(function () {

    function mapInterface() {
        this.info = {};
        this.Obj = null;
        this.init = $.noop;
        this.addPoint = $.noop;
    }

    var baiduMap = $.extend(new mapInterface(),{
        init:function () {
            this.obj = new BMap.Map(this.info.container);
            var point = new BMap.Point(116.404, 39.915);
            this.obj.centerAndZoom(point, 15);
        }
    });

    var qqMap = $.extend(new mapInterface(),{
        init:function () {
            var myLatlng = new qq.maps.LatLng(39.916527,116.397128);
            var myOptions = {
                zoom: 15,
                center: myLatlng,
                mapTypeId: qq.maps.MapTypeId.ROADMAP
            }
            this.obj = new qq.maps.Map(document.getElementById(this.info.container), myOptions);
        }
    });

    var gaodeMap = $.extend(new mapInterface(),{
        init:function () {
            if(this == window){
                $.map.init();
                return;
            }
            this.obj = new AMap.Map(this.info.container, {
                resizeEnable: true,
                zoom:15,
                center: [116.397428, 39.90923]
            });
        }
    });

    jQuery.extend({
        mapTypes:{
            baidu:{mapObj:baiduMap,api:"https://api.map.baidu.com/api?v=3.0&ak=lSyBkQb06bczAu34h2VwbiWlxOkAkPzd"},
            qq:{mapObj:qqMap,api:"https://map.qq.com/api/js?v=2.exp"},
            gaode:{mapObj:gaodeMap,api:"https://webapi.amap.com/maps?v=1.4.8"}
        },
        map:null
    });

    jQuery.fn.addMap = function (mapType,info) {
        if(!(mapType == $.mapTypes.baidu || mapType == $.mapTypes.qq || mapType == $.mapTypes.gaode))
            throw new Error("地图类型错误！请选择$.mapTypes对象中的属性，作为参数");
        if(this.length != 1 && $.map == null && this.attr("id") == undefined)
            throw new Error("暂不支持同时向多个容器添加地图。也暂不支持用一个页面加载多个地图，或者容器id不存在");

        mapType.mapObj.info.container = this.attr("id");
        $.map = mapType.mapObj;

        $.getScript(mapType.api+"&callback=$.map.init");

        return this;//$.map;
    };
})();