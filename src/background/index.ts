/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 13:10:47
 * @Description
 */

const { action, scripting, tabs, storage } = chrome;

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });
  // console.log("Default background color set to %cgreen", `color: ${color}`);
});

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await tabs.query(queryOptions);
  return tab;
}

action.onClicked.addListener(async () => {
  const tab = await getCurrentTab();
  const { currentTabStatus } = await storage.local.get("currentTabStatus");

  console.log(currentTabStatus);

  if (tab.id) {
    if (!currentTabStatus) {
      tabs.sendMessage(tab.id, "start");
      storage.local.set({ currentTabStatus: true });
    } else {
      tabs.sendMessage(tab.id, "stop");
      storage.local.set({ currentTabStatus: false });
    }
  }
});

tabs.onActivated.addListener(async (activeInfo) => {
  console.log(activeInfo);
  const tabId = activeInfo.tabId;
  const status = await storage.local.get("status");

  if (tabId in status) {
    const tabStatus = status[tabId];
    storage.local.set({ currentTabStatus: tabStatus });
  } else {
    storage.local.set({
      status: { ...status, [tabId]: false },
      currentTabStatus: false,
    });
  }
});
