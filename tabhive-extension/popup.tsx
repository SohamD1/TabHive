import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Spinner,
  Heading,
  Icon,
  Center,
  Tooltip,
  useColorModeValue,
  HStack,
  Image,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Switch,
  IconButton,
  Collapse
} from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import type { IconProps } from "@chakra-ui/react"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

// Define message types for better type safety
interface OrganizationCompletedMessage {
  type: "ORGANIZATION_COMPLETED";
  numGroups: number;
}

interface OrganizationErrorMessage {
  type: "ORGANIZATION_ERROR";
  error: string;
}

interface OrganizationStartedMessage {
  type: "ORGANIZATION_STARTED";
}

type OrganizationMessage = 
  | OrganizationCompletedMessage 
  | OrganizationErrorMessage
  | OrganizationStartedMessage;

// Pulse animation for the button
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33, 33, 33, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(33, 33, 33, 0); }
  100% { box-shadow: 0 0 0 0 rgba(33, 33, 33, 0); }
`;

// Button underglow animation
const glowAnimation = keyframes`
  0% { box-shadow: 0 4px 10px -2px rgba(33, 33, 33, 0.4); }
  50% { box-shadow: 0 6px 15px -2px rgba(33, 33, 33, 0.6); }
  100% { box-shadow: 0 4px 10px -2px rgba(33, 33, 33, 0.4); }
