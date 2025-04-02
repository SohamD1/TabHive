import { Box, Text, Button, HStack, Tooltip, Badge } from '@chakra-ui/react'
import { format } from 'date-fns'
import type { Workspace } from '../store/workspaceStore'

interface WorkspaceItemProps {
  workspace: Workspace
  isActive: boolean
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  isActive,
  onRestore,
  onDelete
}) => {
  // Format date for display
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      // If date is string (from storage), convert to Date
      date = new Date(date)
    }
    return format(date, 'MMM d, yyyy h:mm a')
  }

  return (
    <Box
      p={3}
      borderWidth={1}
      borderRadius="md"
      bg={isActive ? 'blue.50' : 'white'}
      _hover={{ bg: isActive ? 'blue.100' : 'gray.50' }}
      transition="background-color 0.2s"
    >
      <HStack justifyContent="space-between" mb={1}>
        <Text fontWeight="bold" fontSize="md">
          {workspace.name}
        </Text>
        {workspace.deadline && (
          <Tooltip label={`Due: ${formatDate(workspace.deadline)}`}>
            <Badge colorScheme="red">Due Soon</Badge>
          </Tooltip>
        )}
      </HStack>

      <Text fontSize="sm" color="gray.600" mb={2}>
        {workspace.tabs.length} tab{workspace.tabs.length !== 1 ? 's' : ''}
      </Text>

      {workspace.tags.length > 0 && (
        <HStack spacing={1} mb={2} flexWrap="wrap">
          {workspace.tags.map((tag) => (
            <Badge key={tag} colorScheme="blue" mb={1}>
              {tag}
            </Badge>
          ))}
        </HStack>
      )}

      <Text fontSize="xs" color="gray.500" mb={2}>
        Updated: {formatDate(workspace.updatedAt)}
      </Text>

      <HStack spacing={2}>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => onRestore(workspace.id)}
        >
          Restore
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={() => onDelete(workspace.id)}
        >
          Delete
        </Button>
      </HStack>
    </Box>
  )
} 