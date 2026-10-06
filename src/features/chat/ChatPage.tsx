import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Input,
  Stack,
  Card,
  SimpleGrid
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  MessageSquare,
  Send,
  Users,
  Search,
  Hash,
  Sparkles,
  Circle,
  Paperclip,
  Download,
  FileText,
  FileImage,
  FileCode,
  X,
  UserCheck,
  Building,
  HardHat,
  Smile,
  CheckCheck
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { chatMessages, sendMessage, currentUserName, activeRole, activeCompany, employees } = useERP();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'channels' | 'direct'>('channels');
  const [activeConversationId, setActiveConversationId] = useState('general-operations');
  const [activeDirectUser, setActiveDirectUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAttachment, setPendingAttachment] = useState<{
    name: string;
    type: string;
    size: string;
    data?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    {
      id: 'general-operations',
      name: 'general-operations',
      topic: 'Cross-functional site, yard & procurement coordination',
      unreadCount: 0
    },
    {
      id: 'site-engineers',
      name: 'site-engineers',
      topic: 'Concrete pours, daily site logs, weather conditions & QA',
      unreadCount: 1
    },
    {
      id: 'procurement-vendors',
      name: 'procurement-vendors',
      topic: 'Requisition reviews, supplier quotes, waybills & delivery tracking',
      unreadCount: 0
    },
    {
      id: 'executive-briefing',
      name: 'executive-briefing',
      topic: 'Contract variations, tender awards, finance IPC approvals & payroll',
      unreadCount: 2
    },
    {
      id: 'safety-compliance',
      name: 'safety-compliance',
      topic: 'Toolbox talks, HSE incidents, PPE compliance & safety audits',
      unreadCount: 0
    }
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeConversationId, activeDirectUser]);

  // Handle File Attachment Selection
  const handleAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      const reader = new FileReader();
      reader.onload = () => {
        setPendingAttachment({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: sizeStr,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingAttachment) return;

    const targetChannel = activeDirectUser ? `dm-${activeDirectUser.toLowerCase().replace(/\s+/g, '-')}` : activeConversationId;

    sendMessage(
      inputText.trim(),
      targetChannel,
      pendingAttachment || undefined
    );

    setInputText('');
    setPendingAttachment(null);
  };

  // Download Attached File
  const handleDownloadAttachment = (name: string, data?: string) => {
    const content = data || `Enterprise Collaboration Attachment: ${name}\nSent via Apex Construction ERP Workspace.\nDate: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter messages for active channel or direct message
  const currentChannelMessages = chatMessages.filter(msg => {
    if (activeDirectUser) {
      const dmChannel = `dm-${activeDirectUser.toLowerCase().replace(/\s+/g, '-')}`;
      return (
        msg.channelId === dmChannel ||
        (msg.sender === activeDirectUser && (msg.role || '').length > 0)
      );
    } else {
      // Channel messages or fallback if channelId matches id or name
      const targetChan = channels.find(c => c.id === activeConversationId);
      return (
        msg.channelId === activeConversationId ||
        (targetChan && msg.channelId === targetChan.name) ||
        (!msg.channelId && activeConversationId === 'general-operations')
      );
    }
  });

  const filteredMessages = currentChannelMessages.filter(m =>
    m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.attachmentName && m.attachmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeChannelObj = channels.find(c => c.id === activeConversationId) || channels[0];

  return (
    <Box h="calc(100vh - 120px)" p={6} display="flex" flexDirection="column">
      {/* Header Banner */}
      <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3} mb={4}>
        <Flex align="center" gap={3}>
          <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px" boxShadow="sm">
            <MessageSquare size={22} />
          </Box>
          <Box>
            <Heading size="md" color="#0f172a">
              Enterprise Field & HQ Collaboration
            </Heading>
            <Text fontSize="xs" color="#64748b">
              {activeCompany.name} ({activeCompany.code}) • Instant encrypted dialogue between site engineers, stores, QS, & management.
            </Text>
          </Box>
        </Flex>

        <Flex align="center" gap={3}>
          <Flex align="center" gap={2} bg="#f0fdf4" px={3} py={1.5} borderRadius="full" border="1px solid #bbf7d0">
            <Circle size={8} fill="#22c55e" color="#22c55e" />
            <Text fontSize="xs" fontWeight="bold" color="#166534">
              Realtime Workspace Connected
            </Text>
          </Flex>
          <Badge size="sm" colorPalette="blue" px={2.5} py={1}>
            {activeRole} • {currentUserName}
          </Badge>
        </Flex>
      </Flex>

      {/* Main Chat Interface */}
      <Flex flex="1" bg="white" border="1px solid #e2e8f0" borderRadius="16px" overflow="hidden" boxShadow="sm">
        {/* Left Sidebar: Channels & Colleague Roster */}
        <Box w={{ base: '80px', md: '280px' }} bg="#f8fafc" borderRight="1px solid #e2e8f0" display="flex" flexDirection="column">
          {/* Tabs Selector: Channels vs Direct Messages */}
          <Flex borderBottom="1px solid #e2e8f0" p={2} bg="white">
            <Button
              size="xs"
              flex="1"
              variant={activeTab === 'channels' ? 'solid' : 'ghost'}
              bg={activeTab === 'channels' ? '#2563eb' : 'transparent'}
              color={activeTab === 'channels' ? 'white' : '#64748b'}
              onClick={() => {
                setActiveTab('channels');
                setActiveDirectUser(null);
              }}
            >
              <Hash size={13} /> Channels
            </Button>
            <Button
              size="xs"
              flex="1"
              variant={activeTab === 'direct' ? 'solid' : 'ghost'}
              bg={activeTab === 'direct' ? '#2563eb' : 'transparent'}
              color={activeTab === 'direct' ? 'white' : '#64748b'}
              onClick={() => setActiveTab('direct')}
            >
              <Users size={13} /> Team ({employees.length})
            </Button>
          </Flex>

          {/* List of Channels or Team Members */}
          <Box flex="1" overflowY="auto" p={2.5}>
            {activeTab === 'channels' ? (
              <Stack gap={1}>
                <Text fontSize="10px" fontWeight="bold" color="#94a3b8" px={2} py={1} textTransform="uppercase" letterSpacing="wider" display={{ base: 'none', md: 'block' }}>
                  Project Streams
                </Text>
                {channels.map(channel => {
                  const isActive = !activeDirectUser && activeConversationId === channel.id;
                  return (
                    <Box
                      key={channel.id}
                      as="button"
                      onClick={() => {
                        setActiveConversationId(channel.id);
                        setActiveDirectUser(null);
                      }}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={2.5}
                      borderRadius="10px"
                      bg={isActive ? '#eff6ff' : 'transparent'}
                      color={isActive ? '#2563eb' : '#475569'}
                      fontWeight={isActive ? 'bold' : 'medium'}
                      _hover={{ bg: isActive ? '#eff6ff' : '#f1f5f9' }}
                      cursor="pointer"
                      textAlign="left"
                      w="100%"
                    >
                      <Flex align="center" gap={2} minW="0">
                        <Hash size={15} style={{ flexShrink: 0 }} />
                        <Text fontSize="xs" truncate display={{ base: 'none', md: 'block' }}>
                          {channel.name}
                        </Text>
                      </Flex>
                      {channel.unreadCount > 0 && (
                        <Badge size="xs" colorPalette="red" borderRadius="full">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Stack gap={1}>
                <Text fontSize="10px" fontWeight="bold" color="#94a3b8" px={2} py={1} textTransform="uppercase" letterSpacing="wider" display={{ base: 'none', md: 'block' }}>
                  Enterprise Personnel
                </Text>
                {employees.map(emp => {
                  const isActive = activeDirectUser === emp.name;
                  return (
                    <Box
                      key={emp.id}
                      as="button"
                      onClick={() => {
                        setActiveDirectUser(emp.name);
                      }}
                      display="flex"
                      alignItems="center"
                      gap={2.5}
                      p={2}
                      borderRadius="10px"
                      bg={isActive ? '#eff6ff' : 'transparent'}
                      color={isActive ? '#2563eb' : '#475569'}
                      fontWeight={isActive ? 'bold' : 'normal'}
                      _hover={{ bg: isActive ? '#eff6ff' : '#f1f5f9' }}
                      cursor="pointer"
                      textAlign="left"
                      w="100%"
                    >
                      <Box
                        w="28px"
                        h="28px"
                        borderRadius="full"
                        bg="#e2e8f0"
                        color="#334155"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="11px"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </Box>
                      <Box display={{ base: 'none', md: 'block' }} minW="0" flex="1">
                        <Text fontSize="xs" fontWeight="semibold" truncate>{emp.name}</Text>
                        <Text fontSize="10px" color="#94a3b8" truncate>{emp.role || emp.department}</Text>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Current Sender Pod */}
          <Box p={3} bg="white" borderTop="1px solid #e2e8f0" display={{ base: 'none', md: 'block' }}>
            <Text fontSize="10px" color="#94a3b8" textTransform="uppercase" fontWeight="bold">Active Sender</Text>
            <Flex align="center" gap={2} mt={1}>
              <Box w="8px" h="8px" borderRadius="full" bg="#22c55e" />
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" truncate>{currentUserName}</Text>
            </Flex>
            <Badge size="xs" colorPalette="blue" mt={1}>{activeRole}</Badge>
          </Box>
        </Box>

        {/* Right Messages Area */}
        <Flex flex="1" direction="column">
          {/* Conversation Top Header */}
          <Flex justify="space-between" align="center" px={5} py={3} borderBottom="1px solid #e2e8f0" bg="white">
            <Flex align="center" gap={2.5}>
              {activeDirectUser ? (
                <>
                  <Box w="32px" h="32px" borderRadius="full" bg="#dbeafe" color="#2563eb" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xs">
                    {activeDirectUser.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                      {activeDirectUser}
                    </Text>
                    <Text fontSize="11px" color="#64748b">
                      Direct Dialogue • {employees.find(e => e.name === activeDirectUser)?.department || 'Colleague'}
                    </Text>
                  </Box>
                </>
              ) : (
                <>
                  <Box p={1.5} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                    <Hash size={18} />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                      #{activeChannelObj.name}
                    </Text>
                    <Text fontSize="11px" color="#64748b" display={{ base: 'none', sm: 'block' }}>
                      {activeChannelObj.topic}
                    </Text>
                  </Box>
                </>
              )}
            </Flex>

            <Flex align="center" gap={2}>
              <Box maxW="200px">
                <Input
                  size="xs"
                  variant="subtle"
                  placeholder="Search stream..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="8px"
                />
              </Box>
            </Flex>
          </Flex>

          {/* Messages Stream */}
          <Box flex="1" overflowY="auto" p={5} bg="#f8fafc">
            <Stack gap={4}>
              {filteredMessages.length === 0 ? (
                <Box textAlign="center" py={12} color="#94a3b8">
                  <MessageSquare size={36} style={{ margin: '0 auto 8px auto', opacity: 0.3 }} />
                  <Text fontSize="sm" fontWeight="medium">No messages in this channel yet.</Text>
                  <Text fontSize="xs" mt={1}>Post an operational update, dispatch notice, or attach technical documents.</Text>
                </Box>
              ) : (
                filteredMessages.map((msg) => {
                  const isMe = msg.sender === currentUserName || msg.isSelf;
                  const initials = msg.sender.split(' ').map(n => n[0]).join('').substring(0, 2);

                  return (
                    <Flex
                      key={msg.id}
                      direction="column"
                      align={isMe ? 'flex-end' : 'flex-start'}
                    >
                      <Flex align="center" gap={2} mb={1}>
                        {!isMe && (
                          <Box
                            w="20px"
                            h="20px"
                            borderRadius="full"
                            bg="#cbd5e1"
                            color="#334155"
                            fontSize="9px"
                            fontWeight="bold"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {initials}
                          </Box>
                        )}
                        <Text fontSize="xs" fontWeight="bold" color="#1e293b">
                          {isMe ? 'You' : msg.sender}
                        </Text>
                        <Badge size="xs" colorPalette="gray" fontSize="9px">
                          {msg.role}
                        </Badge>
                        <Text fontSize="10px" color="#94a3b8">
                          {msg.timestamp}
                        </Text>
                      </Flex>

                      <Box
                        maxW={{ base: '85%', sm: '550px' }}
                        p={3.5}
                        borderRadius="14px"
                        fontSize="xs"
                        lineHeight="relaxed"
                        bg={isMe ? '#2563eb' : 'white'}
                        color={isMe ? 'white' : '#1e293b'}
                        border={isMe ? 'none' : '1px solid #e2e8f0'}
                        boxShadow="xs"
                      >
                        <Text whiteSpace="pre-wrap">{msg.message}</Text>

                        {/* File Attachment Card if Attached */}
                        {msg.attachmentName && (
                          <Box
                            mt={2.5}
                            p={2.5}
                            borderRadius="10px"
                            bg={isMe ? 'rgba(255, 255, 255, 0.15)' : '#f8fafc'}
                            border={isMe ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid #e2e8f0'}
                            color={isMe ? 'white' : '#0f172a'}
                          >
                            <Flex justify="space-between" align="center" gap={2}>
                              <Flex align="center" gap={2} minW="0">
                                {msg.attachmentName.endsWith('.pdf') ? (
                                  <FileText size={16} />
                                ) : msg.attachmentName.endsWith('.jpg') || msg.attachmentName.endsWith('.png') ? (
                                  <FileImage size={16} />
                                ) : (
                                  <FileCode size={16} />
                                )}
                                <Box minW="0">
                                  <Text fontSize="xs" fontWeight="bold" truncate>{msg.attachmentName}</Text>
                                  <Text fontSize="10px" opacity={0.8}>{msg.attachmentSize || 'Document file'}</Text>
                                </Box>
                              </Flex>
                              <Button
                                size="xs"
                                variant={isMe ? 'solid' : 'outline'}
                                bg={isMe ? 'white' : undefined}
                                color={isMe ? '#2563eb' : undefined}
                                onClick={() => handleDownloadAttachment(msg.attachmentName!, msg.attachmentData)}
                              >
                                <Download size={12} /> Download
                              </Button>
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Input Box and Attachment Bar */}
          <Box p={3.5} bg="white" borderTop="1px solid #e2e8f0">
            {/* Attachment preview chip if a file is staged */}
            {pendingAttachment && (
              <Flex align="center" gap={2} bg="#eff6ff" px={3} py={1.5} borderRadius="8px" mb={2} border="1px solid #bfdbfe">
                <Paperclip size={14} color="#2563eb" />
                <Text fontSize="xs" fontWeight="bold" color="#1e40af" flex="1" truncate>
                  Staged Attachment: {pendingAttachment.name} ({pendingAttachment.size})
                </Text>
                <Box as="button" onClick={() => setPendingAttachment(null)} color="#64748b" cursor="pointer">
                  <X size={14} />
                </Box>
              </Flex>
            )}

            <form onSubmit={handleSend}>
              <Flex gap={2} align="center">
                {/* Hidden File Input for Attachment */}
                <Box position="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorPalette="gray"
                    type="button"
                    px={2.5}
                    title="Attach technical drawing, PDF or photo"
                  >
                    <Paperclip size={17} />
                  </Button>
                  <Input
                    type="file"
                    position="absolute"
                    inset="0"
                    opacity="0"
                    cursor="pointer"
                    onChange={handleAttachmentFile}
                  />
                </Box>

                <Input
                  size="sm"
                  variant="subtle"
                  placeholder={
                    activeDirectUser
                      ? `Message ${activeDirectUser}...`
                      : `Message #${activeChannelObj.name} as ${currentUserName}...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  bg="#f8fafc"
                  borderRadius="10px"
                  flex="1"
                />

                <Button size="sm" bg="#2563eb" color="white" type="submit" px={4} disabled={!inputText.trim() && !pendingAttachment}>
                  <Send size={15} /> Send
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
