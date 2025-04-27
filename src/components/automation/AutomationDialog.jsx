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
  onSave,
  platforms = []
}) => {
  // Check if form is valid
  const isValid = Boolean(
    automation?.name?.trim() && 
    automation?.incoming?.trim() && 
    automation?.content?.trim() &&
    automation?.platform
  );
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      // Add status if not present
      const automationToSave = {
        ...automation,
        status: automation.status || "Active"
      };
      onSave(automationToSave);
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
                    <SelectItem value="Comment">Comment Automation</SelectItem>
                    <SelectItem value="Message">Message Automation</SelectItem>
                    <SelectItem value="Keyword">Keyword Triggers</SelectItem>
                    <SelectItem value="Story">Story Automation</SelectItem>
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
                    {platforms.length > 0 ? (
                      platforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="398280132">Facebook</SelectItem>
                        <SelectItem value="398280133">Instagram</SelectItem>
                        <SelectItem value="398280134">Twitter</SelectItem>
                        <SelectItem value="398280135">LinkedIn</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incoming">Trigger Message</Label>
              <Input
                id="incoming"
                placeholder="E.g., I need this product"
                value={automation.incoming || ""}
                onChange={(e) => setAutomation({ 
                  ...automation, 
                  incoming: e.target.value 
                })}
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Define what incoming message will trigger this automation
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Response Content</Label>
              <Textarea
                id="content"
                placeholder="E.g., Kindly click the first link under this post to place your order"
                rows={3}
                value={automation.content || ""}
                onChange={(e) => setAutomation({ 
                  ...automation, 
                  content: e.target.value 
                })}
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Specify the message that will be sent in response
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