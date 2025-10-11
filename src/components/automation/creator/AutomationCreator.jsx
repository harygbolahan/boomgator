import { useAutomation } from "@/contexts/AutomationContext";
import PlatformSelector from "./PlatformSelector";
import TemplateSelector from "./TemplateSelector";
import AutomationEditor from "./AutomationEditor";

const AutomationCreator = () => {
  const { currentStep } = useAutomation();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'platform':
        return <PlatformSelector />;
      case 'template':
        return <TemplateSelector />;
      case 'editor':
        return <AutomationEditor />;
      default:
        return <PlatformSelector />;
    }
  };

  return (
    <div className="automation-creator">
      {renderCurrentStep()}
    </div>
  );
};

export default AutomationCreator;