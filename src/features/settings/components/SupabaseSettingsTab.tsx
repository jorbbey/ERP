import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Card,
  Input,
  Stack
} from '@chakra-ui/react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Server,
  Key,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../../../services/supabaseClient';
import { supabaseService } from '../../../services/supabaseService';
import { SUPABASE_SQL_SCHEMA } from '../../../services/supabaseSchema';

export const SupabaseSettingsTab: React.FC = () => {
  const [config, setConfig] = useState(() => getSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);

  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success?: boolean; message?: string; counts?: Record<string, number> } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    saveSupabaseConfig(urlInput, keyInput);
    const updated = getSupabaseConfig();
    setConfig(updated);
    setIsSaving(false);
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(urlInput, keyInput);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supabase-schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await supabaseService.seedFromLocal();
    setSeedResult(res);
    setIsSeeding(false);
  };

  return (
    <Stack gap={6}>
      {/* 1. Header & Live Connection Status */}
      <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5} boxShadow="xs">
        <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
          <Box>
            <Flex align="center" gap={2.5}>
              <Box p={2} bg="#ecfdf5" color="#059669" borderRadius="10px">
                <Database size={22} />
              </Box>
              <Box>
                <Heading size="md" color="#0f172a">
                  Supabase PostgreSQL Cloud Integration
                </Heading>
                <Text fontSize="xs" color="#64748b">
                  Connect your Construction ERP to a hosted PostgreSQL database with real-time replication and secure RLS.
                </Text>
              </Box>
            </Flex>
          </Box>

          <Flex align="center" gap={2}>
            {config.isConfigured ? (
              <Badge colorPalette="green" size="md" px={3} py={1} borderRadius="full">
                <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Supabase Configured
              </Badge>
            ) : (
              <Badge colorPalette="yellow" size="md" px={3} py={1} borderRadius="full">
                <AlertTriangle size={14} style={{ marginRight: '4px' }} /> Setup Required
              </Badge>
            )}

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500,
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                color: '#334155',
                textDecoration: 'none',
                background: '#ffffff'
              }}
            >
              Open Supabase Console <ExternalLink size={12} />
            </a>
          </Flex>
        </Flex>
      </Card.Root>

      {/* 2. Credentials Configuration Form */}
      <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5} boxShadow="xs">
        <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
          <Key size={18} color="#2563eb" /> Project Connection Credentials
        </Heading>
        <Text fontSize="xs" color="#64748b" mb={4}>
          Found in your Supabase Dashboard under <b>Project Settings → API</b>. These connect the application to your database instance.
        </Text>

        <form onSubmit={handleSave}>
          <Stack gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                  Project URL *
                </Text>
                <Input
                  size="sm"
                  placeholder="https://xyzcompany.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />
                <Text fontSize="10px" color="#94a3b8" mt={1}>
                  Base URL of your Supabase project (begins with https:// and ends in .supabase.co)
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                  Anon / Public API Key *
                </Text>
                <Input
                  size="sm"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  required
                />
                <Text fontSize="10px" color="#94a3b8" mt={1}>
                  Client-safe anonymous public key (found under Project Settings → API → Project API Keys)
                </Text>
              </Box>
            </SimpleGrid>

            {testResult && (
              <Box
                p={3}
                borderRadius="8px"
                bg={testResult.success ? '#f0fdf4' : '#fef2f2'}
                border={`1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`}
                color={testResult.success ? '#15803d' : '#b91c1c'}
                fontSize="xs"
              >
                <Flex align="center" gap={2}>
                  {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <Text fontWeight="medium">{testResult.message}</Text>
                </Flex>
              </Box>
            )}

            <Flex justify="space-between" align="center" pt={2} borderTop="1px solid #f1f5f9" wrap="wrap" gap={2}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                borderColor="#cbd5e1"
                color="#0f172a"
                onClick={handleTest}
                disabled={!urlInput || !keyInput || isTesting}
              >
                {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Server size={14} />}
                Test Database Connection
              </Button>

              <Button
                type="submit"
                size="sm"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                disabled={isSaving}
              >
                Save Supabase Credentials
              </Button>
            </Flex>
          </Stack>
        </form>
      </Card.Root>

      {/* 3. SQL Console Schema Setup */}
      <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5} boxShadow="xs">
        <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3} mb={3}>
          <Box>
            <Heading size="sm" color="#0f172a" display="flex" alignItems="center" gap={2}>
              <Layers size={18} color="#2563eb" /> Supabase Database Schema (SQL Console)
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Complete DDL script creating all relational tables, indexes, Row Level Security policies, and Nigerian master seed data.
            </Text>
          </Box>

          <Flex gap={2}>
            <Button
              size="xs"
              variant="outline"
              borderColor="#cbd5e1"
              color="#334155"
              onClick={handleDownloadSchema}
              title="Download schema as .sql file"
            >
              <Download size={14} /> Download .sql
            </Button>
            <Button
              size="xs"
              bg={copied ? '#16a34a' : '#0f172a'}
              color="white"
              onClick={handleCopySchema}
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
            </Button>
          </Flex>
        </Flex>

        {/* 3-Step Guide */}
        <Box p={3.5} mb={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" fontSize="xs">
          <Text fontWeight="bold" color="#0f172a" mb={2}>
            How to Apply this Schema in Supabase:
          </Text>
          <Stack gap={1.5} color="#475569">
            <Flex align="center" gap={2}>
              <Badge size="xs" colorPalette="blue" borderRadius="full">1</Badge>
              <Text>Open your project at <b>supabase.com/dashboard</b>.</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Badge size="xs" colorPalette="blue" borderRadius="full">2</Badge>
              <Text>In the left sidebar, click <b>SQL Editor</b> (terminal icon) → Click <b>New query</b>.</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Badge size="xs" colorPalette="blue" borderRadius="full">3</Badge>
              <Text>Click <b>Copy SQL Schema</b> above, paste into the query window, and click <b>Run</b> (Ctrl+Enter).</Text>
            </Flex>
          </Stack>
        </Box>

        {/* Scrollable SQL Code Preview */}
        <Box
          bg="#0f172a"
          color="#e2e8f0"
          p={4}
          borderRadius="10px"
          maxH="320px"
          overflowY="auto"
          fontFamily="mono"
          fontSize="11px"
          lineHeight="1.5"
          border="1px solid #334155"
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {SUPABASE_SQL_SCHEMA.slice(0, 3500)}
            {'\n\n-- ... [Remaining tables and seed data truncated in preview. Click Copy SQL Schema for full script] ...'}
          </pre>
        </Box>
      </Card.Root>

      {/* 4. Data Seeding & Synchronization */}
      <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5} boxShadow="xs">
        <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a" display="flex" alignItems="center" gap={2}>
              <RefreshCw size={18} color="#2563eb" /> Synchronize ERP State to Supabase
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              After running the schema script, click below to upload your active Nigerian holdings, construction projects, employees, and inventory to your Supabase tables.
            </Text>
          </Box>

          <Button
            size="sm"
            colorPalette="blue"
            onClick={handleSeedData}
            disabled={!config.isConfigured || isSeeding}
          >
            {isSeeding ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            {isSeeding ? 'Syncing to Supabase...' : 'Seed Local Data to Supabase'}
          </Button>
        </Flex>

        {seedResult && (
          <Box
            mt={4}
            p={3.5}
            borderRadius="8px"
            bg={seedResult.success ? '#f0fdf4' : '#fef2f2'}
            border={`1px solid ${seedResult.success ? '#bbf7d0' : '#fecaca'}`}
            color={seedResult.success ? '#15803d' : '#b91c1c'}
            fontSize="xs"
          >
            <Flex align="center" gap={2} mb={seedResult.counts ? 2 : 0}>
              {seedResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <Text fontWeight="bold">{seedResult.message}</Text>
            </Flex>

            {seedResult.counts && (
              <Flex gap={2} flexWrap="wrap" mt={1}>
                {Object.entries(seedResult.counts).map(([tbl, count]) => (
                  <Badge key={tbl} size="xs" colorPalette="green" variant="subtle">
                    {tbl}: {count} records
                  </Badge>
                ))}
              </Flex>
            )}
          </Box>
        )}
      </Card.Root>
    </Stack>
  );
};
