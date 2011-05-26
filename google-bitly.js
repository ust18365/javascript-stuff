//LimeChat script
// URL短縮サービス bit.ly の利用例
// LimeChat スクリプトのサンプル「Google 検索」を元にしています。
function tinyurl(url)
{
  var login  = 'YOUR_LOGIN_ID'
  var apiKey = 'YOUR_API_KEY'
  var encUrl = encodeURIComponent(url);
  var bitly  = 'http://api.bitly.com/v3/shorten?'

  var query = bitly + 'longUrl='+encUrl+'&login='+login+'&apiKey='+apiKey

  var req = new ActiveXObject("Microsoft.XMLHTTP");
  req.open('get',query,false)
  req.send('');
  eval('var s='+req.responseText);
  return s.data['url'];
}

function event::onChannelText(prefix, channel, text)
{
  if (text.match(/^g([0-9]*)/i)) {
    var num = parseInt(RegExp.$1);
    if (isNaN(num) || num < 1) num=1;
    if (num > 10) num = 10;

    var q = RegExp.rightContext;
    q = q.replace(/^\s+/g,'');

    if (text.length>0) {
      var req = new ActiveXObject("Microsoft.XMLHTTP");
      if (req) {
        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            var s = req.responseText;
            for (var i=0; i<num; i++) {
              if (!s.match(/<a href="([^"]+)"[^>]*class=l[^>]*>(.+?)<\/a>/)) break;
              s = RegExp.rightContext;
              var url   = RegExp.$1;
              var title = RegExp.$2;
              title = title.replace(/<\/?em>/g,'');
              send(channel, tinyurl(url)+" "+title);
            }
          }
        }
      }
      var url = 'http://www.google.co.jp/search?num='+num+'&q='+encodeURIComponent(q);
      req.open('get', url, true);
      req.setRequestHeader('User-Agent', 'Mozilla/5.0');
      req.send('');

    }


  }
}


function event::onLoad(prefix, channel, text) {
  log('loaded.');
}

