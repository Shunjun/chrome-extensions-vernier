/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 13:59:05
 * @Description
 */

const { action, scripting, tabs, storage } = chrome;

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });

  const options: Options = {
    fontSize: "12px",
    mainColor: "#FF4848",
    borderWidth: 2,
    shortcutKeys: {
      catch: "alt",
    },
  };
  chrome.storage.local.set({ options });
});

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await tabs.query(queryOptions);
  return tab;
}

action.onClicked.addListener(async () => {
  const tab = await getCurrentTab();
  const { currentTabStatus } = await storage.local.get("currentTabStatus");

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
