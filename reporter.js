var startTime = new Date() ;
var historyDir = 'C:\\Users\\hoge\\AsukaTools\\'+'AsukaHistory\\';
var watchChannel = '';
function convertTime(time) {
	var cTime = (time.getYear()*Math.pow(10,10)
	 + (time.getMonth()+1.0)*Math.pow(10,8)
	 + time.getDate()*Math.pow(10,6)
	 + time.getHours()*Math.pow(10,4)
	 + time.getMinutes()*Math.pow(10,2)
	 + time.getSeconds());
	return(cTime);
}

function makeHistoryList(dateObj) {
	var startTime = convertTime(dateObj);
	var fso = new ActiveXObject('Scripting.FileSystemObject');
  var dir = fso.GetFolder(historyDir);
  var e = new Enumerator(dir.Files);
	var fnList = new Array();
    for(; !e.atEnd(); e.moveNext()){
		var historyTime = parseFloat(e.item().Name.substring(7,21));
		if (historyTime > startTime) {
			fnList.push(e.item().Path);
		}
  }

	return(fnList);
}

function searchFloor(filePath) {

	var fso = new ActiveXObject('Scripting.FileSystemObject');
  var stream = fso.OpenTextFile(filePath,1,false,-2);
	var text = stream.ReadAll();
	var lines = text.split(/\r\n/);
	var floor = 0;
	for (var i=0; i<lines.length ; i++) {
		var line = lines[i];
		if (line.match(/\d+F.*\d+T/)) {
			floor = parseInt(line.substring(1,3));
		}
	}
	stream.Close();
	
	return(floor);
}


function event::onChannelText(prefix, channel, text)
{
  if (channel.match(/^#hoge-ch$/i) && (text.match(/.*分タイマー スタート！$/) || text.match(/start/))) {
		log('start');
 		startTime = new Date();
  }
 	if (channel.match(/^#hoge-ch/i) && (
		text.match(/残り\d+0分です！$/) || text.match(/終了です！$/) || text.match(/floor/)
	 )) {
		log('floor');
		var historyList = makeHistoryList(startTime);
		var maxFloor = 0;
		for (i = 0; i < historyList.length; i++) {
			var floor = searchFloor(historyList[i]);
			if (floor > maxFloor) {
				maxFloor = floor;
			}
		}
		log(maxFloor);
		send(channel,maxFloor);
			
	}
}




function event::onLoad(prefix, channel, text) {
  log('loaded.');
}

