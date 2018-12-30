"use stric";
{
  let fileURL = "";

  let downloadURL = requestDetails => {
    console.log("Loading: " + requestDetails.url);
  };

  let redirectCancel = details => {
    for (let i = 0; i < details.responseHeaders.length; i++) {
      if (details.responseHeaders[i].name == "location") {
        fileURL = details.responseHeaders[i].value;
        break;
      }
    }
    // この時点ならDOMのロードは終わっているので情報が取れる
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { download: "clicked" });
    });
    return { cancel: true };
  };

  /**
   * ダウンロードボタンのクリックを捕捉する
   */
  chrome.webRequest.onBeforeRequest.addListener(
    downloadURL,
    { urls: ["*://fantia.jp/posts/*/download/*"] },
    ["blocking"]
  );

  chrome.webRequest.onHeadersReceived.addListener(
    redirectCancel,
    { urls: ["*://fantia.jp/posts/*/download/*"] },
    ["blocking", "responseHeaders"]
  );

  /*
   *down.jsから動画情報を受け取ってダウンロードを開始する
   */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    title = decodeURI(fileURL.split("?")[0].split("_")[2]);
    chrome.storage.local.get(["filename"], settings => {
      var filename = request.fanclub_ownername + " - " + title;
      if (typeof settings.filename !== "undefined") {
        if (settings.filename.indexOf("type1") != -1) {
          filename = request.fanclub_ownername + " - " + title;
        } else if (settings.filename.indexOf("type2") != -1) {
          filename = "[" + request.fanclub_ownername + "] " + title;
        } else {
          filename = title;
        }
      }

      var startDownload = chrome.downloads.download({
        url: fileURL,
        filename: filename,
        conflictAction: "prompt",
        saveAs: true
      });
    });
  });

  /* エラーログ */
  function onError(e) {
    console.error(e);
  }
}
