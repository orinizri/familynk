import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Box, TextField, Typography, Divider } from "@mui/material";
import SideBar from "../../components/Sidebar/Sidebar";
import useTreeNetwork from "../../hooks/useTreeNetwork";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";

export default function TreeEditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { user } = useAuth();
  const { persons, error } = useTreeNetwork(user.id);

  useEffect(() => {
    console.log("Persons loaded:", persons, error);
    if (error) {
      toast.error("Failed to load persons: " + error);
      return;
    }
    setNodes(
      persons.map((person) => ({
        id: person.id,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          label: person.first_name + " " + person.last_name,
        },
      }))
    );
  }, [persons, setNodes, error]);

  // Add new person
  const handleAddPerson = () => {
    const id = "new";
    const newNode: Node = {
      id,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: "New Person",
      },
    };
    setNodes((nds: Node[]) => [...nds, newNode]);
    setSelectedNodeId(id);
  };

  // Edit person name
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, label: name } }
            : node
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Canvas Area */}
      <Box sx={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </Box>

      <SideBar
        content={
          <>
            <Typography variant="h6" gutterBottom>
              Add Person
            </Typography>

            <TextField
              fullWidth
              label="Name"
              sx={{ mb: 2 }}
              onChange={handleNameChange}
            />

            <Divider sx={{ my: 2 }} />
          </>
        }
        actions={[
          {
            key: "add-person",
            label: "Add Person",
            onClick: handleAddPerson,
          },
        ]}
      />
    </Box>
  );
}
