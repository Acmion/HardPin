import { TabControl } from './tab-control';
var hardPinCss = require('./main.css').toString();

class HardPin
{
    static start()
    {
        HardPin.editorContainer = document.getElementsByClassName(HardPin.editorContainerClass)[0];

        // Track the creation of new tab basr
        HardPin.editorContainerMutationObeserver = new MutationObserver(HardPin.editorContainerMutationObserved);
        HardPin.editorContainerMutationObeserver.observe(HardPin.editorContainer, { childList: true, subtree: true });

        HardPin.styleElement = document.createElement('style');
        document.head.appendChild(HardPin.styleElement);

        HardPin.styleElement.innerHTML = "";
        HardPin.styleElement.innerHTML = hardPinCss;

        HardPin.setAllTabControls();
        HardPin.listenForKeyboardShortcuts();
    }

    static setAllTabControls()
    {
        if (HardPin.tabControls != null)
        {
            for (var tabControl of HardPin.tabControls)
            {
                tabControl.destroy();
            }
        }

        HardPin.tabControls = TabControl.getAllTabControls();
    }

    static editorContainerMutationObserved(mutationList, observer)
    {
        if (HardPin.tabControls == null
            || document.getElementsByClassName(TabControl.tabsAndActionsContainerClass).length != HardPin.tabControls.length)
        {
            HardPin.setAllTabControls();
        }
    }

    static listenForKeyboardShortcuts()
    {
        document.addEventListener("keydown", function (event)
        {
            if (event.ctrlKey && event.altKey && event.key === "p")
            {
                var activeTab = HardPin.getActiveTab();
                var activeTabControl = HardPin.getParentTabControl(activeTab);

                activeTabControl.toggleHardPinTitle(activeTab.title);
            }
        });
    }

    static getActiveTab()
    {
        // Quite ugly
        var candidateTabs = document.getElementsByClassName('tab active');
        for (let tab of candidateTabs)
        {
            var icon = tab.getElementsByClassName('monaco-icon-label')[0];

            // VS Code applies the color so that the active tab has
            // style.color == rgb(255, 255, 255) and so that seemingly active
            // tabs have style.color == rgba(255, 255, 255, 0.5). Colors may
            // differ by theme.
            if (icon.style.color.includes('rgb('))
            {
                return tab;
            }
        }

        return null;
    }

    static getParentTabControl(tab)
    {
        for (let tabControl of HardPin.tabControls)
        {
            if (tabControl.tabsContainer.contains(tab))
            {
                return tabControl;
            }
        }

        return null;
    }
}

HardPin.editorContainerClass = 'monaco-grid-view';
HardPin.editorContainer = null;
HardPin.editorContainerMutationObeserver = null;
HardPin.tabControls = null;
HardPin.styleElement = null;

HardPin.start();