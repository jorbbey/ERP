import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Stack,
  IconButton,
  Textarea
} from '@chakra-ui/react';
import {
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Send,
  Trash2,
  HardHat,
  Boxes,
  ClipboardList,
  ShoppingCart,
  Users,
  Wallet,
  Scale,
  RotateCcw,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { ChatMessage, ERPContextData } from '../../../services/chatbot/types';
import { chatbotService } from '../../../services/chatbot/chatbotService';
import { StructuredResponseView } from './StructuredResponseView';

const SUGGESTED_PROMPTS = [
  'Show me active projects',
  'Which projects are behind schedule?',
  'What items are low in stock?',
  'Show pending requisitions',
  'What purchase orders are awaiting delivery?',
  'Give me a summary of this month\'s payroll',
  'Show recent business activity'
];

const QUICK_ACTIONS = [
  { label: 'Projects', query: 'Show me active projects', icon: HardHat, path: '/projects' },
  { label: 'Inventory', query: 'What items are low in stock?', icon: Boxes, path: '/inventory' },
  { label: 'Requisitions', query: 'Show pending requisitions', icon: ClipboardList, path: '/requisitions' },
  { label: 'Procurement', query: 'What purchase orders are awaiting delivery?', icon: ShoppingCart, path: '/procurement' },
  { label: 'Personnel', query: 'Show active company staff', icon: Users, path: '/hr' },
  { label: 'Finance', query: 'Accounting & ledger summary', icon: Scale, path: '/accounting' }
];

export const FloatingAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const erp = useERP();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, loading]);

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

  return (
    <>
      {/* Floating Trigger Button (When Closed) */}
      {!isOpen && (
        <Box
          position="fixed"
          bottom={{ base: "18px", md: "24px" }}
          right={{ base: "18px", md: "24px" }}
          zIndex="1000"
        >
          <Box
            as="button"
            onClick={() => setIsOpen(true)}
            display="flex"
            alignItems="center"
            gap={2.5}
            px={4}
            py={3}
            bg="#ffffff"
            color="#0f172a"
            borderRadius="9999px"
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
            border="1px solid #cbd5e1"
            cursor="pointer"
            _hover={{
              bg: '#f8fafc',
              borderColor: '#94a3b8',
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 28px -5px rgba(0, 0, 0, 0.15)'
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Box
              w="28px"
              h="28px"
              borderRadius="full"
              bg="#2563eb"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              boxShadow="0 2px 5px rgba(37,99,235,0.3)"
            >
              <Sparkles size={16} />
            </Box>
            <Box textAlign="left">
              <Text fontSize="xs" fontWeight="bold" lineHeight="1.1" color="#0f172a">
                ERP Assistant
              </Text>
              <Text fontSize="10px" color="#64748b">
                Context Active
              </Text>
            </Box>
            <Box w="8px" h="8px" borderRadius="full" bg="#22c55e" ml={1} />
          </Box>
        </Box>
      )}

      {/* Floating Chat Panel (When Open) */}
      {isOpen && (
        <Box
          position="fixed"
          bottom={{ base: "0", md: "24px" }}
          right={{ base: "0", md: "24px" }}
          top={{ base: "0", md: "auto" }}
          left={{ base: "0", md: "auto" }}
          w={{
            base: "100vw",
            md: isExpanded ? "640px" : "410px"
          }}
          h={{
            base: "100vh",
            md: isExpanded ? "740px" : "600px"
          }}
          maxH={{ md: "calc(100vh - 48px)" }}
          bg="#ffffff"
          borderRadius={{ base: "0", md: "16px" }}
          boxShadow={{
            base: "none",
            md: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
          }}
          border={{ base: "none", md: "1px solid #cbd5e1" }}
          display="flex"
          flexDirection="column"
          zIndex="1100"
          overflow="hidden"
        >
          {/* Header */}
          <Flex
            align="center"
            justify="space-between"
            px={4}
            py={3}
            bg="#ffffff"
            color="#0f172a"
            borderBottom="1px solid #e2e8f0"
          >
            <Flex align="center" gap={2.5}>
              <Box
                w="32px"
                h="32px"
                borderRadius="8px"
                bg="#2563eb"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 2px 5px rgba(37,99,235,0.25)"
              >
                <Sparkles size={17} color="white" />
              </Box>
              <Box>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                    ERP Assistant
                  </Text>
                  <Badge size="xs" colorPalette="green" variant="solid" fontSize="9px">
                    Online
                  </Badge>
                </Flex>
                <Text fontSize="10px" color="#64748b">
                  {erp.activeCompany.name} • {erp.activeRole}
                </Text>
              </Box>
            </Flex>

            {/* Header Action Buttons */}
            <Flex align="center" gap={1}>
              {messages.length > 0 && (
                <Box
                  as="button"
                  onClick={handleClear}
                  p={1.5}
                  borderRadius="6px"
                  color="#64748b"
                  _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                  cursor="pointer"
                  title="Clear conversation"
                >
                  <Trash2 size={15} />
                </Box>
              )}

              <Box
                as="button"
                display={{ base: "none", md: "flex" }}
                onClick={() => setIsExpanded(!isExpanded)}
                p={1.5}
                borderRadius="6px"
                color="#64748b"
                _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                cursor="pointer"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </Box>

              <Box
                as="button"
                onClick={() => setIsOpen(false)}
                p={1.5}
                borderRadius="6px"
                color="#64748b"
                _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                cursor="pointer"
                title="Close"
              >
                <X size={17} />
              </Box>
            </Flex>
          </Flex>

          {/* Chat Messages Body */}
          <Box
            flex="1"
            overflowY="auto"
            p={4}
            bg="#f8fafc"
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {/* EMPTY STATE */}
            {messages.length === 0 && (
              <Box my="auto" py={3}>
                <Box textAlign="center" mb={4}>
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="14px"
                    bg="#dbeafe"
                    color="#2563eb"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={3}
                  >
                    <Bot size={26} />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                    Hi, I'm your ERP Assistant
                  </Text>
                  <Text fontSize="xs" color="#64748b" maxW="320px" mx="auto" mt={1}>
                    I can help you find information, query projects, track low stock, and understand what's happening across your business.
                  </Text>
                </Box>

                <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="wider" mb={2} px={1}>
                  Suggested Questions
                </Text>
                <Stack gap={1.5}>
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <Box
                      key={idx}
                      as="button"
                      onClick={() => handleSend(prompt)}
                      p={2.5}
                      bg="white"
                      border="1px solid #e2e8f0"
                      borderRadius="8px"
                      fontSize="xs"
                      color="#334155"
                      textAlign="left"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      _hover={{ bg: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' }}
                      transition="all 0.15s ease"
                      cursor="pointer"
                    >
                      <Text>{prompt}</Text>
                      <ArrowRight size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* MESSAGES THREAD */}
            {messages.map(msg => (
              <Box
                key={msg.id}
                alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                maxW={{ base: "88%", md: "85%" }}
              >
                <Flex
                  align="start"
                  gap={2}
                  flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
                >
                  {/* Avatar */}
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={msg.role === 'user' ? '#2563eb' : '#059669'}
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={0.5}
                  >
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </Box>

                  {/* Message Bubble */}
                  <Box>
                    <Box
                      p={3}
                      borderRadius="12px"
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

                    {/* Structured Cards (if any) */}
                    {msg.structuredData && (
                      <StructuredResponseView
                        data={msg.structuredData}
                        onActionClick={(path) => {
                          setIsOpen(false);
                          navigate(path);
                        }}
                      />
                    )}

                    {/* Suggested Follow-Ups */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <Flex wrap="wrap" gap={1.5} mt={2}>
                        {msg.suggestedFollowUps.slice(0, 3).map((followUp, idx) => (
                          <Box
                            key={idx}
                            as="button"
                            onClick={() => handleSend(followUp)}
                            px={2.5}
                            py={1}
                            bg="#f1f5f9"
                            border="1px solid #cbd5e1"
                            borderRadius="full"
                            fontSize="10px"
                            color="#334155"
                            _hover={{ bg: '#e2e8f0', color: '#0f172a' }}
                            cursor="pointer"
                            transition="background 0.15s ease"
                          >
                            {followUp}
                          </Box>
                        ))}
                      </Flex>
                    )}

                    <Text
                      fontSize="9px"
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

            {/* LOADING TYPING INDICATOR */}
            {loading && (
              <Flex align="center" gap={2} alignSelf="flex-start">
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  bg="#2563eb"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Bot size={13} />
                </Box>
                <Box
                  px={3}
                  py={2.5}
                  bg="white"
                  border="1px solid #e2e8f0"
                  borderRadius="12px"
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                >
                  <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite" />
                  <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite 0.2s" />
                  <Box w="6px" h="6px" borderRadius="full" bg="#2563eb" animation="pulse 1s infinite 0.4s" />
                  <Text fontSize="10px" color="#64748b" ml={1}>
                    Analyzing ERP data...
                  </Text>
                </Box>
              </Flex>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions Scroll Bar */}
          <Box px={3} py={2} bg="#ffffff" borderTop="1px solid #e2e8f0">
            <Flex gap={1.5} overflowX="auto" pb={1} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
              {QUICK_ACTIONS.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Box
                    key={idx}
                    as="button"
                    onClick={() => handleSend(action.query)}
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    px={2.5}
                    py={1}
                    bg="#f8fafc"
                    border="1px solid #e2e8f0"
                    borderRadius="6px"
                    fontSize="11px"
                    color="#475569"
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    flexShrink={0}
                    _hover={{ bg: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}
                    cursor="pointer"
                    transition="all 0.15s ease"
                  >
                    <Icon size={12} />
                    {action.label}
                  </Box>
                );
              })}
            </Flex>
          </Box>

          {/* Chat Input Bar */}
          <Box p={3} bg="#ffffff" borderTop="1px solid #f1f5f9">
            <Flex gap={2} align="flex-end">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e: any) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, stock, requisitions, payroll..."
                rows={1}
                flex="1"
                p={2.5}
                fontSize="xs"
                bg="#f8fafc"
                border="1px solid #cbd5e1"
                borderRadius="8px"
                outline="none"
                resize="none"
                disabled={loading}
                _focus={{
                  borderColor: '#2563eb',
                  bg: '#ffffff',
                  boxShadow: '0 0 0 1px #2563eb'
                }}
                maxH="100px"
              />
              <Button
                size="sm"
                bg="#2563eb"
                color="white"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                _hover={{ bg: '#1d4ed8' }}
                borderRadius="8px"
                px={3}
                flexShrink={0}
              >
                <Send size={15} />
              </Button>
            </Flex>
            <Flex justify="space-between" align="center" mt={1.5} px={1}>
              <Text fontSize="10px" color="#94a3b8">
                Press Enter to send, Shift+Enter for newline
              </Text>
              <Text fontSize="10px" color="#94a3b8">
                Strict RBAC Enforced
              </Text>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};
