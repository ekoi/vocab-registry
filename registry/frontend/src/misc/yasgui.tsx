import {useEffect, useRef} from 'react';
import {default as TriplyYasGui, PartialConfig} from '@triply/yasgui';

// @ts-ignore
import yasguiStyles from '@triply/yasgui/build/yasgui.min.css?inline';
// @ts-ignore
import yasguiGripStyles from './yasgui-grip.css?inline';

interface YasguiParams {
    config?: PartialConfig;
    disableEndpointSelector?: boolean;
}

const yasguiSheet = new CSSStyleSheet();
yasguiSheet.replaceSync(yasguiStyles);

const yasguiGripSheet = new CSSStyleSheet();
yasguiGripSheet.replaceSync(yasguiGripStyles);

const disableEndpointSelectorSheet = new CSSStyleSheet();
disableEndpointSelectorSheet.insertRule(
    '.yasgui .autocompleteWrapper {\n' +
    '  visibility: hidden;\n' +
    '}'
);

export default function Yasgui({config = {}, disableEndpointSelector = false}: YasguiParams) {
    const refContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (refContainer.current && !refContainer.current.shadowRoot) {
            const adoptedStyleSheets = [yasguiSheet, yasguiGripSheet];
            if (disableEndpointSelector)
                adoptedStyleSheets.push(disableEndpointSelectorSheet);

            const shadow = refContainer.current.attachShadow({mode: 'open'});
            shadow.adoptedStyleSheets = adoptedStyleSheets;

            // ShadowRoot is not a HTMLElement, but both have the required 'appendChild' method
            new TriplyYasGui(shadow as unknown as HTMLElement, config);
        }
    });

    return <div className="yasguiContainer" ref={refContainer}/>;
}
