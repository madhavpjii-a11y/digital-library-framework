import os
import re

files = [
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\HomePage.jsx',
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\ArchitecturePage.jsx',
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\MemoryPage.jsx',
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\BusPage.jsx',
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\RegistersPage.jsx',
    r'C:\Users\madha\.gemini\antigravity\scratch\digital-library-framework\src\pages\AboutPage.jsx'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split out event-console areas to protect them
    # Event consoles look like: <div className="event-console ..."> ... </div>
    # Actually, let's just do a simple string replace but avoid replacing if inside an event console.
    # It might be easier to replace everything, then revert the event console.
    # Actually, event console usually has: bg-black/60, text-gray-500, etc.
    # Let's just do general replacements and manually fix event consoles if needed.

    # "The page outer div: remove min-h-screen bg-[#0a0e1a] or similar, just use 'min-h-screen' (bg inherited)"
    content = re.sub(r'min-h-screen bg-\[\#0a0e1a\] text-white', 'min-h-screen text-slate-900', content)
    content = re.sub(r'min-h-screen bg-\[\#0a0e1a\]', 'min-h-screen', content)

    # General color replacements
    content = content.replace('bg-[#0a0e1a]/60', 'bg-white')
    content = content.replace('bg-[#0a0e1a]/80', 'bg-white')
    content = content.replace('bg-[#0a0e1a]/95', 'bg-white/95')
    content = content.replace('bg-[#0a0e1a]/50', 'bg-indigo-50')
    content = content.replace('bg-[#0a0e1a]', 'bg-white')
    
    content = content.replace('bg-gray-800', 'bg-white')
    content = content.replace('bg-gray-900', 'bg-slate-50')
    content = content.replace('bg-slate-800', 'bg-white')
    content = content.replace('bg-slate-900', 'bg-slate-50')
    
    content = content.replace('text-white', 'text-slate-900')
    content = content.replace('text-gray-300', 'text-slate-600')
    content = content.replace('text-gray-400', 'text-slate-600')
    content = content.replace('text-gray-500', 'text-slate-500')
    content = content.replace('text-slate-300', 'text-slate-600')
    content = content.replace('text-slate-400', 'text-slate-600')
    content = content.replace('text-slate-500', 'text-slate-500')
    
    content = content.replace('border-gray-700', 'border-slate-200')
    content = content.replace('border-gray-800', 'border-slate-200')
    content = content.replace('border-gray-600', 'border-slate-200')
    content = content.replace('border-slate-700', 'border-slate-200')
    
    content = content.replace('#00e5ff', '#4f46e5')
    content = content.replace('text-cyan-300', 'text-indigo-600')
    content = content.replace('text-cyan-400', 'text-indigo-500')
    content = content.replace('bg-cyan-900', 'bg-indigo-50')
    
    content = re.sub(r'shadow-\[.*?cyan.*?\]', 'shadow-md', content)
    content = re.sub(r'shadow-\[.*?00e5ff.*?\]', 'shadow-indigo-100', content)
    
    # Event console protection (rough)
    # Re-darken event-console
    content = content.replace('className="event-console h-32 bg-black/60', 'className="event-console h-32 bg-slate-900 text-slate-300')
    content = content.replace('className="event-console h-48 overflow-y-auto bg-black/60', 'className="event-console h-48 overflow-y-auto bg-slate-900 text-slate-300')
    
    # Custom fix for Cards
    content = content.replace('glass-card', 'bg-white border-slate-200 shadow-sm')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filepath in files:
    process_file(filepath)
    print(f"Processed {filepath}")
