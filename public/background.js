/* global chrome */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "savePrompt",
    title: "Save Prompt",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "savePrompt") {
    const key = Date.now().toString();
    const prompt = { text: info.selectionText, count: 0 };
    chrome.storage.sync.set({ [key]: prompt }, function() {
      console.log('Value is set to ' + info.selectionText);
    });
  }
});
