import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoom } from '@/contexts/BoomContext';
import { toast } from 'react-toastify';

const TriggerConfig = ({ configData, setConfigData, validationErrors }) => {
  const { getAutoReplyServices } = useBoom();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const response = await getAutoReplyServices();
        setServices(response);
        console.log('Services loaded:', response);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [getAutoReplyServices]);

  // Handle service selection
  const handleServiceSelect = (serviceId) => {
    const selectedService = services.find(s => s.id.toString() === serviceId);
    if (selectedService) {
      setConfigData({
        ...configData,
        service_id: serviceId,
        serviceName: selectedService.service,
        serviceDescription: `Daily limit: ${selectedService.limit_daily}`,
      });
      console.log('Service selected:', selectedService);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Choose the type of automation service you want to create.
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_id">Service Type</Label>
        <Select
          value={configData.service_id || ""}
          onValueChange={handleServiceSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="service_id">
            <SelectValue placeholder={isLoading ? "Loading services..." : "Select service type"} />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{service.service}</span>
                  <span className="text-xs text-gray-500">
                    Daily limit: {service.limit_daily}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Service Description */}
        {configData.service_id && (
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-purple-900">
                {configData.serviceName}
              </div>
              <div className="text-purple-700 text-xs mt-1">
                {configData.serviceDescription}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Select how your automation should respond to interactions
        </p>
      </div>
    </div>
  );
};

export default TriggerConfig; 