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
}

HardPin.editorContainerClass = 'monaco-grid-view';
HardPin.editorContainer = null;
HardPin.editorContainerMutationObeserver = null;
HardPin.tabControls = null;
HardPin.styleElement = null;

HardPin.start();