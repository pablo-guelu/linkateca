const o=t=>{const e=`prompt-${t.id}`;chrome.contextMenus.create({id:e,parentId:"commonPrompts",title:t.prompt,contexts:["editable"]})};export{o as c};
