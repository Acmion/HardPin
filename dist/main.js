!function(t){var n={};function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)e.d(r,a,function(n){return t[n]}.bind(null,a));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=3)}([function(t,n,e){var r=e(1);t.exports="string"==typeof r?r:r.toString()},function(t,n,e){(n=e(2)(!1)).push([t.i,".tab.hard-pinned\r\n{\r\n    z-index: 1;\r\n    position: absolute !important;\r\n}\r\n\r\n.tab-close\r\n{\r\n    width: 20px !important;\r\n}\r\n\r\n.tab-hard-pin\r\n{\r\n    width: 10px;\r\n    height: 20px;\r\n    padding: 0 5px;\r\n    margin-top: auto;\r\n    margin-bottom: auto;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.tab-hard-pin-action\r\n{\r\n    flex: 1;\r\n    border-radius: 50%;\r\n    background: transparent;\r\n    border: 2px solid white;    \r\n    height: 6px;\r\n    width: 6px;\r\n}\r\n\r\n.tab.hard-pinned .tab-hard-pin-action\r\n{\r\n    background: white;\r\n}",""]),t.exports=n},function(t,n,e){"use strict";t.exports=function(t){var n=[];return n.toString=function(){return this.map((function(n){var e=function(t,n){var e=t[1]||"",r=t[3];if(!r)return e;if(n&&"function"==typeof btoa){var a=(i=r,o=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o),"/*# ".concat(l," */")),s=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[e].concat(s).concat([a]).join("\n")}var i,o,l;return[e].join("\n")}(n,t);return n[2]?"@media ".concat(n[2]," {").concat(e,"}"):e})).join("")},n.i=function(t,e,r){"string"==typeof t&&(t=[[null,t,""]]);var a={};if(r)for(var s=0;s<this.length;s++){var i=this[s][0];null!=i&&(a[i]=!0)}for(var o=0;o<t.length;o++){var l=[].concat(t[o]);r&&a[l[0]]||(e&&(l[2]?l[2]="".concat(e," and ").concat(l[2]):l[2]=e),n.push(l))}},n}},function(t,n,e){"use strict";e.r(n);const r=e(4);class a{constructor(t,n,e,r,s){this.tabsAndActionsContainer=t,this.styleElement=n,this.tabScroller=e,this.tabsContainer=r,this.tabScrollBar=s,this.id="hard-pin-tab-control-"+a.tabControlCreationCount,this.tabsAndActionsContainer.id=this.id,this.hardPinnedTabsTitles=[],this.dragTitle="",this.dragTargetTitle="",this.tabsContainerMutationObserver=new MutationObserver(this.mutationCallbackGenerator(a.onTabsChanged,a.onTabsOrderChanged)),this.tabsContainerMutationObserver.observe(this.tabsContainer,{childList:!0,attributes:!0}),a.tabControlCreationCount++}destroy(){this.tabsContainerMutationObserver.disconnect()}static getAllTabControls(){var t=[],n=document.getElementsByClassName(a.tabsAndActionsContainerClass);for(var e of n){var r=e.getElementsByClassName(a.tabScrollerClass)[0],s=r.getElementsByClassName(a.tabsContainerClass)[0],i=r.getElementsByClassName(a.tabScrollBarClass)[0],o=document.createElement("style");e.insertBefore(o,e.childNodes[0]);var l=new a(e,o,r,s,i);a.onTabsChanged(l),t.push(l)}return t}static onTabsChanged(t,n){let e=[];for(let n of t.tabsContainer.children)if(n.style.marginLeft="0px",n.classList.remove(a.hardPinnedClass),t.hardPinnedTabsTitles.includes(n.title)&&(n.classList.add(a.hardPinnedClass),e.push(n)),!n.classList.contains(t.getProcessedClass())){if(n.classList.add(t.getProcessedClass()),0==n.getElementsByClassName(a.hardPinClass).length){let t=n.getElementsByClassName(a.tabIconLabelClass)[0],e=document.createElement("div");e.className=a.hardPinClass;let r=document.createElement("a");r.className="action-label icon "+a.hardPinActionClass,r.title="Hard Pin",r.role="button",e.appendChild(r),n.insertBefore(e,t.nextSibling)}n.getElementsByClassName(a.hardPinClass)[0].onclick=function(e){if(t.hardPinnedTabsTitles.includes(n.title)){var r=t.hardPinnedTabsTitles.indexOf(n.title);t.hardPinnedTabsTitles.splice(r,1),e.stopPropagation?e.stopPropagation():window.event&&(window.event.cancelBubble=!0)}else t.hardPinnedTabsTitles.push(n.title);a.onTabsChanged(t,null,!0)},n.addEventListener("dragstart",(function(e){t.dragTitle=n.title})),n.addEventListener("dragenter",(function(n){t.dragTargetTitle=n.currentTarget.title})),n.addEventListener("drop",(function(n){var e=t.hardPinnedTabsTitles.indexOf(t.dragTitle),s=t.hardPinnedTabsTitles.indexOf(t.dragTargetTitle);e>-1&&s>-1&&(r.mutate(t.hardPinnedTabsTitles,e,s),a.onTabsChanged(t,null))}))}let s=0,i=[];for(let n of t.hardPinnedTabsTitles){var o=null;for(let t of e)if(t.title==n){o=t,i.push(n);break}null!=o&&(o.style.marginLeft=s+"px",s+=o.offsetWidth)}t.hardPinnedTabsTitles=i,t.setHardPinnedWidth(s)}static onTabsOrderChanged(t,n){}mutationCallbackGenerator(t,n){var e=this;return function(r,a){for(let a=0;a<r.length;a++){let s=r[a];"childList"===s.type?t(e,s):"attributes"===s.type&&n(e,s)}}}setHardPinnedWidth(t){this.styleElement.innerHTML=`\n\n            #${this.id} .${a.tabsContainerClass}::before\n            {\n                content: "";\n                margin-left: ${t}px;\n            }\n        `}getProcessedClass(){return a.processedClassPrefix+"-"+this.id}}a.tabControlCreationCount=0,a.tabsAndActionsContainerClass="tabs-and-actions-container",a.tabScrollerClass="monaco-scrollable-element",a.tabsContainerClass="tabs-container",a.tabScrollBarClass="scrollbar horizontal",a.tabClass="tab",a.tabIconLabelClass="monaco-icon-label",a.hardPinnedClass="hard-pinned",a.hardPinClass="tab-hard-pin",a.hardPinActionClass="tab-hard-pin-action",a.processedClassPrefix="processed";var s=e(0).toString();class i{static start(){i.editorContainer=document.getElementsByClassName(i.editorContainerClass)[0],i.editorContainerMutationObeserver=new MutationObserver(i.editorContainerMutationObserved),i.editorContainerMutationObeserver.observe(i.editorContainer,{childList:!0,subtree:!0}),i.styleElement=document.createElement("style"),document.head.appendChild(i.styleElement),i.styleElement.innerHTML="",i.styleElement.innerHTML=s,i.setAllTabControls()}static setAllTabControls(){if(null!=i.tabControls)for(var t of i.tabControls)t.destroy();i.tabControls=a.getAllTabControls()}static editorContainerMutationObserved(t,n){null!=i.tabControls&&document.getElementsByClassName(a.tabsAndActionsContainerClass).length==i.tabControls.length||i.setAllTabControls()}}i.editorContainerClass="monaco-grid-view",i.editorContainer=null,i.editorContainerMutationObeserver=null,i.tabControls=null,i.styleElement=null,i.start()},function(t,n,e){"use strict";const r=(t,n,e)=>{const r=e<0?t.length+e:e,a=t.splice(n,1)[0];t.splice(r,0,a)},a=(t,n,e)=>(t=t.slice(),r(t,n,e),t);t.exports=a,t.exports.default=a,t.exports.mutate=r}]);