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
  Flex
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

// Logo component with improved alignment
const Logo = () => (
  <Flex align="center" justify="center">
    <TabIcon boxSize={6} color="white" mr={2} />
    <Heading size="md" letterSpacing="-0.02em">
      FlowForge
    </Heading>
  </Flex>
);

function Popup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  
  // Animation styles
  const glowStyle = `${glowAnimation} 2s infinite`;
  const pulseStyle = `${pulseAnimation} 2s infinite`;

  useEffect(() => {
    // Log the viewport dimensions for debugging
    console.log("Viewport dimensions:", {
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Any initialization logic
    const initializeState = async () => {
      try {
        console.log("Popup initialized");
      } catch (error) {
        console.error("Error initializing popup:", error);
      }
    };

    initializeState();
  }, []);

  const organizeTabs = async () => {
    setIsLoading(true);
    try {
      // Listen for organization events
      const messageListener = (message: OrganizationMessage) => {
        if (message.type === "ORGANIZATION_COMPLETED") {
          toast({
            title: "Tabs Organized!",
            description: `Your tabs have been organized into ${message.numGroups} groups.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setIsLoading(false);
          chrome.runtime.onMessage.removeListener(messageListener as (message: any) => void);
        } else if (message.type === "ORGANIZATION_ERROR") {
          toast({
            title: "Error",
            description: message.error || "Failed to organize tabs",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setIsLoading(false);
          chrome.runtime.onMessage.removeListener(messageListener as (message: any) => void);
        }
      };
      
      chrome.runtime.onMessage.addListener(messageListener as (message: any) => void);
      
      // Send message to background script to organize tabs
      await chrome.runtime.sendMessage({ 
        action: "organizeTabs"
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
      setIsLoading(false);
    }
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
          overflow="hidden"
          h="calc(100% - 70px)"
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
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(<Popup />);
  } else {
    console.error("Root element not found");
  }
});

export default Popup;
