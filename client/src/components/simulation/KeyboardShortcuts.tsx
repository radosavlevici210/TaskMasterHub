import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    {
      category: "Simulation Control",
      color: "text-quantum-green",
      shortcuts: [
        { key: "Space", action: "Pause/Resume" },
        { key: "R", action: "Reset" },
        { key: "Esc", action: "Clear All" }
      ]
    },
    {
      category: "Interaction Modes", 
      color: "text-quantum-purple",
      shortcuts: [
        { key: "G", action: "Gravity Mode" },
        { key: "C", action: "Create Mode" },
        { key: "D", action: "Destroy Mode" },
        { key: "M", action: "Measure Mode" }
      ]
    },
    {
      category: "Particle Types",
      color: "text-quantum-orange", 
      shortcuts: [
        { key: "1-6", action: "Select Type" },
        { key: "Shift+Click", action: "Multi-Select" }
      ]
    },
    {
      category: "View Controls",
      color: "text-quantum-blue",
      shortcuts: [
        { key: "+/-", action: "Zoom" },
        { key: "Arrow Keys", action: "Pan" },
        { key: "H", action: "Help" }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-quantum-cyan border-opacity-30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-quantum text-2xl font-bold text-quantum-cyan text-center">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 p-4">
          {shortcuts.map((section, index) => (
            <div key={index}>
              <h3 className={`font-medium ${section.color} mb-3`}>
                {section.category}
              </h3>
              <div className="space-y-2 text-sm">
                {section.shortcuts.map((shortcut, shortcutIndex) => (
                  <div key={shortcutIndex} className="flex justify-between">
                    <span className="text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded text-xs">
                      {shortcut.key}
                    </span>
                    <span className="font-mono">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button
            onClick={onClose}
            className="glass-panel rounded-lg px-6 py-2 hover:bg-quantum-cyan hover:bg-opacity-20 transition-all duration-200"
          >
            <span className="text-quantum-cyan font-medium">Close</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
