import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ConnectionLineType,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Play, Plus } from 'lucide-react';

// Import custom nodes
import TriggerNode from '@/components/automation/flow-nodes/TriggerNode';
import PlatformNode from '@/components/automation/flow-nodes/PlatformNode';
import PageNode from '@/components/automation/flow-nodes/PageNode';
import PostNode from '@/components/automation/flow-nodes/PostNode';
import KeywordsNode from '@/components/automation/flow-nodes/KeywordsNode';
import ResponseNode from '@/components/automation/flow-nodes/ResponseNode';
import ConfigNode from '@/components/automation/flow-nodes/ConfigNode';

// Import modals
import BlockConfigModal from '@/components/automation/flow-modals/BlockConfigModal';

// Import BoomContext
import { useBoom } from '@/contexts/BoomContext';

// Define node types outside component to prevent re-creation
const nodeTypes = {
  trigger: TriggerNode,
  platform: PlatformNode,
  page: PageNode,
  post: PostNode,
  keywords: KeywordsNode,
  response: ResponseNode,
  config: ConfigNode,
};

// Flow configuration
const FLOW_STEPS = [
  { id: 'trigger', type: 'trigger', label: 'Service Type' },
  { id: 'platform', type: 'platform', label: 'Platform' },
  { id: 'page', type: 'page', label: 'Page' },
  { id: 'post', type: 'post', label: 'Post' },
  { id: 'keywords', type: 'keywords', label: 'Keywords' },
  { id: 'response', type: 'response', label: 'Response' },
  { id: 'config', type: 'config', label: 'Configuration' },
];

