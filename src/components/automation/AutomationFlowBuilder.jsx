import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { XCircle, Save, Plus, Zap, Filter, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';

// Node types definition - moved outside component
const nodeTypes = {
  triggerNode: TriggerNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
};

export function AutomationFlowBuilder({ onSave, initialData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [automationName, setAutomationName] = useState(initialData?.name || 'New Automation Flow');
  const [activeTab, setActiveTab] = useState('nodes');
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [zoomed, setZoomed] = useState(false);

  // Check window width on mount and resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
      setShowMiniMap(window.innerWidth >= 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Connect nodes when edges are created
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds));
  }, [setEdges]);

  // Setup React Flow instance when it's ready
  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
    
    // Apply initial layout if there are no nodes
    if (initialData?.nodes?.length === 0 || !initialData) {
      setTimeout(() => {
        instance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [initialData]);

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to add new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Get position from drop point using the new API
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node
      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { 
          ...nodeData, 
          label: nodeData.label || `New ${type}`,
          onDelete: handleDeleteNode,
        },
      };

      // Add the new node
      setNodes((nds) => nds.concat(newNode));
      setValidationErrors([]); // Clear validation errors on node add
    },
    [reactFlowInstance, setNodes]
  );

  // Handle node click
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    if (isMobile) {
      setActiveTab('properties');
    }
  }, [isMobile]);

  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Validate the flow
  const validateFlow = useCallback(() => {
    const errors = [];
    
    // Check for at least one trigger
    const triggerNodes = nodes.filter(n => n.type === 'triggerNode');
    if (triggerNodes.length === 0) {
      errors.push('Your automation needs at least one trigger node.');
    } else if (triggerNodes.length > 1) {
      errors.push('Only one trigger node is allowed per automation.');
    }
    
    // Check for at least one action
    const actionNodes = nodes.filter(n => n.type === 'actionNode');
    if (actionNodes.length === 0) {
      errors.push('Your automation needs at least one action node.');
    }
    
    // Check for orphaned nodes (no connections)
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const orphanedNodes = nodes.filter(node => 
      node.type !== 'triggerNode' && 
      !connectedNodeIds.has(node.id)
    );
    
    if (orphanedNodes.length > 0) {
      errors.push(`${orphanedNodes.length} node(s) are not connected to the flow.`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [nodes, edges]);

  // Handle saving the automation
  const handleSave = useCallback(() => {
    // Validate the flow
    if (!validateFlow()) {
      return;
    }

    // Create the automation object
    const automation = {
      name: automationName,
      nodes,
      edges,
      // Extract essential data for the main AutomationPage
      platform: extractPlatform(nodes),
      type: extractType(nodes),
      trigger: extractTriggerDescription(nodes),
      response: extractResponseDescription(nodes),
    };

    if (onSave) {
      onSave(automation);
    }
  }, [nodes, edges, automationName, onSave, validateFlow]);

  // Helper functions to extract data from nodes
  const extractPlatform = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.platform || 'All Platforms';
  };

  const extractType = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.triggerType || 'Custom';
  };

  const extractTriggerDescription = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.description || 'Custom trigger';
  };

  const extractResponseDescription = (nodes) => {
    const actionNodes = nodes.filter(n => n.type === 'actionNode');
    return actionNodes.map(n => n.data?.description || 'Custom action').join(', ');
  };

  // Create draggable node items
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodeData', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle node update
  const handleNodeUpdate = useCallback((nodeId, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
    setValidationErrors([]);
  }, [setNodes]);

  // Toggle zoom for small screens
  const toggleZoom = useCallback(() => {
    setZoomed(!zoomed);
  }, [zoomed]);

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${zoomed ? 'h-[80vh]' : 'h-[600px]'} w-full`}>
      <div className="h-full flex flex-col bg-muted/10">
        {/* Header with automation name */}
        <div className="p-3 border-b bg-card">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <Label htmlFor="automation-name" className="sr-only">Automation Name</Label>
              <Input
                id="automation-name"
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                className="h-9"
                placeholder="Enter automation name"
              />
            </div>
            <Button 
              size="sm"
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="mr-1.5 h-4 w-4" />
              Save
            </Button>
            {isMobile && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={toggleZoom}
              >
                {zoomed ? 'Minimize' : 'Expand'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 flex-col md:flex-row h-full">
          {/* Mobile tabs */}
          {isMobile && (
            <div className="border-b">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="nodes">Nodes</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
          
          <ReactFlowProvider>
            {/* Flow editor */}
            <div className="flex-1 h-full relative">
              <div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={onInit}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  minZoom={0.2}
                  maxZoom={4}
                  deleteKeyCode="Delete"
                  snapToGrid
                  snapGrid={[15, 15]}
                >
                  <Controls showInteractive={!isMobile} />
                  <Background variant="dots" gap={12} size={1} />
                  
                  {showMiniMap && (
                    <MiniMap
                      nodeStrokeWidth={3}
                      zoomable
                      pannable
                      nodeBorderRadius={2}
                    />
                  )}

                  {/* Mobile panels view handling with TabsContent */}
                  {isMobile && (
                    <>
                      <TabsContent value="nodes" className="m-0 p-0 h-full">
                        <Panel position="top-center" className="bg-background/95 backdrop-blur-sm w-full rounded-lg p-3 shadow-md max-h-[220px] overflow-y-auto mt-1">
                          <NodeSelector onDragStart={onDragStart} />
                        </Panel>
                      </TabsContent>
                      
                      <TabsContent value="properties" className="m-0 p-0 h-full">
                        {selectedNode ? (
                          <Panel position="top-center" className="bg-background/95 backdrop-blur-sm w-full rounded-lg p-3 shadow-md max-h-[220px] overflow-y-auto mt-1">
                            <NodeProperties 
                              node={selectedNode} 
                              onChange={(updatedData) => handleNodeUpdate(selectedNode.id, updatedData)} 
                              onClose={() => setSelectedNode(null)}
                            />
                          </Panel>
                        ) : (
                          <Panel position="top-center" className="bg-background/95 backdrop-blur-sm w-full rounded-lg p-3 shadow-md mt-1">
                            <div className="text-center text-muted-foreground p-4">
                              <Info className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                              <p>Select a node to view its properties</p>
                            </div>
                          </Panel>
                        )}
                      </TabsContent>
                    </>
                  )}
                
                  {/* Desktop layout */}
                  {!isMobile && (
                    <>
                      {/* Nodes panel */}
                      <Panel position="top-left" className="bg-card rounded-lg p-4 shadow-md max-w-[250px]">
                        <NodeSelector onDragStart={onDragStart} />
                      </Panel>
                      
                      {/* Node properties panel */}
                      {selectedNode && (
                        <Panel position="top-right" className="bg-card rounded-lg p-4 shadow-md max-w-[300px]">
                          <NodeProperties 
                            node={selectedNode} 
                            onChange={(updatedData) => handleNodeUpdate(selectedNode.id, updatedData)} 
                            onClose={() => setSelectedNode(null)}
                          />
                        </Panel>
                      )}
                    </>
                  )}
                </ReactFlow>
              </div>
            </div>
            
            {/* Validation errors */}
            <AnimatePresence>
              {validationErrors.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg max-w-md"
                >
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-700">Please fix the following issues:</h4>
                      <ul className="mt-1 text-sm text-red-600 pl-5 list-disc">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => setValidationErrors([])} 
                      className="ml-auto -mt-1 -mr-1 p-1 rounded-full hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

// Node Selector Component
function NodeSelector({ onDragStart }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Add Flow Elements</h3>
        <div className="grid gap-2">
          <div
            className="border p-2 rounded-md cursor-move bg-blue-50 hover:bg-blue-100 transition-colors"
            draggable
            onDragStart={(e) =>
              onDragStart(e, 'triggerNode', {
                nodeType: 'trigger', 
                label: 'Trigger',
                platform: 'All Platforms',
                triggerType: 'Comment',
                description: 'Triggered by a new comment',
              })
            }
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Trigger</span>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move bg-amber-50 hover:bg-amber-100 transition-colors"
            draggable
            onDragStart={(e) =>
              onDragStart(e, 'conditionNode', {
                nodeType: 'condition',
                label: 'Condition',
                conditionType: 'contains',
                field: 'message',
                value: '',
                description: 'If condition is met',
              })
            }
          >
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-1 rounded-full">
                <Filter className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium">Condition</span>
            </div>
          </div>
          <div
            className="border p-2 rounded-md cursor-move bg-emerald-50 hover:bg-emerald-100 transition-colors"
            draggable
            onDragStart={(e) =>
              onDragStart(e, 'actionNode', {
                nodeType: 'action',
                label: 'Action',
                actionType: 'reply',
                message: '',
                description: 'Send a response',
              })
            }
          >
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium">Action</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4">
        <p className="mb-2">How to use:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Drag elements to the canvas</li>
          <li>Connect nodes by dragging from handles</li>
          <li>Click on nodes to edit properties</li>
          <li>Save when your flow is complete</li>
        </ol>
      </div>
    </div>
  );
}

// Node Properties Component
function NodeProperties({ node, onChange, onClose }) {
  const getProperties = () => {
    switch (node.type) {
      case 'triggerNode':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={node.data.label || ''}
                onChange={(e) => onChange({ label: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={node.data.platform || 'All Platforms'}
                onChange={(e) => onChange({ platform: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option value="All Platforms">All Platforms</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <select
                id="trigger-type"
                value={node.data.triggerType || 'Comment'}
                onChange={(e) => onChange({ triggerType: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option value="Comment">Comment</option>
                <option value="Message">Message</option>
                <option value="Keyword">Keyword</option>
                <option value="Story">Story</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={node.data.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                className="mt-1"
                placeholder="Describe what triggers this flow"
              />
            </div>
          </div>
        );
        
      case 'conditionNode':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={node.data.label || ''}
                onChange={(e) => onChange({ label: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="field">Field</Label>
              <select
                id="field"
                value={node.data.field || 'message'}
                onChange={(e) => onChange({ field: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option value="message">Message</option>
                <option value="author">Author</option>
                <option value="platform">Platform</option>
                <option value="time">Time</option>
              </select>
            </div>
            <div>
              <Label htmlFor="condition-type">Condition</Label>
              <select
                id="condition-type"
                value={node.data.conditionType || 'contains'}
                onChange={(e) => onChange({ conditionType: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="startsWith">Starts with</option>
                <option value="endsWith">Ends with</option>
                <option value="regex">Matches regex</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={node.data.value || ''}
                onChange={(e) => onChange({ value: e.target.value })}
                className="mt-1"
                placeholder="Value to compare against"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={node.data.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                className="mt-1"
                placeholder="Describe this condition"
              />
            </div>
          </div>
        );
        
      case 'actionNode':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={node.data.label || ''}
                onChange={(e) => onChange({ label: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <select
                id="action-type"
                value={node.data.actionType || 'reply'}
                onChange={(e) => onChange({ actionType: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option value="reply">Reply</option>
                <option value="dm">Send DM</option>
                <option value="tag">Tag User</option>
                <option value="notification">Send Notification</option>
                <option value="webhook">Call Webhook</option>
              </select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={node.data.message || ''}
                onChange={(e) => onChange({ message: e.target.value })}
                className="w-full p-2 mt-1 border rounded-lg"
                rows="3"
                placeholder="Enter message content"
              ></textarea>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={node.data.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                className="mt-1"
                placeholder="Describe this action"
              />
            </div>
          </div>
        );
        
      default:
        return <div>No properties available</div>;
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Node Properties</h3>
        <button 
          className="p-1 rounded-full hover:bg-muted"
          onClick={onClose}
        >
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="space-y-3">
        {getProperties()}
      </div>
      
      <div className="pt-2 flex justify-between border-t">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            if (node.data.onDelete) {
              node.data.onDelete(node.id);
            }
          }}
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
}

export default AutomationFlowBuilder; 