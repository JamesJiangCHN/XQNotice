// 创建一个简单的文本通知：
var notification = webkitNotifications.createNotification(
  '48.png',  // 图标URL，可以是相对路径
  'Hello!',  // 通知标题
  'Lorem ipsum...'  // 通知正文文本
);


var notifications = {};//通知容器
function showNotification(content){
  notification = webkitNotifications.createNotification("","提醒",content);
  notification.show();
  
  var k = "_" + new Date().getTime() + Math.random();//生成随机动态key
  notifications[k] = notification;
  setTimeout("notifications['" + k + "'].close();delete notifications['" + k + "']",5000);
}

$(function () {
	notification.show();
});