`;

// Custom theme with refined grayscale colors
const theme = extendTheme({
  colors: {
    brand: {
      50: "#f8f9fa",
      100: "#e9ecef",
      200: "#dee2e6",
      300: "#ced4da",
      400: "#adb5bd",
      500: "#495057", // Primary color - refined dark gray
      600: "#343a40",
      700: "#212529",
      800: "#1a1a1a",
      900: "#0a0a0a",
    },
    accent: {
      500: "#6c757d", // Accent color - medium gray
    }
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "white",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        fontFeatureSettings: "'ss01', 'ss02', 'cv01', 'cv03'",
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        fontWeight: "600",
        borderRadius: "md",
        letterSpacing: "0.01em",
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
        letterSpacing: "-0.01em",
      }
    },
    Text: {
      baseStyle: {
        lineHeight: "tall",
      }
    }
  },
});

// Tab icon component with refined design
const TabIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21,3H3C1.9,3 1,3.9 1,5V19C1,20.1 1.9,21 3,21H21C22.1,21 23,20.1 23,19V5C23,3.9 22.1,3 21,3M21,19H3V5H13V9H21V19Z"
    />
  </Icon>
);

// Add icon component
const AddIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
    />
  </Icon>
);

// Remove icon component
const RemoveIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,13H5V11H19V13Z"
    />
  </Icon>
);

// Logo component with improved alignment
const Logo = () => (
  <Flex align="center" justify="center">
    <TabIcon boxSize={6} color="white" mr={2} />
    <Heading size="md" letterSpacing="-0.02em">
      TabHive
    </Heading>
  </Flex>
);

// Max number of custom groups
const MAX_CUSTOM_GROUPS = 5;

function Popup() {
  console.log("Popup component function called");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [useCustomGroups, setUseCustomGroups] = useState(true); // Default to true for better UX
  const [customGroups, setCustomGroups] = useState<string[]>(['Work', 'Personal', 'Research']);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  
  // Animation styles
  const glowStyle = `${glowAnimation} 2s infinite`;
  const pulseStyle = `${pulseAnimation} 2s infinite`;

  useEffect(() => {
    console.log("Popup component mounted");
    // Log the viewport dimensions for debugging
    console.log("Viewport dimensions:", {
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Load saved custom groups from storage
    const loadSavedGroups = async () => {
      try {
        const result = await chrome.storage.local.get(['useCustomGroups', 'customGroups']);
        if (result.useCustomGroups !== undefined) {
          setUseCustomGroups(result.useCustomGroups);
        }
        if (result.customGroups && Array.isArray(result.customGroups) && result.customGroups.length > 0) {
          setCustomGroups(result.customGroups);
        }
        console.log("Loaded saved groups:", result);
      } catch (error) {
        console.error("Error loading saved groups:", error);
      }
    };

    loadSavedGroups();
  }, []);

  // Save custom groups to storage when they change
  useEffect(() => {
    const saveGroups = async () => {
      try {
        await chrome.storage.local.set({
          useCustomGroups: useCustomGroups,
          customGroups: customGroups
        });
        console.log("Saved groups:", { useCustomGroups, customGroups });
      } catch (error) {
        console.error("Error saving groups:", error);
      }
    };

    saveGroups();
  }, [useCustomGroups, customGroups]);

  const organizeTabs = async () => {
    // Validate if we have at least one group name when using custom groups
    if (useCustomGroups) {
      const validGroups = customGroups.filter(group => group.trim() !== '');
      
      if (validGroups.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one group name",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      
      if (validGroups.length < customGroups.length) {
        setCustomGroups(validGroups);
      }
    }

    setIsLoading(true);
    
    try {
      // Run organization 3 times
      for (let i = 0; i < 3; i++) {
        // Send message to background script to organize tabs
        await chrome.runtime.sendMessage({ 
          action: "organizeTabs",
          useCustomGroups: useCustomGroups,
          customGroups: useCustomGroups ? customGroups.filter(group => group.trim() !== '') : []
        });
        
        // Wait a short moment between attempts
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: "Tabs Organized!",
        description: "Your tabs have been organized.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error: unknown) {
      console.error("Error organizing tabs:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to organize tabs. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new custom group
  const addCustomGroup = () => {
    if (customGroups.length < MAX_CUSTOM_GROUPS) {
      setCustomGroups([...customGroups, '']);
    }
  };

  // Remove a custom group
  const removeCustomGroup = (index: number) => {
    const newGroups = [...customGroups];
    newGroups.splice(index, 1);
    setCustomGroups(newGroups);
  };

  // Update a custom group name
  const updateCustomGroup = (index: number, value: string) => {
    const newGroups = [...customGroups];
    newGroups[index] = value;
    setCustomGroups(newGroups);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box 
        p={0} 
        w="100%" 
        h="100%" 
        background="white"
        backgroundImage="linear-gradient(to bottom, rgba(248, 249, 250, 0.5), rgba(233, 236, 239, 0.3))"
        overflow="hidden"
        borderRadius="8px"
        boxShadow="lg"
      >
        <Box 
          as="header" 
          p={4} 
          borderBottom="1px" 
          borderColor={borderColor}
          bgColor="brand.700"
          color="white"
          backgroundImage="linear-gradient(to right, #1a1a1a, #292929)"
        >
          <Logo />
          <Center mt={1}>
            <Text fontSize="xs" fontWeight="medium" opacity={0.9} letterSpacing="0.02em">
              Smart tab organization
            </Text>
          </Center>
        </Box>
        
        <Box 
          py={5} 
          px={4}
          overflow="auto"
          maxH="calc(100vh - 120px)"
          h="calc(100% - 81px)"
        >
          <VStack spacing={6} align="stretch">
            <Box
              bg={bgColor} 
              p={4} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                boxShadow: "md",
                borderColor: "gray.300"
              }}
            >
              <VStack align="start" spacing={4}>
                <Heading size="sm" color="brand.700">
                  Custom Group Names
                </Heading>

                <FormControl display="flex" alignItems="center" mb={2}>
                  <FormLabel htmlFor="custom-groups-toggle" mb="0" fontSize="sm" fontWeight="medium">
                    Use custom group names
                  </FormLabel>
                  <Switch 
                    id="custom-groups-toggle" 
                    colorScheme="brand"
                    isChecked={useCustomGroups}
                    onChange={(e) => setUseCustomGroups(e.target.checked)}
                  />
                </FormControl>
                
                <Collapse in={useCustomGroups} animateOpacity style={{ width: '100%' }}>
                  <VStack spacing={3} align="stretch" mb={2} width="100%">
                    <Text fontSize="xs" color="gray.500">
                      Enter up to {MAX_CUSTOM_GROUPS} group names. Your tabs will be organized into these groups.
                    </Text>
                    
                    {customGroups.map((group, index) => (
                      <HStack key={index}>
                        <Input
                          value={group}
                          onChange={(e) => updateCustomGroup(index, e.target.value)}
                          placeholder="Group name"
                          size="sm"
                          maxLength={20}
                        />
                        <IconButton
                          icon={<RemoveIcon />}
                          aria-label="Remove group"
                          size="sm"
                          onClick={() => removeCustomGroup(index)}
                          colorScheme="red"
                          variant="ghost"
                        />
                      </HStack>
                    ))}
                    
                    {customGroups.length < MAX_CUSTOM_GROUPS && (
                      <Button 
                        leftIcon={<AddIcon />} 
                        size="sm" 
                        variant="outline" 
                        onClick={addCustomGroup}
                        colorScheme="brand"
                        width="fit-content"
                      >
                        Add Group
                      </Button>
                    )}
                  </VStack>
                </Collapse>
              </VStack>
            </Box>
            
            <Box
              bg={bgColor} 
              p={4} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                boxShadow: "md",
                borderColor: "gray.300"
              }}
            >
              <VStack align="start" spacing={3}>
                <Heading size="sm" color="brand.700">
                  Tab Organization Features
                </Heading>
                <VStack align="start" spacing={2} pl={1}>
                  <HStack align="center" spacing={3}>
                    <Center w="24px" h="24px" bg="brand.100" borderRadius="full">
                      <Icon as={TabIcon} boxSize="14px" color="brand.700" />
                    </Center>
                    <Text fontSize="sm" fontWeight="medium">Detect course codes (CS136, MATH118)</Text>
                  </HStack>
                  <HStack align="center" spacing={3}>
                    <Center w="24px" h="24px" bg="brand.100" borderRadius="full">
                      <Icon as={TabIcon} boxSize="14px" color="brand.700" />
                    </Center>
                    <Text fontSize="sm" fontWeight="medium">Group similar tabs by content</Text>
                  </HStack>
                  <HStack align="center" spacing={3}>
                    <Center w="24px" h="24px" bg="brand.100" borderRadius="full">
                      <Icon as={TabIcon} boxSize="14px" color="brand.700" />
                    </Center>
                    <Text fontSize="sm" fontWeight="medium">Collapse groups for a cleaner interface</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
            
            <Button
              size="lg"
              height="50px"
              colorScheme="brand"
              onClick={organizeTabs}
              isLoading={isLoading}
              loadingText="Organizing..."
              fontWeight="600"
              leftIcon={isLoading ? <Spinner size="sm" /> : <TabIcon />}
              animation={isHovering ? undefined : glowStyle}
              boxShadow={isHovering ? "0 6px 20px -2px rgba(33, 33, 33, 0.6)" : "0 4px 10px -2px rgba(33, 33, 33, 0.4)"}
              transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              transform={isHovering ? "translateY(-2px)" : "none"}
              _hover={{}}
              _active={{
                transform: "translateY(0)",
                boxShadow: "0 2px 6px -2px rgba(33, 33, 33, 0.5)",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              position="relative"
              zIndex={1}
              bgGradient="linear(to-r, brand.600, brand.700)"
              _after={{
                content: '""',
                position: "absolute",
                top: "auto",
                left: "5%",
                bottom: "-4px",
                width: "90%",
                height: "10px",
                background: "rgba(33, 37, 41, 0.15)",
                filter: "blur(10px)",
                borderRadius: "50%",
                zIndex: -1,
                transition: "all 0.3s ease"
              }}
            >
              Organize My Tabs
            </Button>
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

// Mount React to the DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded fired - attempting to mount React app");
  const root = document.getElementById('root');
  if (root) {
    console.log("Root element found, rendering React app");
    try {
      createRoot(root).render(<Popup />);
      console.log("React app mounted successfully");
    } catch (error) {
      console.error("Error rendering React app:", error);
    }
  } else {
    console.error("Root element not found");
  }
});

// Add an error boundary at the top level
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

export default Popup;
