import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AutomationDialog = ({ 
  open, 
  onOpenChange, 
  automation, 
  setAutomation, 
  onSave 
}) => {
  // Check if form is valid
  const isValid = Boolean(
    automation?.name?.trim() && 
    automation?.trigger?.trim() && 
    automation?.response?.trim()
  );
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSave(automation);
    }
  };
  
  if (!automation) return null;
  
  const isNew = automation.isNew;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Create Automation" : "Edit Automation"}
            </DialogTitle>
            <DialogDescription>
              {isNew 
                ? "Configure your new automation flow" 
                : "Update your automation settings"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                placeholder="E.g., Comment Responder"
                value={automation.name || ""}
                onChange={(e) => setAutomation({ 
                  ...automation, 
                  name: e.target.value 
                })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Automation Type</Label>
                <Select
                  value={automation.type}
                  onValueChange={(value) => setAutomation({ 
                    ...automation, 
                    type: value 
                  })}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Comment Automation</SelectItem>
                    <SelectItem value="message">Message Automation</SelectItem>
                    <SelectItem value="keyword">Keyword Triggers</SelectItem>
                    <SelectItem value="story">Story Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={automation.platform}
                  onValueChange={(value) => setAutomation({ 
                    ...automation, 
                    platform: value 
                  })}
                  required
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="All Platforms">All Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger</Label>
              <Input
                id="trigger"
                placeholder="E.g., Comments containing 'price' or 'cost'"
                value={automation.trigger || ""}
                onChange={(e) => setAutomation({ 
                  ...automation, 
                  trigger: e.target.value 
                })}
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Define what will trigger this automation to run
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="response">Response</Label>
              <Textarea
                id="response"
                placeholder="E.g., Thank you for your interest! Our prices start at $99..."
                rows={3}
                value={automation.response || ""}
                onChange={(e) => setAutomation({ 
                  ...automation, 
                  response: e.target.value 
                })}
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Specify the action to take when the trigger conditions are met
              </p>
            </div>
            
            {!isValid && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fill out all required fields before saving
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!isValid}
            >
              <Check className="mr-1.5 h-4 w-4" />
              {isNew ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 