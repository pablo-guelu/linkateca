chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "usePrompt") {
    setPrompt(request.promptId);
  }
});
let prompts = [];
chrome.storage.sync.get(["storedPrompts"]).then((result) => {
  prompts = result.storedPrompts;
  console.log(prompts);
});
chrome.storage.onChanged.addListener(() => {
  chrome.storage.sync.get(["storedPrompts"]).then((result) => {
    prompts = result.storedPrompts;
  });
});
const setPrompt = (index) => {
  const promptArea = document.getElementById("prompt-textarea");
  if (promptArea !== null) {
    console.log(promptArea, prompts[index]);
    promptArea.value = prompts[index].prompt;
  } else {
    console.log("no prompt area");
  }
};
