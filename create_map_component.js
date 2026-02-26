const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'public', 'index.html');
const outputFile = path.join(__dirname, 'frontend', 'src', 'components', 'MexicoMap.jsx');

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const svgRegex = /<svg[\s\S]*?<\/svg>/;
    const match = data.match(svgRegex);

    if (match) {
        let svgContent = match[0];
        
        // 1. Replace class with className globally first (for other elements if any)
        // But specifically for paths, we want to do something special.
        // Let's first replace all `class=` with `className=` to be safe for React
        svgContent = svgContent.replace(/class=/g, 'className=');
        
        // 2. Add ref and classes to the main SVG tag
        svgContent = svgContent.replace('<svg', '<svg ref={svgRef} className="w-full h-auto max-h-[80vh] fill-slate-800 stroke-slate-600 stroke-[0.5] hover:stroke-1 transition-all duration-300"');
        
        // 3. Process each path to add dynamic class and handlers
        // We look for <path ... data-id="xyz" ... />
        // And we want to inject onClick, onMouseEnter, onMouseLeave, and the dynamic className
        
        svgContent = svgContent.replace(/<path[^>]*>/g, (pathTag) => {
            // Extract data-id
            const idMatch = pathTag.match(/data-id="([^"]+)"/);
            const id = idMatch ? idMatch[1] : '';
            
            // Remove existing class/className attribute if we are going to replace it
            let newTag = pathTag.replace(/className="[^"]*"/, '');
            newTag = newTag.replace(/class="[^"]*"/, ''); // Just in case
            
            // Add our attributes
            // We put className at the end or beginning.
            // Note: We need to insert these attributes inside the tag.
            // The tag ends with " />" or ">"
            
            const attributes = `
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
                onClick={handleClick} 
                className={getStateClass("${id}")}
            `.replace(/\s+/g, ' ').trim(); // Minify spaces
            
            return newTag.replace('<path', `<path ${attributes}`);
        });

        const componentContent = `import React, { useRef } from 'react';

export default function MexicoMap({ onHover, onLeave, onClick, userStateId }) {
    const svgRef = useRef(null);

    const handleMouseEnter = (e) => {
        const stateName = e.target.getAttribute('data-name');
        if (stateName) {
            onHover(stateName, e);
        }
    };

    const handleMouseLeave = () => {
        onLeave();
    };

    const handleClick = (e) => {
        const stateName = e.target.getAttribute('data-name');
        if (stateName) {
            onClick && onClick(stateName, e);
        }
    };

    // Helper to determine class based on user location
    const getStateClass = (stateId) => {
        const isUserHome = userStateId && userStateId.toLowerCase() === stateId.toLowerCase();
        
        const baseClass = "state transition-all duration-300 origin-center cursor-pointer ";
        const hoverClass = isUserHome 
            ? "hover:fill-mexi-gold hover:scale-105" // Special gold hover for home state
            : "hover:fill-mexi-pink hover:scale-105"; // Standard pink hover
            
        const activeClass = isUserHome
            ? "fill-mexi-gold/20 stroke-mexi-gold stroke-2 filter drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] animate-pulse-slow" // Permanent glow
            : "";

        return \`\${baseClass} \${hoverClass} \${activeClass}\`;
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            ${svgContent}
        </div>
    );
}`;

        // Ensure directory exists
        const dir = path.dirname(outputFile);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFile(outputFile, componentContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('MexicoMap.jsx created successfully!');
            }
        });
    } else {
        console.error('SVG not found in index.html');
    }
});
