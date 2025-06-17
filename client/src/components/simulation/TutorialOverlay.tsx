import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, GraduationCap, X } from "lucide-react";

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  content: string;
  icon: string;
  action?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Quantum Simulator",
    description: "Advanced Particle Physics Simulation",
    content: "Experience the fascinating world of particle physics with real-time simulations, collision detection, and interactive controls. This tutorial will guide you through the main features.",
    icon: "🚀",
    action: "Get Started"
  },
  {
    title: "Particle Types",
    description: "Understanding the Building Blocks",
    content: "The simulator features six particle types: Photons (light), Electrons (charged), Quarks (fundamental), Bosons (force carriers), Dark Matter (invisible mass), and Neutrinos (ghost particles). Each has unique properties and behaviors.",
    icon: "⚛️",
    action: "Learn More"
  },
  {
    title: "Interaction Modes",
    description: "Tools for Manipulation",
    content: "Use the bottom toolbar to switch between modes: Gravity (create gravity wells), Create (add particles), Destroy (remove particles), and Measure (analyze properties). Try clicking different areas of the simulation!",
    icon: "🔧",
    action: "Try It"
  },
  {
    title: "Physics Controls",
    description: "Fine-tune the Universe",
    content: "Adjust gravity strength, electromagnetic force, and temperature using the left panel. Enable collision detection to see particles interact and potentially fuse or decay into new particles.",
    icon: "⚡",
    action: "Experiment"
  },
  {
    title: "Preset Scenarios",
    description: "Explore Cosmic Events",
    content: "Load preset scenarios like Big Bang, Black Hole formation, Particle Accelerator collisions, and Galaxy formation. Each preset configures the simulation with scientifically inspired parameters.",
    icon: "🌌",
    action: "Discover"
  },
  {
    title: "Real-time Statistics",
    description: "Monitor the Simulation",
    content: "The right panel shows energy statistics, physics metrics, and performance data. Watch how particle collisions affect total energy, entropy, and system dynamics in real-time.",
    icon: "📊",
    action: "Observe"
  },
  {
    title: "Export & Share",
    description: "Capture Your Discoveries",
    content: "Export your simulations as MP4 videos, GIF animations, or JSON data files. Share interesting particle behaviors or use the data for further analysis.",
    icon: "💾",
    action: "Create"
  },
  {
    title: "Keyboard Shortcuts",
    description: "Power User Features",
    content: "Press 'H' for keyboard shortcuts, Space to pause/resume, 'R' to reset, 'G' for gravity mode, 'C' for create mode, and number keys 1-6 to select particle types. Master these for efficient control!",
    icon: "⌨️",
    action: "Master"
  },
  {
    title: "Ready to Explore!",
    description: "Start Your Quantum Journey",
    content: "You're now ready to explore the quantum universe! Start with a preset scenario or create your own particle interactions. Remember: click to create gravity wells, experiment with different physics settings, and observe how particles behave under various conditions.",
    icon: "🎯",
    action: "Begin Simulation"
  }
];

export function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    setIsStarted(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    onClose();
    setIsStarted(false);
    setCurrentStep(0);
  };

  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  const currentStepData = TUTORIAL_STEPS[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-4 relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>

        {!isStarted ? (
          /* Welcome Screen */
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-quantum-cyan to-quantum-purple rounded-full flex items-center justify-center quantum-glow mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-quantum text-3xl font-bold text-quantum-cyan mb-4">
              Welcome to Quantum Simulator
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Experience the fascinating world of particle physics with real-time simulations and interactive controls. 
              This tutorial will guide you through the main features and help you become a quantum physics explorer.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-quantum-green to-quantum-cyan hover:from-quantum-green hover:to-quantum-cyan text-white font-medium px-8 py-3 rounded-lg transition-all duration-200"
              >
                Start Tutorial
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg transition-all duration-200"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        ) : (
          /* Tutorial Steps */
          <div>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono text-gray-400">
                  Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                </span>
                <span className="text-sm font-mono text-quantum-cyan">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentStepData.icon}</div>
              <h3 className="font-quantum text-2xl font-bold text-quantum-cyan mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-quantum-yellow font-medium mb-4">
                {currentStepData.description}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? 'bg-quantum-cyan'
                        : index < currentStep
                        ? 'bg-quantum-green'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-quantum-cyan to-quantum-purple hover:from-quantum-cyan hover:to-quantum-purple text-white"
              >
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Complete' : currentStepData.action}
                {currentStep < TUTORIAL_STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>

            {/* Skip Option */}
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white text-sm"
              >
                Skip Tutorial
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
