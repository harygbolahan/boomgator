import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, MessageSquare, Send, Activity } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAutomation } from "@/contexts/AutomationContext";
import { useBoom } from "@/contexts/BoomContext";

const ServiceSelector = ({ configData, updateConfigData }) => {
  const { automationState } = useAutomation();
  const { autoReplyServices, getAutoReplyServices } = useBoom();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      if (!autoReplyServices || autoReplyServices.length === 0) {
        setIsLoading(true);
        try {
          await getAutoReplyServices();
        } catch (error) {
          console.error('Error loading services:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadServices();
  }, [autoReplyServices, getAutoReplyServices]);

  const handleServiceSelect = (serviceId) => {
    const selectedService = autoReplyServices.find(s => s.id.toString() === serviceId);
    if (selectedService) {
      // Update configData with service information - store service_id directly in servicePlatform
      updateConfigData({
        servicePlatform: {
          ...configData.servicePlatform,
          service_id: serviceId,
          serviceName: selectedService.service || selectedService.name,
          serviceDescription: `Daily limit: ${selectedService.limit_daily || 'Unlimited'}`
        },
        // Also update responseConfig for consistency
        responseConfig: {
          ...configData.responseConfig,
          service_id: serviceId
        }
      });
      console.log('Service selected:', selectedService);
    }
  };

  const getSelectedServiceName = () => {
    if (!configData.servicePlatform?.service_id || !autoReplyServices) return null;
    const service = autoReplyServices.find(s => s.id.toString() === configData.servicePlatform.service_id);
    return service?.service || service?.name;
  };

  const getServiceIcon = (serviceId) => {
    switch (serviceId) {
      case "1":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "2":
        return <Send className="w-4 h-4 text-green-500" />;
      case "5":
        return <Activity className="w-4 h-4 text-purple-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getServiceDescription = (service) => {
    const descriptions = {
      "1": "Automatically reply to comments on your posts",
      "2": "Send direct messages to users who interact",
      "5": "Reply to comments AND send DMs for maximum engagement"
    };
    return descriptions[service.id.toString()] || service.service;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-500" />
          Automation Service Type
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose how your automation will respond to user interactions
        </p>
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="service_id">Service Type *</Label>
        <Select
          value={configData.servicePlatform?.service_id || ""}
          onValueChange={handleServiceSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="service_id">
            <SelectValue placeholder={isLoading ? "Loading services..." : "Select service type"}>
              {getSelectedServiceName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-500">Loading services...</span>
              </div>
            ) : (
              autoReplyServices?.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  <div className="flex items-center gap-3">
                    {getServiceIcon(service.id.toString())}
                    <div className="flex flex-col">
                      <span className="font-medium">{service.service}</span>
                      <span className="text-xs text-gray-500">
                        Daily limit: {service.limit_daily}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {/* Service Description */}
        {configData.servicePlatform?.service_id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md"
          >
            <div className="text-sm">
              <div className="font-medium text-purple-900 flex items-center gap-2">
                {getServiceIcon(configData.servicePlatform.service_id)}
                {configData.servicePlatform.serviceName}
              </div>
              <div className="text-purple-700 text-xs mt-1">
                {getServiceDescription(autoReplyServices?.find(s => s.id.toString() === configData.servicePlatform.service_id))}
              </div>
              <div className="text-purple-600 text-xs mt-1">
                {configData.servicePlatform.serviceDescription}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Service Type Explanation */}
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-900">Comment Only</span>
          </div>
          <p className="text-xs text-blue-700">
            Responds publicly to comments on your posts. Great for engagement and visibility.
          </p>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-900">DM Only</span>
          </div>
          <p className="text-xs text-green-700">
            Sends private direct messages to users. Perfect for lead generation and personal touch.
          </p>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-900">Comment & DM</span>
          </div>
          <p className="text-xs text-purple-700">
            Combines both approaches for maximum engagement and conversion potential.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;