import { AutomationProvider } from "@/contexts/AutomationContext";
import AutomationCreator from "@/components/automation/creator/AutomationCreator";

export function CreateAutomationPage() {
  return (
    <AutomationProvider>
      <AutomationCreator />
    </AutomationProvider>
  );
}
