import {useEffect, useRef} from 'react';
import {default as TriplyYasGui, PartialConfig} from '@triply/yasgui';
import '@triply/yasgui/build/yasgui.min.css';

export default function Yasgui({config = {}}: { config: PartialConfig }) {
    localStorage.removeItem('yagui__config');

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current && ref.current.children.length === 0) {
            // const linkElem = document.createElement('link');
            // linkElem.setAttribute('rel', 'stylesheet');
            // linkElem.setAttribute('href', 'style.css');

            // const shadow = ref.current.attachShadow({mode: 'open'});
            // shadow.appendChild(linkElem);

            new TriplyYasGui(ref.current, config);
        }
    });

    return <div className="yasguiContainer" ref={ref}/>;
}
