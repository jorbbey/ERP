import React, { useState } from 'react';
import { Box, Flex, Text, Button, Badge, Card } from '@chakra-ui/react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export interface Step {
  step?: string | number;
  stepNumber?: number | string;
  label?: string;
  title?: string;
  description: string;
}

export interface PageActionGuideProps {
  pageKey?: string;
  storageKey?: string;
  title: string;
  description?: string;
  goalDescription?: string;
  steps?: Step[];
  tips?: string[];
  tip?: string;
  onOpenGlossary?: () => void;
}

export const PageActionGuide: React.FC<PageActionGuideProps> = ({
  pageKey,
  storageKey,
  title,
  description,
  goalDescription,
  steps = [],
  tips = [],
  tip,
  onOpenGlossary
}) => {
  const effectiveKey = pageKey || storageKey || title.toLowerCase().replace(/\s+/g, '_');
  const effectiveStorageKey = `erp_guide_collapsed_${effectiveKey}`;
  const effectiveDescription = goalDescription || description || '';
  const effectiveTips = tip ? [tip, ...(tips || [])] : (tips || []);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(effectiveStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(effectiveStorageKey, String(next));
    } catch {
      // Ignore localStorage errors
    }
  };

  return (
    <Card.Root
      bg="#ffffff"
      border="1px solid #e2e8f0"
      borderLeft="4px solid #2563eb"
      borderRadius="12px"
      p={3.5}
      boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.04)"
      mb={2}
    >
      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={2}>
        <Flex align="center" gap={2.5}>
          <Box p={1.5} bg="#eff6ff" color="#2563eb" borderRadius="8px" flexShrink={0}>
            <HelpCircle size={18} />
          </Box>
          <Box>
            <Flex align="center" gap={2} flexWrap="wrap">
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                Guide: {title}
              </Text>
              <Badge size="xs" colorPalette="blue" variant="subtle">
                Workflow Guide
              </Badge>
            </Flex>
            {effectiveDescription && (
              <Text fontSize="11px" color="#64748b" mt="1px">
                {effectiveDescription}
              </Text>
            )}
          </Box>
        </Flex>

        <Flex align="center" gap={2} alignSelf={{ base: 'flex-end', sm: 'center' }}>
          <Button
            size="xs"
            variant="ghost"
            color="#64748b"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand guide" : "Minimize guide"}
          >
            {collapsed ? (
              <Flex align="center" gap={1}>
                <Text fontSize="11px">Show Steps</Text> <ChevronDown size={14} />
              </Flex>
            ) : (
              <Flex align="center" gap={1}>
                <Text fontSize="11px">Hide</Text> <ChevronUp size={14} />
              </Flex>
            )}
          </Button>
        </Flex>
      </Flex>

      {!collapsed && (steps.length > 0 || effectiveTips.length > 0) && (
        <Box mt={3} pt={3} borderTop="1px dashed #e2e8f0">
          {steps.length > 0 && (
            <Flex direction={{ base: 'column', md: 'row' }} gap={2.5} mb={effectiveTips.length > 0 ? 2.5 : 0}>
              {steps.map((s, idx) => (
                <Box
                  key={idx}
                  flex="1"
                  bg="#f8fafc"
                  p={2.5}
                  borderRadius="8px"
                  border="1px solid #f1f5f9"
                >
                  <Flex align="center" gap={1.5} mb={1}>
                    <Badge size="xs" colorPalette="blue" variant="solid" px={1.5}>
                      {s.stepNumber ?? s.step ?? idx + 1}
                    </Badge>
                    <Text fontSize="11px" fontWeight="bold" color="#1e293b">
                      {s.title ?? s.label ?? `Step ${idx + 1}`}
                    </Text>
                  </Flex>
                  <Text fontSize="11px" color="#64748b" lineHeight="short">
                    {s.description}
                  </Text>
                </Box>
              ))}
            </Flex>
          )}

          {effectiveTips.length > 0 && (
            <Flex align="center" gap={2} fontSize="11px" color="#475569" bg="#fffbeb" p={2} borderRadius="6px" border="1px solid #fef3c7">
              <Text fontWeight="bold" color="#b45309" flexShrink={0}>💡 Helpful Tip:</Text>
              <Text>{effectiveTips.join(' • ')}</Text>
            </Flex>
          )}
        </Box>
      )}
    </Card.Root>
  );
};
