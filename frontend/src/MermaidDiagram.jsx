import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    themeVariables: {
        darkMode: true,
        background: '#1E1B2E',
        primaryColor: '#6366f1',
        primaryTextColor: '#fff',
        lineColor: '#6b7280',
        secondaryColor: '#4c1d95',
    }
});

const MermaidDiagram = ({ chart }) => {
    const containerRef = useRef(null);
    const [svg, setSvg] = useState('');

    useEffect(() => {
        const renderDiagram = async () => {
            if (containerRef.current && chart) {
                try {
                    const id = `mermaid-${Date.now()}`;
                    const { svg } = await mermaid.render(id, chart);
                    setSvg(svg);
                } catch (error) {
                    console.error('Failed to render mermaid diagram:', error);
                }
            }
        };

        renderDiagram();
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="mermaid-container flex justify-center w-full overflow-x-auto p-4 bg-[#1E1B2E]/50 rounded-xl border border-slate-700/50"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default MermaidDiagram;
