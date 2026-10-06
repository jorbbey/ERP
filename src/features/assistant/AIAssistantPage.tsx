import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Button,
  Stack,
  SimpleGrid
} from '@chakra-ui/react';
import {
  Sparkles,
  Send,
  Trash2,
  HardHat,
  Boxes,
  ClipboardList,
  FileCheck,
  Building2,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ChatMessage } from '../../services/chatbot/types';
import { chatbotService } from '../../services/chatbot/chatbotService';
import { StructuredResponseView } from './components/StructuredResponseView';

export const AIAssistantPage: React.FC = () => {
  const { 
    projects, 
    inventory, 
    requisitions, 
    purchaseOrders, 
    employees, 
    payrollRuns, 
    accountsLedger,
    activeCompany, 
    activeRole,
    currentUserName
  } = useERP();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-page',
      role: 'assistant',
      content: `Hello ${currentUserName || 'Executive'}, welcome to the ERP Assistant workspace for **${activeCompany?.name || 'Apex Construction Group'}**.\n\nI can retrieve real-time data across civil contracts, stock reserves, field requisitions, vendor purchase orders, payroll disbursements, and financial balances. How can I assist your operations today?`,
      timestamp: new Date().toISOString(),
      suggestedFollowUps: [
        'Show me active projects and schedule progress',
        'Which materials are running low in stock?',
        'Show requisitions waiting for my approval',
        'Summary of open purchase orders and deliveries'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage({
        query: text,
        context: {
          projects,
          inventory,
          requisitions,
          purchaseOrders,
          employees,
          payrollRuns,
          accountsLedger,
          activeCompany,
          activeRole,
          currentUserName
        },
        history: messages
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        structuredData: response.structuredData,
        suggestedFollowUps: response.suggestedFollowUps,
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while querying ERP records. Please verify the query and try again.',
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. I am connected to active holding **${activeCompany?.name || 'Apex Construction Group'}** under role **${activeRole}**. Ask me anything across projects, materials, approvals, or finance.`,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: [
          'Show me active projects',
          'Which materials are low in stock?',
          'Show pending requisitions',
          'View total workforce headcount'
        ]
      }
    ]);
  };

  const pendingReqCount = requisitions?.filter(r => 
    r.status.toLowerCase().includes('pending')
  ).length || 0;

  const lowStockCount = inventory?.filter(i => 
    i.currentStock <= i.minLevel
  ).length || 0;

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1600px" mx="auto">
      {/* Page Header */}
      <Flex 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        direction={{ base: 'column', md: 'row' }}
        gap={4}
        mb={6}
        pb={5}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box>
          <Flex align="center" gap={3}>
            <Box p={2.5} bg="brand.50" borderRadius="lg" color="brand.600" border="1px solid" borderColor="brand.200">
              <Sparkles size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="gray.900" fontWeight="bold">
                ERP Intelligent Assistant
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Natural-language query & automated decision support across all construction operations
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap={3} wrap="wrap">
          <Badge bg="blue.50" color="blue.700" border="1px solid" borderColor="blue.200" px={3} py={1} borderRadius="md" fontSize="xs">
            🏢 {activeCompany?.name || 'Apex Holding'}
          </Badge>
          <Badge bg="purple.50" color="purple.700" border="1px solid" borderColor="purple.200" px={3} py={1} borderRadius="md" fontSize="xs">
            👤 Role: {activeRole}
          </Badge>
          <Badge bg="emerald.50" color="emerald.700" border="1px solid" borderColor="emerald.200" px={3} py={1} borderRadius="md" fontSize="xs">
            🟢 Real-time Synchronized
          </Badge>
          <Button 
            size="sm" 
            variant="outline" 
            colorScheme="gray" 
            onClick={handleClearHistory}
            fontSize="xs"
          >
            <Trash2 size={13} style={{ marginRight: 6 }} /> Reset Thread
          </Button>
        </Flex>
      </Flex>

      {/* Main Grid: Left side intelligence helpers, Right side Chat Console */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={6}>
        {/* Left Column: Quick queries & Operational Context (4 cols) */}
        <Box gridColumn={{ lg: 'span 4' }}>
          <Stack gap={5}>
            {/* Real-time Enterprise Snapshot */}
            <Box bg="white" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
              <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Enterprise Snapshot
              </Text>
              <SimpleGrid columns={2} gap={3}>
                <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                  <Text fontSize="2xs" color="gray.500" textTransform="uppercase">Active Sites</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">{projects?.length || 0}</Text>
                  <Text fontSize="2xs" color="emerald.600">All within schedule</Text>
                </Box>
                <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                  <Text fontSize="2xs" color="gray.500" textTransform="uppercase">Stock SKUs</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">{inventory?.length || 0}</Text>
                  <Text fontSize="2xs" color="amber.600">
                    {lowStockCount} below reorder
                  </Text>
                </Box>
                <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                  <Text fontSize="2xs" color="gray.500" textTransform="uppercase">Pending Requisitions</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {pendingReqCount}
                  </Text>
                  <Text fontSize="2xs" color="blue.600">Awaiting sign-off</Text>
                </Box>
                <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                  <Text fontSize="2xs" color="gray.500" textTransform="uppercase">Active Workforce</Text>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">{employees?.length || 0}</Text>
                  <Text fontSize="2xs" color="purple.600">Across 6 departments</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Quick Prompts by Domain */}
            <Box bg="white" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
              <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Sample Operational Queries
              </Text>
              
              <Stack gap={2.5}>
                {[
                  {
                    icon: HardHat,
                    title: 'Projects & Progress',
                    query: 'Show me active projects and schedule progress'
                  },
                  {
                    icon: Boxes,
                    title: 'Low Stock Alert',
                    query: 'Which materials are running low in stock?'
                  },
                  {
                    icon: ClipboardList,
                    title: 'Requisition Approvals',
                    query: 'Show requisitions waiting for approval'
                  },
                  {
                    icon: FileCheck,
                    title: 'Purchase Orders & Orders',
                    query: 'List open purchase orders and delivery dates'
                  },
                  {
                    icon: DollarSign,
                    title: 'Payroll & Compensation',
                    query: 'What was the last payroll run total and status?'
                  },
                  {
                    icon: Building2,
                    title: 'Company & Group Details',
                    query: 'Which business entity and group am I currently in?'
                  }
                ].map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    justifyContent="flex-start"
                    h="auto"
                    py={2.5}
                    px={3}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.100"
                    _hover={{ bg: 'brand.50', borderColor: 'brand.200' }}
                    onClick={() => handleSendMessage(item.query)}
                  >
                    <Flex align="center" gap={2.5} w="full">
                      <Box p={1.5} borderRadius="md" bg="gray.100" color="gray.700">
                        <item.icon size={15} />
                      </Box>
                      <Box textAlign="left" flex="1">
                        <Text fontSize="xs" fontWeight="semibold" color="gray.800">
                          {item.title}
                        </Text>
                        <Text fontSize="2xs" color="gray.500">
                          "{item.query}"
                        </Text>
                      </Box>
                    </Flex>
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Enterprise Security Note */}
            <Box bg="gray.50" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200">
              <Flex gap={2.5} align="flex-start">
                <ShieldCheck size={18} color="#0284c7" style={{ marginTop: 2, flexShrink: 0 }} />
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.800">
                    Role-Based Access Guard
                  </Text>
                  <Text fontSize="2xs" color="gray.600" mt={0.5} lineHeight="shorter">
                    Information presented is filtered according to your assigned privileges ({activeRole}). Confidential payroll data is restricted to HR & Managing Director permissions.
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
        </Box>

        {/* Right Column: Interactive Chat Console (8 cols) */}
        <Box gridColumn={{ lg: 'span 8' }}>
          <Box 
            bg="white" 
            borderRadius="xl" 
            border="1px solid" 
            borderColor="gray.200" 
            boxShadow="sm"
            display="flex"
            flexDirection="column"
            height="calc(100vh - 220px)"
            minH="600px"
          >
            {/* Top Chat Bar */}
            <Flex 
              p={4} 
              borderBottom="1px solid" 
              borderColor="gray.100" 
              justify="space-between" 
              align="center"
              bg="gray.50"
              borderTopRadius="xl"
            >
              <Flex align="center" gap={3}>
                <Box position="relative">
                  <Box w="36px" h="36px" borderRadius="lg" bg="brand.600" display="flex" alignItems="center" justifyContent="center" color="white" boxShadow="xs">
                    <Sparkles size={18} />
                  </Box>
                  <Box 
                    position="absolute" 
                    bottom="-2px" 
                    right="-2px" 
                    w="10px" 
                    h="10px" 
                    borderRadius="full" 
                    bg="emerald.500" 
                    border="2px solid white" 
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.900">
                    ERP Core Intelligence Console
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Ready to answer project, material, PO, procurement, and accounting queries
                  </Text>
                </Box>
              </Flex>

              <Badge bg="green.50" color="green.700" border="1px solid" borderColor="green.200" px={2.5} py={0.5} borderRadius="full" fontSize="2xs">
                ● Connected to Live State
              </Badge>
            </Flex>

            {/* Messages Scroll Area */}
            <Box 
              flex="1" 
              overflowY="auto" 
              p={{ base: 4, md: 6 }} 
              bg="#fcfdfe"
            >
              <Stack gap={5}>
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';

                  return (
                    <Flex 
                      key={msg.id} 
                      justify={isUser ? 'flex-end' : 'flex-start'}
                    >
                      <Flex 
                        maxW={{ base: '95%', md: '82%' }} 
                        gap={3}
                        flexDirection={isUser ? 'row-reverse' : 'row'}
                      >
                        {/* Avatar */}
                        <Box 
                          w="32px" 
                          h="32px" 
                          borderRadius="lg" 
                          bg={isUser ? 'gray.700' : 'brand.600'} 
                          color="white" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center" 
                          flexShrink={0}
                          mt={1}
                          boxShadow="xs"
                        >
                          {isUser ? (
                            <Text fontSize="xs" fontWeight="bold">You</Text>
                          ) : (
                            <Sparkles size={16} />
                          )}
                        </Box>

                        {/* Message Bubble & Content */}
                        <Box>
                          <Box 
                            p={4} 
                            borderRadius="xl"
                            bg={isUser ? 'brand.600' : 'white'}
                            color={isUser ? 'white' : 'gray.800'}
                            border="1px solid"
                            borderColor={isUser ? 'brand.700' : 'gray.200'}
                            boxShadow={isUser ? 'sm' : 'xs'}
                            whiteSpace="pre-wrap"
                            fontSize="sm"
                            lineHeight="tall"
                          >
                            <Text>{msg.content}</Text>
                          </Box>

                          {/* Structured ERP Card Content */}
                          {msg.structuredData && (
                            <Box mt={3} maxW="100%">
                              <StructuredResponseView 
                                data={msg.structuredData} 
                                onActionClick={(path) => navigate(path)} 
                              />
                            </Box>
                          )}

                          {/* Quick Navigation Action Pills */}
                          {msg.actions && msg.actions.length > 0 && (
                            <Flex wrap="wrap" gap={2} mt={3}>
                              {msg.actions.map((act, aIdx) => (
                                <Button
                                  key={aIdx}
                                  size="xs"
                                  variant="outline"
                                  bg="white"
                                  borderColor="brand.300"
                                  color="brand.700"
                                  _hover={{ bg: 'brand.50' }}
                                  onClick={() => act.path && navigate(act.path)}
                                  fontSize="2xs"
                                >
                                  {act.label} <ExternalLink size={10} style={{ marginLeft: 4 }} />
                                </Button>
                              ))}
                            </Flex>
                          )}

                          {/* Follow-up suggestions */}
                          {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                            <Box mt={3}>
                              <Text fontSize="2xs" fontWeight="bold" color="gray.500" mb={1.5} textTransform="uppercase" letterSpacing="wider">
                                Suggested inquiries:
                              </Text>
                              <Flex wrap="wrap" gap={2}>
                                {msg.suggestedFollowUps.map((sug, sIdx) => (
                                  <Button
                                    key={sIdx}
                                    size="xs"
                                    variant="subtle"
                                    bg="gray.100"
                                    color="gray.700"
                                    borderRadius="full"
                                    _hover={{ bg: 'brand.50', color: 'brand.700', borderColor: 'brand.200' }}
                                    border="1px solid transparent"
                                    onClick={() => handleSendMessage(sug)}
                                    fontSize="2xs"
                                  >
                                    {sug}
                                  </Button>
                                ))}
                              </Flex>
                            </Box>
                          )}

                          {/* Timestamp */}
                          <Text 
                            fontSize="2xs" 
                            color="gray.400" 
                            mt={1.5} 
                            textAlign={isUser ? 'right' : 'left'}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  );
                })}

                {/* Loading state indicator */}
                {isLoading && (
                  <Flex align="center" gap={3}>
                    <Box 
                      w="32px" 
                      h="32px" 
                      borderRadius="lg" 
                      bg="brand.600" 
                      color="white" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <Sparkles size={16} />
                    </Box>
                    <Box 
                      p={3.5} 
                      borderRadius="xl" 
                      bg="white" 
                      border="1px solid" 
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <RefreshCw size={14} className="animate-spin" color="#0284c7" />
                      <Text fontSize="xs" color="gray.600">
                        Querying ERP context & synthesizing operations insights...
                      </Text>
                    </Box>
                  </Flex>
                )}

                <div ref={messagesEndRef} />
              </Stack>
            </Box>

            {/* Input Bar */}
            <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="white" borderBottomRadius="xl">
              <Flex gap={3} align="center">
                <Box flex="1" position="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about project timelines, concrete inventory, pending POs, payroll totals... (Press Enter to send)"
                    rows={1}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '13px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      color: '#1e293b',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </Box>
                <Button
                  colorScheme="brand"
                  bg="brand.600"
                  color="white"
                  _hover={{ bg: 'brand.700' }}
                  disabled={!inputValue.trim() || isLoading}
                  onClick={() => handleSendMessage()}
                  px={5}
                  h="40px"
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  <Send size={14} style={{ marginRight: 6 }} /> Send
                </Button>
              </Flex>

              {/* Bottom Quick Chips */}
              <Flex gap={2} mt={3} wrap="wrap" align="center">
                <Text fontSize="2xs" color="gray.400" fontWeight="bold">Quick Queries:</Text>
                {[
                  'Active Projects',
                  'Low Stock Reorder',
                  'Pending Approvals',
                  'Recent Purchase Orders',
                  'Headcount by Department'
                ].map((tag, tIdx) => (
                  <Badge
                    key={tIdx}
                    as="button"
                    variant="subtle"
                    bg="gray.100"
                    color="gray.700"
                    cursor="pointer"
                    _hover={{ bg: 'brand.50', color: 'brand.700' }}
                    borderRadius="md"
                    px={2}
                    py={0.5}
                    fontSize="2xs"
                    onClick={() => handleSendMessage(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
