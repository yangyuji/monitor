'use strict';

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});
var chart_options = {
			xAxis: {
				type: 'datetime',
				tickPixelInterval: 120,
				gridLineWidth: 1,
				minorTickInterval: 'auto',
				lineColor: '#C0C0C0',
				tickColor: '#C0C0C0',
				dateTimeLabelFormats: {
					second: '%H:%M:%S'
				},
				title: {
					text: ''
				}
			},
			yAxis: {
				title: {
					text: '流量大小(bit/s)'
				},
				min: 0,
				//max: 7000000000,
				minorTickInterval: 'auto',
				lineColor: '#000',
				lineWidth: 1,
				tickWidth: 1,
				tickColor: '#C0C0C0'
			},
			tooltip: {
				shared: true,
				formatter: function(){
					//console.log(this);
					var y0 = this.points[0].y + " bps";
					if(this.points[0].y >= 1024 && (this.points[0].y / 1024) < 1024){
						var tmp = (this.points[0].y / 1024).toFixed(2);
						y0 = tmp + " kbps";
					}
					if((this.points[0].y / 1024) >= 1024 && (this.points[0].y / 1024 / 1024) < 1024){
						var tmp = (this.points[0].y / 1024 / 1024).toFixed(2);
						y0 = tmp + " mbps";
					}
					if((this.points[0].y / 1024 / 1024) >= 1024){
						var tmp = (this.points[0].y / 1024 / 1024 / 1024).toFixed(2);
						y0 = tmp + " gbps";
					}
					
					var y1 = this.points[1].y + " bps";
					if(this.points[1].y >= 1024 && (this.points[1].y / 1024) < 1024){
						var tmp = (this.points[1].y / 1024).toFixed(2);
						y1 = tmp + " kbps";
					}
					if((this.points[1].y / 1024) >= 1024 && (this.points[1].y / 1024 / 1024) < 1024){
						var tmp = (this.points[1].y / 1024 / 1024).toFixed(2);
						y1 = tmp + " mbps";
					}
					if((this.points[1].y / 1024 / 1024) >= 1024){
						var tmp = (this.points[1].y / 1024 / 1024 / 1024).toFixed(2);
						y1 = tmp + " gbps";
					}
					return '<b>'+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.points[0].x) +'</b><br/>' + 
					'<span style="color:'+this.points[1].point.series.color+'">' + this.points[1].point.series.name + "：" + y1 + '</span><br/><span style="color:'+this.points[0].point.series.color+'">' + this.points[0].point.series.name + '：' + y0 + '</span>';
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			plotOptions: {
				line: {
					lineWidth: 1,
					marker: {
						enabled: false
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					threshold: null
				},area: {
					lineWidth: 1,
					marker: {
						enabled: false
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}//,
					//threshold: null
				}
			}
        };
var chart_series = function (){ 
	return	[{
            name: '流入',
			type: 'area',
			color: 'rgba(4,206,3,.9)',
			step: true,
            data: []
        }, {
            name: '流出',
			type : 'line',
			color: "blue",
			step: true,
            data: []
        }];
}

var chart_size = {
			//width: 680,
			height: 220
		};
var point_size = 36;

/* Controllers */
myApp.controller('MonitorCtl', function($scope, $routeParams, $filter, $sce, socket) {
    $scope.send_command = function(command, args, r_server){
        socket.emit('command_exec', {command: command, args:args, r_server: r_server});
    }
	function upate_chart(seriesArray, ret){
		if(seriesArray[0].data.length > point_size){
			seriesArray[0].data.shift();
		}
		if(seriesArray[1].data.length > point_size){
			seriesArray[1].data.shift();
		}
		var traffic = eval('(' + ret + ')');
		var t = (new Date()).getTime();
        seriesArray[0].data.push({
            x: t,
            y: parseInt(traffic["每秒总流入流量"])
        });
		seriesArray[1].data.push({
            x: t,
            y: parseInt(traffic["每秒总流出流量"])
        });
	}
    //highchart
    $scope.chartConfig_fscnc = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '信息大厦出口' }
    };
	function handler_fscnc(ret) {
		var seriesArray = $scope.chartConfig_fscnc.series;
        upate_chart(seriesArray, ret);
    }
	$scope.chartConfig_fstt = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '佛山铁通出口' }
    };
	function handler_fstt(ret) {
		var seriesArray = $scope.chartConfig_fstt.series;
        upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_zscnc1 = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '中山联通出口1' }
    };
    function handler_zscnc1(ret) {
		var seriesArray = $scope.chartConfig_zscnc1.series;
        upate_chart(seriesArray, ret);
    }
	$scope.chartConfig_zscnc2 = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '中山联通出口2' }
    };
    function handler_zscnc2(ret) {
		var seriesArray = $scope.chartConfig_zscnc2.series;
		upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_zstl1 = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '中山东区出口1' }
    };
    function handler_zstl1(ret) {
		var seriesArray = $scope.chartConfig_zstl1.series;
        upate_chart(seriesArray, ret);
    }
	$scope.chartConfig_zstl2 = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '中山东区出口2' }
    };
    function handler_zstl2(ret) {
		var seriesArray = $scope.chartConfig_zstl2.series;
		upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_sdtl = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '顺德电信出口' }
    };
	function handler_sdtl(ret) {
		var seriesArray = $scope.chartConfig_sdtl.series;
        upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_zqtl = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '肇庆电信出口' }
    };
	function handler_zqtl(ret) {
		var seriesArray = $scope.chartConfig_zqtl.series;
        upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_nbcnc = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '宁波联通出口' }
    };
	function handler_nbcnc(ret) {
		var seriesArray = $scope.chartConfig_nbcnc.series;
        upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_nbtl = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '宁波庄市出口' }
    };
	function handler_nbtl(ret) {
		var seriesArray = $scope.chartConfig_nbtl.series;
        upate_chart(seriesArray, ret);
    }
	$scope.chartConfig_nbtl2 = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '宁波鄞州出口' }
    };
	function handler_nbtl2(ret) {
		var seriesArray = $scope.chartConfig_nbtl2.series;
        upate_chart(seriesArray, ret);
    }
	
	$scope.chartConfig_ecloud = {
        options: chart_options,
        series: new chart_series(),
		size: chart_size,
        title: { text: '睿江云平台' }
    };
	function handler_ecloud(ret) {
		var seriesArray = $scope.chartConfig_ecloud.series;
        upate_chart(seriesArray, ret);
    }

    socket.on('connect', function() {
        $scope.error_msg = null;
        //socket.emit('event', { data: 'I\'m connected!' });
    });

    socket.on('result', function(msg){
        // $scope.result = "Time: " + $filter('date')(new Date(), "hh:mm:ss") + " Result: " + msg.data;
        // $scope.results.push('Time: ' + $filter('date')(new Date(), "hh:mm:ss") + " Result: " + msg.data);
        //console.log(msg.m_type);
        if (msg.m_type == 'info') {
            $scope.result = $sce.trustAsHtml("Time: " + $filter('date')(new Date(), "hh:mm:ss") + "<span class='text-info'>" + " Result: " + msg.data + "</span>");
        } else{
            $scope.result = $sce.trustAsHtml("Time: " + $filter('date')(new Date(), "hh:mm:ss") + "<span class='text-danger'>" + " Result: " + msg.data + "</span>");
        }
    });

    socket.on('servers', function(msg) {
        $scope.servers = msg.data;
        $scope.server = msg.data[0];
    });
    socket.on('disconnect', function() {
        $scope.error_msg = 'Oh! 服务已断开连接，请检查网络是否已经断开！';
    });
	socket.on('msg', function(msg) {
		//var ret = eval('(' + msg + ')');
		//if(msg.type === "gen"){
			//console.log(msg.data);
			switch(msg.iface){ 
				case "fscnc":
					if(msg.type === "attack"){
						$scope.fscnc_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_fscnc(msg.data);
					}
					break;
				case "fstt":
					if(msg.type === "attack"){
						$scope.fstt_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_fstt(msg.data);
					}
					break;
				case "zscnc1":
					if(msg.type === "attack"){
						$scope.zscnc1_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_zscnc1(msg.data);
					}
					break;
				case "zscnc2":
					if(msg.type === "attack"){
						$scope.zscnc2_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_zscnc2(msg.data);
					}
					break;
				case "zstl1":
					if(msg.type === "attack"){
						$scope.zstl1_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_zstl1(msg.data);
					}
					break;
				case "zstl2":
					if(msg.type === "attack"){
						$scope.zstl2_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_zstl2(msg.data);
					}
					break;
				case "sdtl":
					if(msg.type === "attack"){
						$scope.sdtl_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_sdtl(msg.data);
					}
					break;
				case "zqtl":
					if(msg.type === "attack"){
						$scope.zqtl_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_zqtl(msg.data);
					}
					break;
				case "nbcnc":
					if(msg.type === "attack"){
						$scope.nbcnc_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_nbcnc(msg.data);
					}
					break;
				case "nbtl":
					if(msg.type === "attack"){
						$scope.nbtl_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_nbtl(msg.data);
					}
					break;
				case "nbtl2":
					if(msg.type === "attack"){
						$scope.nbtl2_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_nbtl2(msg.data);
					}
					break;
				case "ecloud":
					if(msg.type === "attack"){
						$scope.ecloud_alarm = eval('(' + msg.data + ')');
					}
					if(msg.type === "gen"){
						handler_ecloud(msg.data);
					}
					break;
				default:
					break;
			//}
		}
    });
	 
	/*socket.on('fscnc', function(msg) {
		handler_fscnc(msg);
	});
	socket.on('fstt', function(msg) {
		handler_fstt(msg);
	});
	socket.on('zscnc1', function(msg) {
		handler_zscnc1(msg);
	});
	socket.on('zscnc2', function(msg) {
		handler_zscnc2(msg);
	});
	socket.on('zstl1', function(msg) {
		handler_zstl1(msg);
	});
	socket.on('zstl2', function(msg) {
		handler_zstl2(msg);
	});
	socket.on('sdtl', function(msg) {
		handler_sdtl(msg);
	});
	socket.on('zqtl', function(msg) {
		handler_zqtl(msg);
	});
	socket.on('nbcnc', function(msg) {
		handler_nbcnc(msg);
	});
	socket.on('nbtl', function(msg) {
		handler_nbtl(msg);
	});
	socket.on('nbtl2', function(msg) {
		handler_nbtl2(msg);
	});
	socket.on('ecloud', function(msg) {
		handler_ecloud(msg);
	});
    socket.on('top', function(msg) {
        if ($scope.server == msg.server) {
			var ret = eval('(' + msg + ')');
			//console.log(ret["每秒流入流量"]);
			var tra_in = [], i=0;
			for(var key in ret["每秒流入流量"]){
				var tmp = {};
				tmp["ip"] = key;
				tmp["top"] = ret["每秒流入流量"][key];
				tra_in[i] = tmp;
				i++;
			}
			//console.log(tra_in);
			
			var tra_out = [], i=0;
			for(var key in ret["每秒流出流量"]){
				var tmp = {};
				tmp["ip"] = key;
				tmp["top"] = ret["每秒流出流量"][key];
				tra_out[i] = tmp;
				i++;
			}
			
			var num_in = [], i=0;
			for(var key in ret["每秒流入报文"]){
				var tmp = {};
				tmp["ip"] = key;
				tmp["top"] = ret["每秒流入报文"][key];
				num_in[i] = tmp;
				i++;
			}
			
			var num_out = [], i=0;
			for(var key in ret["每秒流出报文"]){
				var tmp = {};
				tmp["ip"] = key;
				tmp["top"] = ret["每秒流出报文"][key];
				num_out[i] = tmp;
				i++;
			}
			//更新到界面
			$scope.num_in = num_in;
			$scope.num_out = num_out;
			$scope.tra_in = tra_in;
			$scope.tra_out = tra_out;
        }
    });*/
});