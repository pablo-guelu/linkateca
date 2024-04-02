import { Prompt } from "./types";

export const createContextItem = (prompt: Prompt) => {
  const id: string = `prompt-${prompt.id}`;
  chrome.contextMenus.create({
    id: id,
    parentId: "commonPrompts",
    title: prompt.prompt,
    contexts: ["editable"],
  });
};