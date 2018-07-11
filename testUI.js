/**
 * Author:wangzhiguo
 * Date:2018/7/6 15:20
 */
/**
 * 地图框架
 */
(function (w,d,$,undefined) {

    /**
     * mapInterface：地图功能接口
     * 程序中会检测其中的属性和方法，新添加的地图类型必须实现其中的方法，程序中会做检测，如果有没有实现的方法会报错，
     * info：地图类型的配置属性
     * mapInit：地图初始化方法
     * addPoint：向地图中添加坐标点
     * ......有需要再添加
     */
    function mapInterface() {
        this.info = {
            mapZoom:15,
            centerPoint:{longitude:116.397428,latitude:39.90923},
            points:[{longitude:116.397428,latitude:39.90923},{longitude:116.667428,latitude:39.11923}]
        };
        //this.Obj = null;
        this.mapInit = $.noop;
        this.addPoint = $.noop;
        //this.container = null;
    }

    /**
     * 向jquery中添加了地图的属性和方法
     * mapTypes:规定了地图类别的对象其中
     *     tip:说明标签
     *     mapType:实现地图基本功能的对象，具体要实现mapInterface的属性和方法,
     *     mapObj:地图的api文件加载之后需要初始化运行,才能具体的地图对象，这个属性用来标识出地图对象，检测该对象是否可用，标识地图api是否已初始化完毕。
     *     api:地图api地址
     * maps：目前页面中加载了地图的容器集合。容器id为索引查询。数据为jquery对象。
     * addMapApi：添加新的地图Api。
     *     mapType:新地图Api的标识。字符串。如果标识冲突报错。
     *     mapTypeInfo：地图类型对象。详情见上面的mapTypes说明。
     */
    jQuery.extend({
        mapTypes:{},
        maps:{},
        addMapApi:function (mapType,mapTypeInfo) {
            for(var t in $.mapTypes){
                if (mapType == t){
                    throw new Error("地图类型重名！");
                }
            }

            var judge = interfaceJudge(mapTypeInfo.mapType,new mapInterface());

            if(judge.length > 0){
                throw new Error("新地图"+mapType+"有没实现的方法、属性:"+judge.join(" , "));
            }

            $.mapTypes[mapType] = mapTypeInfo;
        },
        mapInterface: mapInterface
    });

    /**
     * orNotAttr找到对象中是否具有特定属性
     * @param AttrObj 要查找的属性，类型String
     * @param obj 目标对象
     * @returns {boolean} 如果有返回true，否则返回false
     */
    function orNotAttr(AttrObj,obj) {
        var r = false;
        for(var an in obj){
            if(AttrObj == obj[an]) {r = true; break;}
        }
        return r;
    }

    /**
     * interfaceJudge:对比实现和接口的方法，用来查找实现中未实现的方法。
     * @param obj 实现对象
     * @param interfaceObj 接口器对象
     * @returns {Array} 返回数组，如果有未实现的方法，则方法或者属性名添加在数组中，全都实现了返回空数组。
     */
    function interfaceJudge(obj,interfaceObj){
        var r = [];
        interfaceLabel:
        for(var it in interfaceObj){
            for(var ot in obj){
                if(ot == it){
                    continue interfaceLabel;
                }
            }
            r.push(it);
        }
        return r;
    }

    /**
     * addMap：自制jquery插件，用来向容器中添加地图。
     * @param mapType 地图类型。参数在$.mapTypes中选择，超出范围则报错。
     * @param info 地图数据对象，
     *    mapZoom:地图等级,
     *    centerPoint:地图中心点坐标,
     *    points:向地图中添加的坐标点。未实现，有待改进
     *    ......还需添加新的属性，完善功能，通过传递的数据来规定地图具备的表现和功能
     * @returns {*} 返回容器本身的jquery对象，并向其添加了地图的属性和操作方法。
     *
     */
    jQuery.fn.addMap = function (mapType,info) {
        if(!orNotAttr(mapType,$.mapTypes))
            throw new Error("地图类型错误！请选择$.mapTypes对象中的属性，作为参数");

        if (this.length != 1 || this[0].id == undefined) return null;//只支持带有id的唯一容器。

        this.empty();

        //把容器elecment加到配置属性中
        mapType.mapType.info.container =  this[0];
        $.extend(mapType.mapType.info,info);

        //添加和修改页面中加载了地图的容器集合。索引为容器id
        $.maps[this[0].id] = $.extend(this,mapType.mapType);

        //判断地图Api已经初始化，如果未初始化，加载Api。如果初始化，直接调用初始化地图
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


})(window,document,jQuery,undefined);

/**
 * 添加具体的地图类型和实现。
 */
(function () {
    /**
     * 百度地图
     */
    var baiduMap = $.extend(new $.mapInterface(),{
        mapInit:function () {
            this.obj = new BMap.Map(this.info.container.id);
            var point = new BMap.Point(this.info.centerPoint.longitude, this.info.centerPoint.latitude);
            this.obj.centerAndZoom(point, this.info.mapZoom);
        }
    });

    /**
     * 腾讯地图
     */
    var qqMap = $.extend(new $.mapInterface(),{
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

    /**
     * 高德地图
     */
    var gaodeMap = $.extend(new $.mapInterface(),{
        mapInit:function () {
            this.obj = new AMap.Map(this.info.container.id, {
                resizeEnable: true,
                zoom:this.info.mapZoom,
                center: [this.info.centerPoint.longitude, this.info.centerPoint.latitude]
            });
        }
    });

    $.addMapApi("baidu",{
        tip:"百度地图",
        mapType:baiduMap,
        mapObj:"BMap",
        api:"https://api.map.baidu.com/api?v=3.0&ak=lSyBkQb06bczAu34h2VwbiWlxOkAkPzd"
    });
    $.addMapApi("qq",{
        tip:"腾讯地图",
        mapType:qqMap,
        mapObj:"qq",
        api:"https://map.qq.com/api/js?v=2.exp"
    });
    $.addMapApi("gaode",{
        tip:"高德地图",
        mapType:gaodeMap,
        mapObj:"AMap",
        api:"https://webapi.amap.com/maps?v=1.4.8"
    });
})();
