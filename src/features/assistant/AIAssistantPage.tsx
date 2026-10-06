import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Button,
  SimpleGrid,
  Stack,
  Card,
  Textarea
} from '@chakra-ui/react';
import {
  Sparkles,
  Send,
  Trash2,
  HardHat,
  Boxes,
  ClipboardList,
  ShoppingCart,
  Users,
  Wallet,
  Scale,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ChatMessage, ERPContextData } from '../../services/chatbot/types';
import { chatbotService } from '../../services/chatbot/chatbotService';
import { StructuredResponseView } from './components/StructuredResponseView';

const SUGGESTED_CATEGORIES = [
  {
    category: 'Civil Projects & Execution',
    icon: HardHat,
    color: '#2563eb',
    prompts: [
      'Show me active projects',
      'Which projects are behind schedule?',
      'Show bridge extension project status'
    ]
  },
  {
    category: 'Warehouse & Materials',
    icon: Boxes,
    color: '#ef4444',
    prompts: [
      'What items are low in stock?',
      'Check warehouse inventory status',
      'Show material reorder alerts'
    ]
  },
  {
    category: 'Approvals & Procurement',
    icon: ClipboardList,
    color: '#f59e0b',
    prompts: [
      'Show pending requisitions',
      'What purchase orders are awaiting delivery?',
      'Show recent vendor POs'
    ]
  },
  {
    category: 'HR, Payroll & Finance',
    icon: Wallet,
    color: '#10b981',
    prompts: [
      'Give me a summary of this month\'s payroll',
      'Show active company staff',
      'Show accounts ledger summary'
    ]
  }
];

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const erp = useERP();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const contextData: ERPContextData = {
        activeCompany: erp.activeCompany,
        activeRole: erp.activeRole,
        currentUserName: erp.currentUserName,
        projects: erp.projects,
        inventory: erp.inventory,
        requisitions: erp.requisitions,
        purchaseOrders: erp.purchaseOrders,
        employees: erp.employees,
        payrollRuns: erp.payrollRuns,
        accountsLedger: erp.accountsLedger
      };

      const response = await chatbotService.sendMessage({
        query,
        history: messages,
        context: contextData
      });

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: response.structuredData,
        suggestedFollowUps: response.suggestedFollowUps,
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I couldn\'t process that request right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const activeProjectsCount = erp.projects.filter(p => p.status === 'in_progress').length;
  const lowStockCount = erp.inventory.filter(i => i.currentStock <= i.minLevel).length;
  const pendingReqsCount = erp.requisitions.filter(r => r.status.includes('Pending')).length;

  return (
    <Box>
      {/* Page Header */}
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
        <Box>
          <Flex align="center" gap={3}>
            <Box
              w="40px"
              h="40px"
              borderRadius="12px"
              bg="#2563eb"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 2px 10px rgba(37, 99, 235, 0.3)"
            >
              <Sparkles size={22} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a" fontWeight="bold">
                ERP Assistant & Operations Intelligence
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Natural language query engine connecting civil projects, stores, procurement, and payroll.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap={2}>
          <Badge size="sm" colorPalette="blue" variant="solid">
            {erp.activeCompany.name}
          </Badge>
          <Badge size="sm" colorPalette="purple" variant="subtle">
            Role: {erp.activeRole}
          </Badge>
          <Badge size="sm" colorPalette="green" variant="solid">
            Context Active
          </Badge>
        </Flex>
      </Flex>

      {/* Main Grid: Left Prompts / Context & Right Chat Thread */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={6}>
        {/* Left Column (4 cols on lg) */}
        <Box gridColumn={{ lg: 'span 4' }}>
          <Stack gap={5}>
            {/* Live Context Card */}
            <Card.Root bg="white" borderRadius="16px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Connected System State
              </Text>
              <SimpleGrid columns={2} gap={2.5}>
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
                  <Text fontSize="10px" color="#64748b">Active Sites</Text>
                  <Text fontSize="lg" fontWeight="black" color="#2563eb">
                    {activeProjectsCount} Projects
                  </Text>
                </Box>
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
                  <Text fontSize="10px" color="#64748b">Low Stock Alert</Text>
                  <Text fontSize="lg" fontWeight="black" color={lowStockCount > 0 ? '#ef4444' : '#10b981'}>
                    {lowStockCount} Items
                  </Text>
                </Box>
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
                  <Text fontSize="10px" color="#64748b">Pending Requisitions</Text>
                  <Text fontSize="lg" fontWeight="black" color="#f59e0b">
                    {pendingReqsCount} Pending
                  </Text>
                </Box>
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
                  <Text fontSize="10px" color="#64748b">Total Personnel</Text>
                  <Text fontSize="lg" fontWeight="black" color="#059669">
                    {erp.employees.length} Staff
                  </Text>
                </Box>
              </SimpleGrid>
            </Card.Root>

            {/* Categorized Starters */}
            <Card.Root bg="white" borderRadius="16px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Operations Query Starters
              </Text>
              <Stack gap={4}>
                {SUGGESTED_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Box key={idx}>
                      <Flex align="center" gap={2} mb={1.5}>
                        <Icon size={14} color={cat.color} />
                        <Text fontSize="xs" fontWeight="bold" color="#334155">
                          {cat.category}
                        </Text>
                      </Flex>
                      <Stack gap={1} pl={5}>
                        {cat.prompts.map((prompt, pIdx) => (
                          <Box
                            key={pIdx}
                            as="button"
                            onClick={() => handleSend(prompt)}
                            textAlign="left"
                            fontSize="11px"
                            color="#64748b"
                            py={1}
                            px={2}
                            borderRadius="6px"
                            _hover={{ bg: '#eff6ff', color: '#1d4ed8' }}
                            cursor="pointer"
                            transition="all 0.15s ease"
                          >
                            • {prompt}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Card.Root>

            {/* Governance & Privacy Notice */}
            <Box p={3.5} bg="#eff6ff" border="1px solid #bfdbfe" borderRadius="12px">
              <Flex gap={2.5}>
                <ShieldCheck size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#1e40af">
                    Role-Based Access Control Active
                  </Text>
                  <Text fontSize="11px" color="#3b82f6" mt={0.5}>
                    Responses are automatically scoped to your logged-in credentials ({erp.activeRole}). Financial and payroll data remain strictly shielded from unauthorized roles.
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
        </Box>

        {/* Right Column: Chat Console (8 cols on lg) */}
        <Box gridColumn={{ lg: 'span 8' }}>
          <Card.Root
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            boxShadow="xs"
            display="flex"
            flexDirection="column"
            h="720px"
            overflow="hidden"
          >
            {/* Top Toolbar */}
            <Flex
              align="center"
              justify="space-between"
              px={5}
              py={3.5}
              borderBottom="1px solid #e2e8f0"
              bg="#ffffff"
              color="#0f172a"
            >
              <Flex align="center" gap={3}>
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="8px"
                  bg="#2563eb"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 2px 6px rgba(37,99,235,0.2)"
                >
                  <Sparkles size={18} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                    ERP Assistant Console
                  </Text>
                  <Text fontSize="10px" color="#64748b">
                    Direct access to construction databases, BOQs & approval chains
                  </Text>
                </Box>
              </Flex>

              {messages.length > 0 && (
                <Button
                  size="xs"
                  variant="outline"
                  borderColor="#e2e8f0"
                  color="#64748b"
                  _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                  onClick={handleClear}
                >
                  <Trash2 size={13} style={{ marginRight: '4px' }} /> Clear Thread
                </Button>
              )}
            </Flex>

            {/* Messages Body */}
            <Box
              flex="1"
              overflowY="auto"
              p={5}
              bg="#f8fafc"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              {/* Empty Welcome Screen */}
              {messages.length === 0 && (
                <Box my="auto" maxW="560px" mx="auto" textAlign="center" py={4}>
                  <Box
                    w="56px"
                    h="56px"
                    borderRadius="16px"
                    bg="#dbeafe"
                    color="#2563eb"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={3}
                  >
                    <Bot size={32} />
                  </Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">
                    How can I assist your construction operations today?
                  </Heading>
                  <Text fontSize="xs" color="#64748b" mt={2} mb={5} lineHeight="relaxed">
                    I have full operational awareness of <strong>{erp.activeCompany.name}</strong>. Ask about active projects, delivery schedules, inventory stockouts, material requisitions, or payroll disbursements.
                  </Text>

                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2.5}>
                    {[
                      'Show me active projects',
                      'Which projects are behind schedule?',
                      'What items are low in stock?',
                      'Show pending requisitions',
                      'What purchase orders are awaiting delivery?',
                      'Show recent business activity'
                    ].map((prompt, idx) => (
                      <Box
                        key={idx}
                        as="button"
                        onClick={() => handleSend(prompt)}
                        p={3}
                        bg="white"
                        border="1px solid #e2e8f0"
                        borderRadius="10px"
                        fontSize="xs"
                        color="#334155"
                        textAlign="left"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        _hover={{ bg: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' }}
                        cursor="pointer"
                        transition="all 0.15s ease"
                        boxShadow="2xs"
                      >
                        <Text fontWeight="medium">{prompt}</Text>
                        <ArrowRight size={14} style={{ opacity: 0.6 }} />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Message List */}
              {messages.map(msg => (
                <Box
                  key={msg.id}
                  alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxW={{ base: "90%", md: "80%" }}
                >
                  <Flex
                    align="start"
                    gap={2.5}
                    flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
                  >
                    <Box
                      w="28px"
                      h="28px"
                      borderRadius="full"
                      bg={msg.role === 'user' ? '#2563eb' : '#059669'}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      mt={0.5}
                    >
                      {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                    </Box>

                    <Box>
                      <Box
                        p={4}
                        borderRadius="14px"
                        bg={
                          msg.role === 'user'
                            ? '#2563eb'
                            : msg.isError
                            ? '#fef2f2'
                            : '#ffffff'
                        }
                        color={
                          msg.role === 'user'
                            ? 'white'
                            : msg.isError
                            ? '#991b1b'
                            : '#0f172a'
                        }
                        border={
                          msg.role === 'user'
                            ? 'none'
                            : msg.isError
                            ? '1px solid #fecaca'
                            : '1px solid #e2e8f0'
                        }
                        boxShadow="xs"
                        fontSize="xs"
                        lineHeight="relaxed"
                        whiteSpace="pre-wrap"
                      >
                        {msg.content}
                      </Box>

                      {msg.structuredData && (
                        <StructuredResponseView
                          data={msg.structuredData}
                          onActionClick={(path) => navigate(path)}
                        />
                      )}

                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <Flex wrap="wrap" gap={1.5} mt={2.5}>
                          {msg.suggestedFollowUps.map((followUp, idx) => (
                            <Box
                              key={idx}
                              as="button"
                              onClick={() => handleSend(followUp)}
                              px={3}
                              py={1.5}
                              bg="#ffffff"
                              border="1px solid #cbd5e1"
                              borderRadius="full"
                              fontSize="11px"
                              color="#334155"
                              _hover={{ bg: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' }}
                              cursor="pointer"
                              transition="all 0.15s ease"
                            >
                              {followUp}
                            </Box>
                          ))}
                        </Flex>
                      )}

                      <Text
                        fontSize="10px"
                        color="#94a3b8"
                        mt={1}
                        textAlign={msg.role === 'user' ? 'right' : 'left'}
                      >
                        {msg.timestamp}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <Flex align="center" gap={2.5} alignSelf="flex-start">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    bg="#2563eb"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Bot size={15} />
                  </Box>
                  <Box
                    px={4}
                    py={3}
                    bg="white"
                    border="1px solid #e2e8f0"
                    borderRadius="14px"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    boxShadow="xs"
                  >
                    <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite" />
                    <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite 0.2s" />
                    <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite 0.4s" />
                    <Text fontSize="11px" color="#64748b" ml={2}>
                      Consulting Construction ERP state...
                    </Text>
                  </Box>
                </Flex>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Input Bar */}
            <Box p={4} bg="#ffffff" borderTop="1px solid #e2e8f0">
              <Flex gap={3} align="flex-end">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e: any) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about projects, inventory, requisitions, payroll..."
                  rows={2}
                  flex="1"
                  p={3}
                  fontSize="xs"
                  bg="#f8fafc"
                  border="1px solid #cbd5e1"
                  borderRadius="10px"
                  outline="none"
                  resize="none"
                  disabled={loading}
                  _focus={{
                    borderColor: '#2563eb',
                    bg: '#ffffff',
                    boxShadow: '0 0 0 1px #2563eb'
                  }}
                />
                <Button
                  size="md"
                  bg="#2563eb"
                  color="white"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  _hover={{ bg: '#1d4ed8' }}
                  borderRadius="10px"
                  px={5}
                  h="62px"
                  flexShrink={0}
                >
                  <Send size={18} style={{ marginRight: '6px' }} /> Send
                </Button>
              </Flex>
              <Flex justify="space-between" align="center" mt={2} px={1}>
                <Text fontSize="11px" color="#94a3b8">
                  Press Enter to send, Shift+Enter for new line
                </Text>
                <Text fontSize="11px" color="#94a3b8">
                  Connected to Live Workspace Context
                </Text>
              </Flex>
            </Box>
          </Card.Root>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
