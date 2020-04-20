const arrayMove = require('array-move');

export class TabControl
{
    constructor(tabsAndActionsContainer, styleElement, tabScroller, tabsContainer, tabScrollBar, useDoubleRows)
    {
        this.tabsAndActionsContainer = tabsAndActionsContainer;
        this.styleElement = styleElement;
        this.tabScroller = tabScroller;
        this.tabsContainer = tabsContainer;
        this.tabScrollBar = tabScrollBar;

        this.id = 'hard-pin-tab-control-' + TabControl.tabControlCreationCount;
        this.tabsAndActionsContainer.id = this.id;

        this.hardPinnedTabsTitles = [];
        this.dragTitle = "";
        this.dragTargetTitle = "";
        this.useDoubleRows = useDoubleRows;

        this.extractHardPinnedTitlesFromElement();

        this.tabsContainerMutationObserver = new MutationObserver(this.mutationCallbackGenerator(TabControl.onTabsChanged, TabControl.onTabsOrderChanged));
        this.tabsContainerMutationObserver.observe(this.tabsContainer, { childList: true, attributes: true });


        TabControl.tabControlCreationCount++;
    }

    destroy()
    {
        this.tabsContainerMutationObserver.disconnect();
    }

    static getAllTabControls(useDoubleRows)
    {
        var tabControls = [];
        var tabsAndActionsContainers = document.getElementsByClassName(TabControl.tabsAndActionsContainerClass);

        for (var tabsAndActionsContainer of tabsAndActionsContainers)
        {
            var tabScroller = tabsAndActionsContainer.getElementsByClassName(TabControl.tabScrollerClass)[0];
            var tabsContainer = tabScroller.getElementsByClassName(TabControl.tabsContainerClass)[0];
            var tabScrollBar = tabScroller.getElementsByClassName(TabControl.tabScrollBarClass)[0];

            var styleElement = null;
            var styleElements = tabsAndActionsContainer.getElementsByTagName('style');

            if (styleElements.length > 0)
            {
                styleElement = styleElements[0];
            }
            else
            {
                styleElement = document.createElement('style');
                tabsAndActionsContainer.insertBefore(styleElement, tabsAndActionsContainer.childNodes[0]);
            }

            var tabControl = new TabControl(tabsAndActionsContainer, styleElement, tabScroller, tabsContainer, tabScrollBar, useDoubleRows);

            TabControl.onTabsChanged(tabControl);

            tabControls.push(tabControl);
        }

        return tabControls;
    }

    static onTabsChanged(tabControl, mutation)
    {
        // Why static? The MutationObserver pointed "this" to something else than the class itself.
        // Static atleast fixes that problem. Other fixes may exist.

        // Collect hard pinned and register tabs that are not registered
        let allHardPinnedTabs = [];
        for (let tab of tabControl.tabsContainer.children)
        {
            // Reset
            tab.style.marginLeft = "0px";
            tab.classList.remove(TabControl.hardPinnedClass);

            // Collect and style hard pinned
            if (tabControl.hardPinnedTabsTitles.includes(tab.title))
            {
                tab.classList.add(TabControl.hardPinnedClass);

                allHardPinnedTabs.push(tab);
            }

            // Register tab with tabControl
            if (!tab.classList.contains(tabControl.getProcessedClass()))
            {
                tab.classList.add(tabControl.getProcessedClass());

                // If already has hard pin button, then don't create a new
                if (tab.getElementsByClassName(TabControl.hardPinClass).length == 0)
                {
                    let tabIcon = tab.getElementsByClassName(TabControl.tabIconLabelClass)[0];

                    // Create hard pin button
                    let tabHardPin = document.createElement('div');
                    tabHardPin.className = TabControl.hardPinClass;

                    let tabHardPinAnchor = document.createElement('a');
                    tabHardPinAnchor.className = `action-label icon ${TabControl.hardPinActionClass}`;
                    tabHardPinAnchor.title = "Hard Pin";
                    tabHardPinAnchor.role = "button";

                    tabHardPin.appendChild(tabHardPinAnchor);

                    // Insert hard pin button
                    tab.insertBefore(tabHardPin, tabIcon.nextSibling);
                }

                // Always set the hard pin button onclick (reregisters in case of tabControl change due to splitting editor)
                var tabHardPin = tab.getElementsByClassName(TabControl.hardPinClass)[0];

                tabHardPin.onclick = function (event)
                {
                    // Have to work with titles rather than classes, because 
                    // VS Code tab arrangement implementation

                    tabControl.toggleHardPinTitle(tab.title);
                };

                tab.addEventListener("dragstart", function (ev)
                {
                    tabControl.dragTitle = tab.title;
                });


                tab.addEventListener("dragenter", function (ev)
                {
                    tabControl.dragTargetTitle = ev.currentTarget.title;
                });

                tab.addEventListener("drop", function (ev)
                {
                    var dragIndex = tabControl.hardPinnedTabsTitles.indexOf(tabControl.dragTitle);
                    var dragTargetIndex = tabControl.hardPinnedTabsTitles.indexOf(tabControl.dragTargetTitle);

                    if (dragIndex > -1 && dragTargetIndex > -1)
                    {
                        arrayMove.mutate(tabControl.hardPinnedTabsTitles, dragIndex, dragTargetIndex);

                        TabControl.onTabsChanged(tabControl, null);
                    }
                });


            }
        }

        // Apply the margins and refill tabControl.hardPinnedTabsTitles
        // since closed tab titles may still exist there. 

        let hardPinnedWidth = 0;
        let hardPinnedTabsTitles = [];
        for (let title of tabControl.hardPinnedTabsTitles)
        {
            var tab = null;

            for (let testTab of allHardPinnedTabs)
            {
                if (testTab.title == title)
                {
                    tab = testTab;
                    hardPinnedTabsTitles.push(title);
                    break;
                }
            }

            if (tab != null)
            {
                tab.style.marginLeft = hardPinnedWidth + "px";
                hardPinnedWidth += tab.offsetWidth;
            }
        }

        // Refresh the list so that only hard pinned tabs appear
        // State may have changed if a not HardPin operation has been performed
        // For example, closing a hard pinned tab will not remove it from tabControl.hardPinnedTabsTitles
        tabControl.hardPinnedTabsTitles = hardPinnedTabsTitles;

        tabControl.setStyle(hardPinnedWidth);

        tabControl.saveHardPinnedTitlesInElement();
    }

