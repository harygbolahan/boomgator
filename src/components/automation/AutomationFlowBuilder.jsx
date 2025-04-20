import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';

// Node types definition
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

  // Connect nodes when edges are created
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Setup React Flow instance when it's ready
  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

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

      // Get position from drop point
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node
      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { ...nodeData, label: nodeData.label || `New ${type}` },
      };

      // Add the new node
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle node click
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // Handle saving the automation
  const handleSave = useCallback(() => {
    // Validate the flow
    const triggerNodes = nodes.filter(n => n.type === 'triggerNode');
    if (triggerNodes.length === 0) {
      alert('Your automation needs at least one trigger');
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
  }, [nodes, edges, automationName, onSave]);

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

  return (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden">
      <ReactFlowProvider>
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
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            
            {/* Sidebar with available nodes */}
            <Panel position="top-left" className="bg-card rounded-lg p-4 shadow-md">
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Automation Flow Builder</h3>
                  <input
                    type="text"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Automation Name"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Drag & Drop Nodes</h4>
                  <div className="space-y-2">
                    <div
                      className="border p-2 rounded-md cursor-move bg-blue-50 hover:bg-blue-100 transition-colors"
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, 'triggerNode', {
                          nodeType: 'trigger', 
                          label: 'Trigger',
                          platform: 'All Platforms',
                          triggerType: 'Comment',
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-1 rounded-full">🔔</div>
                        <span>Trigger Node</span>
                      </div>
                    </div>
                    <div
                      className="border p-2 rounded-md cursor-move bg-yellow-50 hover:bg-yellow-100 transition-colors"
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, 'conditionNode', {
                          nodeType: 'condition',
                          label: 'Condition',
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-100 p-1 rounded-full">🔍</div>
                        <span>Condition Node</span>
                      </div>
                    </div>
                    <div
                      className="border p-2 rounded-md cursor-move bg-green-50 hover:bg-green-100 transition-colors"
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, 'actionNode', {
                          nodeType: 'action',
                          label: 'Action',
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-1 rounded-full">✅</div>
                        <span>Action Node</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Save Automation
                </Button>
              </div>
            </Panel>
            
            {/* Node properties panel */}
            {selectedNode && (
              <Panel position="top-right" className="bg-card rounded-lg p-4 shadow-md max-w-xs">
                <h3 className="text-lg font-medium mb-2">Node Properties</h3>
                <NodeProperties 
                  node={selectedNode} 
                  onChange={(updatedData) => {
                    setNodes(nodes.map(n => {
                      if (n.id === selectedNode.id) {
                        return {
                          ...n,
                          data: {
                            ...n.data,
                            ...updatedData
                          }
                        };
                      }
                      return n;
                    }));
                  }}
                  onClose={() => setSelectedNode(null)}
                />
              </Panel>
            )}
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

// Node Properties panel component
function NodeProperties({ node, onChange, onClose }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  let content;
  
  switch (node.type) {
    case 'triggerNode':
      content = (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={node.data.label || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              name="platform"
              value={node.data.platform || 'All Platforms'}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="All Platforms">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Type</label>
            <select
              name="triggerType"
              value={node.data.triggerType || 'Comment'}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Comment">Comment</option>
              <option value="Message">Message</option>
              <option value="Keyword">Keyword</option>
              <option value="Story">Story</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={node.data.description || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={2}
              placeholder="E.g., When someone comments on a post"
            />
          </div>
        </div>
      );
      break;
    case 'conditionNode':
      content = (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={node.data.label || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition Type</label>
            <select
              name="conditionType"
              value={node.data.conditionType || 'Contains'}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Contains">Contains Text</option>
              <option value="Equals">Equals Text</option>
              <option value="StartsWith">Starts With</option>
              <option value="EndsWith">Ends With</option>
              <option value="RegExp">Regular Expression</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              name="value"
              value={node.data.value || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="E.g., price, help, discount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={node.data.description || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={2}
              placeholder="E.g., If comment contains 'price'"
            />
          </div>
        </div>
      );
      break;
    case 'actionNode':
      content = (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={node.data.label || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Action Type</label>
            <select
              name="actionType"
              value={node.data.actionType || 'Reply'}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Reply">Reply</option>
              <option value="Like">Like</option>
              <option value="DM">Send Direct Message</option>
              <option value="Notification">Send Notification</option>
              <option value="Tag">Tag User/Content</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Response</label>
            <textarea
              name="response"
              value={node.data.response || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="E.g., Thank you for your interest! Our prices start at $99."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={node.data.description || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={2}
              placeholder="E.g., Reply with pricing information"
            />
          </div>
        </div>
      );
      break;
    default:
      content = <p>Select a node to edit its properties</p>;
  }

  return (
    <div className="space-y-4">
      {content}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default AutomationFlowBuilder; 