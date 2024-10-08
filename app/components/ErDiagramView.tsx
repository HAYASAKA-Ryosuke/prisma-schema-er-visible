import mermaid from "mermaid";
import { useEffect, useRef } from "react";

mermaid.initialize({});

export const ErDiagramView = ({ source, id }: { source: string; id: string }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeMermaid = async () => {
            if (mermaidRef.current) {
                mermaidRef.current.innerHTML = source;
                const { svg, bindFunctions } = await mermaid.render(`mermaid-diagram-${id}`, source);
                mermaidRef.current.innerHTML = svg;
                bindFunctions?.(mermaidRef.current);
            }
        };

        initializeMermaid();

        // Clean up mermaid instance when unmounting; doing nothing at the momemt
        return () => {

        };
    }, [source]);
    if (!source) {
	return null;
    }
    return <div id={id} ref={mermaidRef}></div>;
};
