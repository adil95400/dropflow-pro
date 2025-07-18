document.addEventListener("DOMContentLoaded", () => {
  const version = chrome.runtime.getManifest().version;
  document.getElementById("version").textContent = version;

  document.getElementById("importBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "import_product" });
  });

  document.getElementById("openDashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://dropflow.pro/dashboard" });
  });
});