const Flow = () => {
  const navigate = useNavigate();
  const { createAutomation } = useBoom();

  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowData, setFlowData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Modal state
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized node types to prevent React Flow warnings
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Stable callback references
  const callbacksRef = useRef({});

  // Handle node configuration - stable callback
  const handleNodeConfigure = useCallback((nodeId) => {
    setNodes(currentNodes => {
      const node = currentNodes.find(n => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        setIsModalOpen(true);
      }
      return currentNodes; // Return unchanged nodes
    });
  }, [setNodes]);

  // Handle node deletion - stable callback
  const handleNodeDelete = useCallback((nodeId) => {
    setNodes(currentNodes => {
      const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) return currentNodes;

      // Remove the node and all subsequent nodes
      const newNodes = currentNodes.slice(0, nodeIndex);
      
      // Update edges
      setEdges(currentEdges => 
        currentEdges.filter(e => 
          !currentNodes.slice(nodeIndex).some(n => n.id === e.source || n.id === e.target)
        )
      );
      
      // Update current step
      setCurrentStep(Math.max(0, nodeIndex - 1));

      // Clear flow data for removed steps
      setFlowData(currentFlowData => {
        const newFlowData = { ...currentFlowData };
        currentNodes.slice(nodeIndex).forEach(node => {
          delete newFlowData[node.id];
        });
        return newFlowData;
      });

      toast.info('Block deleted. Please reconfigure the flow.');
      return newNodes;
    });
  }, [setNodes, setEdges]);

  // Update callback refs
  useEffect(() => {
    callbacksRef.current.onConfigure = handleNodeConfigure;
    callbacksRef.current.onDelete = handleNodeDelete;
  }, [handleNodeConfigure, handleNodeDelete]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize flow with first step - only run once
  useEffect(() => {
    if (!isInitialized) {
      const initialNode = {
        id: 'trigger',
        type: 'trigger',
        position: { 
          x: isMobile ? 50 : 300, 
          y: 50 
        },
        data: {
          label: 'Service Type',
          isConfigured: false,
          isEnabled: true, // Trigger is always enabled as it's the starting point
          onConfigure: (nodeId) => callbacksRef.current.onConfigure?.(nodeId),
          onDelete: (nodeId) => callbacksRef.current.onDelete?.(nodeId),
          stepIndex: 0,
        },
      };

      setNodes([initialNode]);
      setEdges([]);
      setCurrentStep(0);
      setFlowData({});
      setIsInitialized(true);
    }
  }, [isInitialized, setNodes, setEdges]);

  // Handle modal save
  const handleModalSave = useCallback((nodeId, data) => {
    // Update flow data
    setFlowData(currentFlowData => {
      const newFlowData = { ...currentFlowData, [nodeId]: data };
      
      // Update node configuration status and enable next nodes
      setNodes(currentNodes => 
        currentNodes.map(node => {
          if (node.id === nodeId) {
            // Mark current node as configured
            return { ...node, data: { ...node.data, isConfigured: true, configData: data } };
          } else {
            // Enable next nodes if they should be enabled
            const nodeStepIndex = FLOW_STEPS.findIndex(step => step.id === node.id);
            const shouldBeEnabled = nodeStepIndex === 1 ? // Platform step
              newFlowData['trigger'] : // Should be enabled if trigger is configured
              (nodeStepIndex > 1 && FLOW_STEPS[nodeStepIndex - 1] && newFlowData[FLOW_STEPS[nodeStepIndex - 1].id]);
            
            if (node.data.isEnabled !== shouldBeEnabled) {
              return { ...node, data: { ...node.data, isEnabled: shouldBeEnabled } };
            }
            return node;
          }
        })
      );

      // Check if we can add the next step
      const currentStepIndex = FLOW_STEPS.findIndex(step => step.id === nodeId);
      const nextStepIndex = currentStepIndex + 1;

      // Special logic for post step - only add if service requires it
      if (nodeId === 'page' && data.service_id && (data.service_id === "1" || data.service_id === "5")) {
        addNextStep(nextStepIndex, newFlowData);
      } else if (nodeId === 'page' && data.service_id === "2") {
        // Skip post step for DM-only service
        addNextStep(nextStepIndex + 1, newFlowData);
      } else if (nextStepIndex < FLOW_STEPS.length && nodeId !== 'page') {
        addNextStep(nextStepIndex, newFlowData);
      }

      toast.success(`${FLOW_STEPS[currentStepIndex]?.label} configured successfully`);
      
      return newFlowData;
    });

    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  // Add next step in the flow - stable callback
  const addNextStep = useCallback((stepIndex, currentFlowData) => {
    if (stepIndex >= FLOW_STEPS.length) return;

    const step = FLOW_STEPS[stepIndex];
    
    setNodes(currentNodes => {
      const existingNode = currentNodes.find(n => n.id === step.id);
      if (existingNode) return currentNodes;

      const yPosition = 50 + (stepIndex * (isMobile ? 120 : 150));
      // Node should be enabled only if it's the next logical step
      const shouldBeEnabled = stepIndex === 1 ? // Platform step
        currentFlowData['trigger'] : // Should be enabled if trigger is configured
        (stepIndex > 1 && FLOW_STEPS[stepIndex - 1] && currentFlowData[FLOW_STEPS[stepIndex - 1].id]);
      
      const newNode = {
        id: step.id,
        type: step.type,
        position: { 
          x: isMobile ? 50 : 300, 
          y: yPosition 
        },
        data: {
          label: step.label,
          isConfigured: false,
          isEnabled: shouldBeEnabled,
          onConfigure: (nodeId) => callbacksRef.current.onConfigure?.(nodeId),
          onDelete: (nodeId) => callbacksRef.current.onDelete?.(nodeId),
          stepIndex,
          previousStepData: currentFlowData,
        },
      };

      return [...currentNodes, newNode];
    });

    setEdges(currentEdges => {
      // Add edge from previous node
      const previousStepIndex = stepIndex - 1;
      let previousNodeId = FLOW_STEPS[previousStepIndex]?.id;
      
      // Handle post step skip logic
      if (step.id === 'keywords') {
        setNodes(currentNodes => {
          if (!currentNodes.find(n => n.id === 'post')) {
            previousNodeId = 'page';
          }
          return currentNodes;
        });
      }

      // Create unique edge ID with timestamp to prevent duplicates
      const edgeId = `${previousNodeId}-${step.id}-${Date.now()}`;
      
      // Check if edge already exists between these nodes
      const existingEdge = currentEdges.find(edge => 
        edge.source === previousNodeId && edge.target === step.id
      );
      
      if (existingEdge) {
        return currentEdges; // Don't add duplicate edge
      }

      const newEdge = {
        id: edgeId,
        source: previousNodeId,
        target: step.id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.Arrow,
        },
        style: {
          stroke: '#7c3aed',
          strokeWidth: 2,
        },
      };

      return [...currentEdges, newEdge];
    });

    setCurrentStep(stepIndex);
  }, []);

  // Handle save automation
  const handleSaveAutomation = useCallback(async () => {
    // Validate flow completion
    const requiredSteps = ['trigger', 'platform', 'page', 'keywords', 'response', 'config'];
    const missingSteps = requiredSteps.filter(stepId => !flowData[stepId]);

    if (missingSteps.length > 0) {
      toast.error(`Please configure all required steps: ${missingSteps.join(', ')}`);
      return;
    }

    // Extract data with proper fallbacks and validation
    const triggerData = flowData.trigger || {};
    const platformData = flowData.platform || {};
    const pageData = flowData.page || {};
    const postData = flowData.post || {};
    const keywordsData = flowData.keywords || {};
    const responseData = flowData.response || {};
    const configData = flowData.config || {};

    // Construct automation data to match CreateAutomationPage structure exactly
    const automationData = {
      status: "Active",
      service_id: triggerData.service_id || triggerData.serviceId || "",
      incoming: keywordsData.keywords ? 
        (Array.isArray(keywordsData.keywords) ? keywordsData.keywords.join(', ') : keywordsData.keywords) : 
        (keywordsData.incoming || ""),
      platform_id: platformData.platform_id || platformData.platformId || "",
      page_id: pageData.page_id || pageData.pageId || "",
      post_id: postData.post_id || postData.postId || "",
      label: configData.label || "",
      comment_content: responseData.comment_content || responseData.commentContent || "",
      dm_content: responseData.dm_content || responseData.dmContent || "",
      tittle: configData.titles ? 
        (Array.isArray(configData.titles) ? configData.titles.join(', ') : configData.titles) : 
        (configData.tittle || ""),
      url: configData.urls ? 
        (Array.isArray(configData.urls) ? configData.urls.join(', ') : configData.urls) : 
        (configData.url || ""),
    };

    // Validation similar to CreateAutomationPage
    if (!automationData.incoming.trim()) {
      toast.error("Please configure trigger keywords in the Keywords step");
      return;
    }

    if (!automationData.label.trim()) {
      toast.error("Please enter a label in the Configuration step");
      return;
    }

    if (!automationData.platform_id) {
      toast.error("Please select a platform in the Platform step");
      return;
    }

    if (!automationData.page_id) {
      toast.error("Please select a page in the Page step");
      return;
    }

    if (!automationData.service_id) {
      toast.error("Please select a service type in the Service Type step");
      return;
    }

    // Service-specific validation and field clearing (matching CreateAutomationPage logic)
    if (automationData.service_id === "1") {
      if (!automationData.comment_content.trim()) {
        toast.error("Please enter a comment reply message in the Response step");
        return;
      }
      // Clear DM content for comment-only service
      automationData.dm_content = "";
    }

    if (automationData.service_id === "2") {
      if (!automationData.dm_content.trim()) {
        toast.error("Please enter a direct message reply in the Response step");
        return;
      }
      // Clear comment content and post_id for DM-only service
      automationData.comment_content = "";
      automationData.post_id = "";
    }

    if (automationData.service_id === "5") {
      if (!automationData.comment_content.trim() && !automationData.dm_content.trim()) {
        toast.error("Please enter at least one reply message (comment or DM) in the Response step");
        return;
      }
    }

    setIsSaving(true);

    try {
      console.log('=== AUTOMATION PAYLOAD ===');
      console.log('Flow Data:', flowData);
      console.log('Automation Data:', automationData);
      
      const result = await createAutomation(automationData);
      
      console.log('=== AUTOMATION SUCCESS ===');
      console.log('Response:', result);
      
      toast.success('Automation created successfully!');
      navigate('/automation');
    } catch (error) {
      console.error('=== AUTOMATION ERROR ===');
      console.error('Error details:', error.response?.data || error.message || error);
      
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to create automation: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  }, [flowData, createAutomation, navigate]);

  // Calculate flow completion
  const getFlowCompletion = useCallback(() => {
    const configuredSteps = Object.keys(flowData).length;
    const totalSteps = FLOW_STEPS.length;
    return Math.round((configuredSteps / totalSteps) * 100);
  }, [flowData]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/automation')}
              className="h-8 w-8 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Flow Builder</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Create your automation with visual flow
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Progress: {getFlowCompletion()}%
            </div>
            <Button
              onClick={handleSaveAutomation}
              disabled={isSaving || getFlowCompletion() < 100}
              className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-3 sm:px-4 py-2 h-8 sm:h-auto"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Save</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save Automation</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={memoizedNodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.7 : 1 }}
          minZoom={0.3}
          maxZoom={2}
          attributionPosition="bottom-left"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={!isMobile}
          zoomOnPinch={true}
          panOnScroll={false}
          preventScrolling={false}
        >
          <Background variant="dots" gap={20} size={1} />
          <Controls 
            className="!bottom-2 !left-2 sm:!bottom-4 sm:!left-4"
            showZoom={!isMobile}
            showFitView={true}
            showInteractive={false}
          />
          <MiniMap 
            style={{ 
              height: isMobile ? 80 : 120,
              width: isMobile ? 120 : 200 
            }}
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.data?.isConfigured) return '#7c3aed';
              return '#e5e7eb';
            }}
            className="!bottom-2 !right-2 sm:!bottom-4 sm:!right-4"
          />
          
          {/* Progress Panel */}
          <Panel 
            position="top-right" 
            className="bg-white p-2 sm:p-4 rounded-lg shadow-lg border max-w-[180px] sm:max-w-none"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Flow Progress</div>
            <div className="space-y-1 sm:space-y-2">
              {FLOW_STEPS.map((step, index) => {
                const isConfigured = flowData[step.id];
                const isCurrent = index === currentStep;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs ${
                      isConfigured ? 'text-purple-600' : 
                      isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                      isConfigured ? 'bg-purple-600' : 
                      isCurrent ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    <span className="truncate">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Configuration Modal */}
      {isModalOpen && selectedNode && (
        <BlockConfigModal
          node={selectedNode}
          flowData={flowData}
          onSave={handleModalSave}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
};

export default Flow;
