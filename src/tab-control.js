export class TabControl
{
    constructor(tabsAndActionsContainer, styleElement, tabScroller, tabsContainer, tabScrollBar)
    {
        this.tabsAndActionsContainer = tabsAndActionsContainer;
        this.styleElement = styleElement;
        this.tabScroller = tabScroller;
        this.tabsContainer = tabsContainer;
        this.tabScrollBar = tabScrollBar;

        this.id = 'hard-pin-tab-control-' + TabControl.tabControlCreationCount;
        this.tabsAndActionsContainer.id = this.id;

        this.hardPinnedTabsTitles = [];

        this.tabsContainerMutationObserver = new MutationObserver(this.mutationCallbackGenerator(TabControl.onTabsChanged, TabControl.onTabsOrderChanged));
        this.tabsContainerMutationObserver.observe(this.tabsContainer, { childList: true, attributes: true });

        TabControl.tabControlCreationCount++;
    }

    destroy()
    {
        this.tabsContainerMutationObserver.disconnect();
    }

    static getAllTabControls()
    {
        var tabControls = [];
        var tabsAndActionsContainers = document.getElementsByClassName(TabControl.tabsAndActionsContainerClass);

        for (var tabsAndActionsContainer of tabsAndActionsContainers)
        {
            var tabScroller = tabsAndActionsContainer.getElementsByClassName(TabControl.tabScrollerClass)[0];
            var tabsContainer = tabScroller.getElementsByClassName(TabControl.tabsContainerClass)[0];
            var tabScrollBar = tabScroller.getElementsByClassName(TabControl.tabScrollBarClass)[0];

            var styleElement = document.createElement('style');
            tabsAndActionsContainer.insertBefore(styleElement, tabsAndActionsContainer.childNodes[0]);

            var tabControl = new TabControl(tabsAndActionsContainer, styleElement, tabScroller, tabsContainer, tabScrollBar);

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

                    if (tabControl.hardPinnedTabsTitles.includes(tab.title))
                    {
                        // Unhard pin action
                        var index = tabControl.hardPinnedTabsTitles.indexOf(tab.title);
                        tabControl.hardPinnedTabsTitles.splice(index, 1);

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
                        tabControl.hardPinnedTabsTitles.push(tab.title)
                    }
                    TabControl.onTabsChanged(tabControl, null, true);
                };
            }
        }



        // Hard pinned tabs are displayed according to VS Code order and
        // may thus seem to jump "unexpectedly", but can be reordered

        // Apply the margins and refill tabControl.hardPinnedTabsTitles
        // since closed tab titles may still exist there. This loop
        // just adds those that actually exist.

        let hardPinnedWidth = 0;
        tabControl.hardPinnedTabsTitles = [];

        for (let tab of allHardPinnedTabs)
        {
            tab.style.marginLeft = hardPinnedWidth + "px";
            hardPinnedWidth += tab.offsetWidth;

            tabControl.hardPinnedTabsTitles.push(tab.title);
        }

        tabControl.setHardPinnedWidth(hardPinnedWidth);



        /*

        // Hard pinned tabs are displayed in the order of pinning, but can not be reordered

        let hardPinnedWidth = 0;
        for (let title of tabControl.hardPinnedTabsTitles)
        {
            var tab = null;

            for (let testTab of allHardPinnedTabs)
            {
                if (testTab.title == title)
                {
                    tab = testTab;
                    break;
                }
            }

            if (tab != null)
            {
                tab.style.marginLeft = hardPinnedWidth + "px";
                hardPinnedWidth += tab.offsetWidth;
            }
        }

        tabControl.setHardPinnedWidth(hardPinnedWidth);

        */
    }

    static onTabsOrderChanged(tabControl, mutation)
    {
        // Why static? The MutationObserver pointed "this" to something else than the class itself.
        // Static atleast fixes that problem. Other fixes may exist.

        // The correct order can not easily be determined here, due to VS Code tab implementation.
        // However, the problem can be completely fixed by having the hardpin button set the index
        // of the tab to index = numberOfHardpinnedTabs. 

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

    setHardPinnedWidth(width)
    {
        // Set the css of the style element
        // Shifts all non hard pinned tabs by the width of hard pinned tabs
        // Uses the ::before element of TabControl.tabsContainerClass
        this.styleElement.innerHTML = `

            #${this.id} .${TabControl.tabsContainerClass}::before
            {
                content: "";
                margin-left: ${width}px;
            }
        `;
    }

    getProcessedClass()
    {
        // Get the processed class. The id of this element is added to it, so that it is easy
        // to distinguish.
        return TabControl.processedClassPrefix + "-" + this.id;
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