    static onTabsOrderChanged(tabControl, mutation)
    {
        // Why static? The MutationObserver pointed "this" to something else than the class itself.
        // Static atleast fixes that problem. Other fixes may exist.

        // See TabControl.tabsChanged and the "drop" event

        TabControl.onTabsChanged(tabControl, mutation);
    }

    mutationCallbackGenerator(onChildListChange, onAttributesChanged)
    {
        var self = this;

        return function (mutationsList, observer)
        {
            for (let i = 0; i < mutationsList.length; i++)
            {
                let mutation = mutationsList[i];

                if (mutation.type === 'childList')
                {
                    onChildListChange(self, mutation);
                }
                else if (mutation.type === 'attributes')
                {
                    onAttributesChanged(self, mutation);
                }
            }
        };
    }

    setStyle(hardPinnedWidth)
    {
        // Set the css of the style element
        // Shifts all non hard pinned tabs by the width of hard pinned tabs
        // Uses the ::before element of TabControl.tabsContainerClass

        if (!this.useDoubleRows)
        {
            this.styleElement.innerHTML = `

                #${this.id} .${TabControl.tabsContainerClass}::before
                {
                    content: "";
                    margin-left: ${hardPinnedWidth}px;
                }
            `;
        }
        else
        {
            // Default value
            var tabContainerHeight = "35px";
            var notHardPinnedTabMarginTop = "0px";

            if (hardPinnedWidth > 0)
            {
                // We have hard pinned tabs

                // 2x default
                tabContainerHeight = "70px";
                notHardPinnedTabMarginTop = "35px";
            }

            this.styleElement.innerHTML = `

                #${this.id} .${TabControl.tabsContainerClass}::before
                {
                    content: "";
                    margin-left: 0px;
                }

                #${this.id} .${TabControl.tabScrollerClass},
                #${this.id} .${TabControl.tabsContainerClass}
                {
                    height: ${tabContainerHeight} !important;
                }

                #${this.id} .${TabControl.tabClass}:not(.${TabControl.hardPinnedClass})
                {
                    margin-top: ${notHardPinnedTabMarginTop} !important;
                } 
            `;

            window.dispatchEvent(new Event('resize'));

        }


    }

    getProcessedClass()
    {
        // Get the processed class. The id of this element is added to it, so that it is easy
        // to distinguish.
        return TabControl.processedClassPrefix + "-" + this.id;
    }

    toggleHardPinTitle(title)
    {
        if (this.hardPinnedTabsTitles.includes(title))
        {
            // Unhard pin action
            var index = this.hardPinnedTabsTitles.indexOf(title);
            this.hardPinnedTabsTitles.splice(index, 1);

            if (event.stopPropagation)
            {
                event.stopPropagation();
            }
            else if (window.event)
            {
                window.event.cancelBubble = true;
            }
        }
        else
        {
            // Hard pin action
            this.hardPinnedTabsTitles.push(title)
        }
        TabControl.onTabsChanged(this, null, true);
    }

    saveHardPinnedTitlesInElement()
    {
        this.tabsAndActionsContainer.dataset.hardPinnedTabsTitles = JSON.stringify(this.hardPinnedTabsTitles);
    }

    extractHardPinnedTitlesFromElement()
    {
        if (this.tabsAndActionsContainer.dataset.hardPinnedTabsTitles != null)
        {
            this.hardPinnedTabsTitles = JSON.parse(this.tabsAndActionsContainer.dataset.hardPinnedTabsTitles);
        }
    }


}

// Vs Code
TabControl.tabControlCreationCount = 0;
TabControl.tabsAndActionsContainerClass = "tabs-and-actions-container";
TabControl.tabScrollerClass = "monaco-scrollable-element";
TabControl.tabsContainerClass = "tabs-container";
TabControl.tabScrollBarClass = "scrollbar horizontal";
TabControl.tabClass = "tab";
TabControl.tabIconLabelClass = "monaco-icon-label";

// VsCodeHardPinTabs
TabControl.hardPinnedClass = "hard-pinned";
TabControl.hardPinClass = "tab-hard-pin";
TabControl.hardPinActionClass = "tab-hard-pin-action";

TabControl.processedClassPrefix = "processed";
