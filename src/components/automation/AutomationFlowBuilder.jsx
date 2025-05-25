import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
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
import { XCircle, Save, Plus, Zap, Filter, CheckCircle, Info, AlertTriangle, MessageCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { useBoom } from '@/contexts/BoomContext';
import { toast } from 'react-toastify';

// Custom node types
import InstagramTriggerNode from './nodes/InstagramTriggerNode';
import InstagramMessageNode from './nodes/InstagramMessageNode';
import FacebookTriggerNode from './nodes/FacebookTriggerNode';
import FacebookMessageNode from './nodes/FacebookMessageNode';

// Configuration Sidebar
import NodeConfigurationSidebar from './NodeConfigurationSidebar';

// Import Modals
import SelectFacebookPageModal from './modals/SelectFacebookPageModal';
import SelectFacebookPostModal from './modals/SelectFacebookPostModal';
import SetFacebookKeywordsModal from './modals/SetFacebookKeywordsModal';
import ConfigureFacebookMessageModal from './modals/ConfigureFacebookMessageModal';

// Node types definition - moved outside component
const nodeTypes = {
  instagramTrigger: InstagramTriggerNode,
  instagramMessage: InstagramMessageNode,
  facebookTrigger: FacebookTriggerNode,
  facebookMessage: FacebookMessageNode,
};

const AutomationFlowBuilder = forwardRef(function AutomationFlowBuilder({ onSave, initialData }, ref) {
  const { getPlatforms, getPages, getAutoReplyServices } = useBoom();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [automationName, setAutomationName] = useState(initialData?.name || 'New Automation Flow');
  const [activeTab, setActiveTab] = useState('nodes');
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [zoomed, setZoomed] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [pages, setPages] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedNodeForSidebar, setSelectedNodeForSidebar] = useState(null);

  const closeConfigSidebar = () => {
    setSelectedNodeForSidebar(null);
  };

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    addNode: (type, data) => {
      const id = `${type}_${Date.now()}`;
      const position = reactFlowInstance ? reactFlowInstance.project({ x: 200, y: 200 }) : { x: 200, y: 200 };
      const newNode = { id, type, position, data: { ...data, onDelete: handleDeleteNode, onChange: (upd) => handleNodeUpdate(id, upd) } };
      setNodes(nds => nds.concat(newNode));
      return id;
    },
    connectNodes: (source, target) => {
      setEdges(eds => addEdge({ id: `edge_${source}_${target}_${Date.now()}`, source, target, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds));
    }
  }), [reactFlowInstance, handleDeleteNode, handleNodeUpdate]);

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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch platforms
        const platformsResponse = await getPlatforms();
        setPlatforms(platformsResponse);

        // Fetch pages
        const pagesResponse = await getPages();
        setPages(pagesResponse);

        // Fetch services
        const servicesResponse = await getAutoReplyServices();
        setServices(servicesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Could not load editor support data.");
      }
    };

    fetchData();
  }, [getPlatforms, getPages, getAutoReplyServices]);

  // Connect nodes when edges are created
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, id: `edge_${params.source}_${params.target}_${Date.now()}`, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds));
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

  // Handle node deletion (hoisted)
  function handleDeleteNode(nodeId) {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeForSidebar && selectedNodeForSidebar.id === nodeId) {
      setSelectedNodeForSidebar(null);
    }
  }

  // Handle node update (hoisted)
  function handleNodeUpdate(nodeId, updatedDataPartial) {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updatedDataPartial } } : node
      )
    );
    if (selectedNodeForSidebar && selectedNodeForSidebar.id === nodeId) {
      setSelectedNodeForSidebar(prev => ({ ...prev, data: { ...prev.data, ...updatedDataPartial } }));
    }
    setValidationErrors([]);
  }

  // Handle drop event to add new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const nodeDataString = event.dataTransfer.getData('application/nodeData');
      const initialNodeData = nodeDataString ? JSON.parse(nodeDataString) : {};

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Get position from drop point using the new API
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate a unique node ID
      const nodeId = `${type}_${Date.now()}`;

      // Create new node
      const newNode = {
        id: nodeId,
        type,
        position,
        data: { 
          ...initialNodeData, 
          label: initialNodeData.label || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          platforms,
          pages,
          services,
          onDelete: handleDeleteNode,
          onChange: (updatedData) => handleNodeUpdate(nodeId, updatedData),
        },
      };

      // Add the new node
      setNodes((nds) => nds.concat(newNode));
      setValidationErrors([]); // Clear validation errors on node add
    },
    [reactFlowInstance, setNodes, platforms, pages, services, handleDeleteNode, handleNodeUpdate]
  );

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeForSidebar(node);
  }, []);

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
      toast.error("Please fix validation errors before saving.");
      return;
    }

    // Create the automation object
    const automation = {
      name: automationName,
      nodes: nodes.map(n => { const { onDelete, onChange, ...restData } = n.data; return { ...n, data: restData }; }),
      edges,
      // Extract essential data for the main AutomationPage
      platform: extractPlatform(nodes),
      type: extractType(nodes),
      trigger: extractTriggerDescription(nodes),
      response: extractResponseDescription(nodes),
      serviceType: extractServiceType(nodes),
      platformId: extractPlatformId(nodes),
      pageId: extractPageId(nodes),
      postId: extractPostId(nodes),
      triggers: extractTriggers(nodes),
      titles: extractTitles(nodes),
      urls: extractUrls(nodes),
      commentResponse: extractCommentResponse(nodes),
      dmResponse: extractDmResponse(nodes),
    };

    if (onSave) {
      onSave(automation);
      toast.success("Automation flow saved!");
    }
  }, [nodes, edges, automationName, onSave, validateFlow, platforms, pages, services]);

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

  const extractServiceType = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.serviceId || 'Custom';
  };

  const extractPlatformId = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.platformId || 'All Platforms';
  };

  const extractPageId = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.pageId || 'All Pages';
  };

  const extractPostId = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.postId || 'All Posts';
  };

  const extractTriggers = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.triggers || [];
  };

  const extractTitles = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.titles || [];
  };

  const extractUrls = (nodes) => {
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    return triggerNode?.data?.urls || [];
  };

  const extractCommentResponse = (nodes) => {
    const actionNode = nodes.find(n => n.type === 'actionNode' && n.data.type === 'comment');
    return actionNode?.data?.content || '';
  };

  const extractDmResponse = (nodes) => {
    const actionNode = nodes.find(n => n.type === 'actionNode' && n.data.type === 'dm');
    return actionNode?.data?.content || '';
  };

  // Create draggable node items
  const onDragStart = (event, nodeType, data) => {
    const nodeDataString = JSON.stringify(data);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodeData', nodeDataString);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Toggle zoom for small screens
  const toggleZoom = useCallback(() => {
    setZoomed(!zoomed);
  }, [zoomed]);

  // Simplified NodeProperties - This will be replaced/augmented by the new Config Sidebar
  // For now, it only shows basic info or a placeholder.
  const NodeProperties = ({ node, onChange }) => {
    if (!node) return <div className="p-4 text-sm text-gray-500">Select a node to see its properties.</div>;

    const commonFields = (
      <div className="space-y-2">
        <Label htmlFor={`label-${node.id}`}>Label</Label>
        <Input
          id={`label-${node.id}`}
          value={node.data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
    );

    // This part will be handled by the new dedicated configuration sidebar
    // and its modals for each node type.
    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Edit: {node.data.label || node.type}</h3>
        {commonFields}
        <p className="text-xs text-gray-400">Detailed configuration will be in the right sidebar / modals.</p>
        {/* Example: Specific fields for Instagram Trigger, to be removed/refactored */}
        {/* {node.type === 'instagramTrigger' && (
          <>
            <div className="space-y-2">
              <Label>Keywords (Current: {node.data.keywords?.join(', ') || 'None'})</Label>
               <Button onClick={() => alert('Open keywords modal for ' + node.id)}>Set Keywords</Button>
            </div>
             <div className="space-y-2">
              <Label>Post (Current: {node.data.postTitle || 'All'})</Label>
               <Button onClick={() => alert('Open post selection modal for ' + node.id)}>Select Post</Button>
            </div>
          </>
        )} */}
      </div>
    );
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-col md:flex-row h-full w-full bg-gray-50" ref={reactFlowWrapper}>
        {/* Palette Sidebar (Left or Collapsible) */}
        {/* ... Palette rendering, ensuring NodeSelector is called correctly ... */}
        <AnimatePresence>
          {(activeTab === 'nodes' || !isMobile) && (
            <motion.div
              key="palette-sidebar"
              initial={{ x: isMobile ? '-100%' : 0, opacity: isMobile ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? '-100%' : '-100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full md:w-72 bg-white border-r border-gray-200 p-4 shadow-lg overflow-y-auto shrink-0 ${isMobile ? 'fixed inset-0 z-20 md:relative' : 'relative'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Nodes</h2>
                {isMobile && <Button variant="ghost" size="icon" onClick={() => setActiveTab('canvas')}><XCircle /></Button>}
              </div>
              <NodeSelector onDragStart={onDragStart} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* React Flow Canvas */}
        <div className="flex-grow h-full relative" onClick={() => { if (isMobile && activeTab !== 'canvas') setActiveTab('canvas'); }}>
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
            onPaneClick={closeConfigSidebar}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-slate-50 to-gray-100">
            <Controls />
            {showMiniMap && <MiniMap nodeStrokeWidth={3} zoomable pannable />}
            <Background color="#ccc" variant="dots" gap={16} size={1} />
            <Panel position="top-left">
              <Input 
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                placeholder="Automation Name"
                className="mt-2 ml-2 w-auto bg-white shadow-md"
              />
            </Panel>
            <Panel position="top-right">
                <Button onClick={handleSave} className="mt-2 mr-2">
                    <Save className="h-4 w-4 mr-2" /> Save Flow
                </Button>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right-hand Configuration Sidebar (Contextual) */}
        <AnimatePresence>
          {selectedNodeForSidebar && (
            <motion.div
              key="config-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:w-80 bg-white border-l border-gray-200 shadow-xl md:h-full overflow-y-auto fixed top-0 right-0 h-full z-30 md:relative md:z-auto md:block">
              <NodeConfigurationSidebar
                key={selectedNodeForSidebar.id}
                selectedNode={selectedNodeForSidebar}
                onNodeDataChange={handleNodeUpdate}
                onClose={closeConfigSidebar}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Tabs for switching between Palette and Properties */}
        {isMobile && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="fixed bottom-0 left-0 right-0 w-full bg-white border-t z-40 md:hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nodes">Palette</TabsTrigger>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-4 md:left-auto md:right-4 md:translate-x-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-50 w-11/12 md:max-w-sm">
                <div className="flex items-center mb-1">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
                    <h4 className="font-semibold text-red-800">Validation Issues</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-0.5">
                    {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
                <Button variant="ghost" size="sm" onClick={() => setValidationErrors([])} className="mt-2 text-red-700 hover:bg-red-200 hover:text-red-800 float-right">
                    Dismiss
                </Button>
            </div>
        )}
      </div>
    </ReactFlowProvider>
  );
});

// Node Selector Component
function NodeSelector({ onDragStart }) {
  const triggerNodeOptions = [
    {
      type: 'instagramTrigger',
      label: 'Instagram Comment Trigger',
      description: 'Triggers on Instagram post/reel comments.',
      icon: <Zap className="h-5 w-5 text-pink-500 inline-block mr-2" />,
      data: { 
        label: 'Instagram Comment Trigger',
        service_id: '1',
        platform_id: 'YOUR_INSTAGRAM_PLATFORM_ID'
      }
    },
    {
      type: 'facebookTrigger',
      label: 'Facebook Post Trigger',
      description: 'Triggers on Facebook post comments.',
      icon: <Zap className="h-5 w-5 text-blue-600 inline-block mr-2" />, 
      data: { 
        label: 'Facebook Post Trigger', 
        service_id: '1',
        platform_id: '2708942999274612'
      }
    }
  ];

  const actionNodeOptions = [
    {
      type: 'instagramMessage',
      label: 'Instagram Reply Action',
      description: 'Sends an Instagram message or comment reply.',
      icon: <MessageSquare className="h-5 w-5 text-purple-500 inline-block mr-2" />,
      data: { 
        label: 'Instagram Reply',
      }
    },
    {
      type: 'facebookMessage',
      label: 'Facebook Reply Action',
      description: 'Sends a Facebook message or comment reply.',
      icon: <MessageSquare className="h-5 w-5 text-indigo-600 inline-block mr-2" />,
      data: { 
        label: 'Facebook Reply',
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Triggers</h3>
        <div className="space-y-2">
          {triggerNodeOptions.map((option) => (
            <div
              key={option.type}
              className="flex items-center p-3 rounded-lg cursor-grab bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all shadow-sm hover:shadow-md"
              draggable
              onDragStart={(e) => onDragStart(e, option.type, option.data)}
            >
              {option.icon}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Actions</h3>
        <div className="space-y-2">
          {actionNodeOptions.map((option) => (
            <div
              key={option.type}
              className="flex items-center p-3 rounded-lg cursor-grab bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all shadow-sm hover:shadow-md"
              draggable
              onDragStart={(e) => onDragStart(e, option.type, option.data)}
            >
              {option.icon}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Example for other categories if needed later */}
      {/* <div>
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Utilities</h3>
        // ... utility nodes ...
      </div> */}
    </div>
  );
}

export default AutomationFlowBuilder; 