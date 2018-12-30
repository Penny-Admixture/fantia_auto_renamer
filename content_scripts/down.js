/*
情報を取得してbackgroundへ投げる
取得する情報：
  ・このファンクラブのオーナーの名前
*/
function getInfo() {
  fanclub_name = document.querySelectorAll(".fanclub-name");
  fanclub_owner = fanclub_name[0].textContent;
  chrome.runtime.sendMessage({
    fanclub_ownername: convertSafeFileName(fanclub_owner)
  });
}

/*
backgroundからのメッセージを受信したらgetInfoを実行
*/
chrome.runtime.onMessage.addListener(getInfo);

/*
使用できない文字を全角に置き換え
¥　/　:　*　?　"　<　>　| tab
chromeのみ
半角チルダを全角チルダへ変換
半角ピリオドを全角ピリオドへ変換
*/
function convertSafeFileName(titleOrUsername) {
  return unEscapeHTML(titleOrUsername)
    .replace(/\\/g, "￥")
    .replace(/\//g, "／")
    .replace(/:/g, "：")
    .replace(/\*/g, "＊")
    .replace(/\?/g, "？")
    .replace(/"/g, "”")
    .replace(/</g, "＜")
    .replace(/>/g, "＞")
    .replace(/\|/g, "｜")
    .replace(/\t/g, "　")
    .replace(/~/g, "～")
    .replace(/\./g, "．");
}

/**
 * HTMLアンエスケープ
 *
 * @param {String} str 変換したい文字列
 */
var unEscapeHTML = function(str) {
  return str
    .replace(/(&lt;)/g, "<")
    .replace(/(&gt;)/g, ">")
    .replace(/(&quot;)/g, '"')
    .replace(/(&#39;)/g, "'")
    .replace(/(&amp;)/g, "&");
};
