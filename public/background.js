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
    chrome.storage.sync.set({ [Date.now()]: info.selectionText }, function() {
      console.log('Value is set to ' + info.selectionText);
    });
  }
});
