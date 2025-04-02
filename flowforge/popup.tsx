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
  Image
} from "@chakra-ui/react"
import type { IconProps } from "@chakra-ui/react"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

// Custom theme with grayscale colors
const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5f5f5",
      100: "#e0e0e0",
      200: "#bdbdbd",
      300: "#9e9e9e",
      400: "#757575",
      500: "#616161", // Primary color - dark gray
      600: "#424242",
      700: "#303030",
      800: "#212121",
      900: "#121212",
    },
    accent: {
      500: "#9e9e9e", // Accent color - medium gray
    }
  },
  styles: {
    global: {
      body: {
        bg: "white",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    }
  },
});

// Simulated tab icon for visual appeal
const TabIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21,3H3C1.9,3 1,3.9 1,5V19C1,20.1 1.9,21 3,21H21C22.1,21 23,20.1 23,19V5C23,3.9 22.1,3 21,3M21,19H3V5H13V9H21V19Z"
    />
  </Icon>
);

// Centered logo component
const Logo = () => (
  <Center mb={1}>
    <TabIcon boxSize={6} color="white" mr={2} />
    <Heading size="md">
      FlowForge
    </Heading>
  </Center>
);

function Popup() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
      const messageListener = (message: any) => {
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
          chrome.runtime.onMessage.removeListener(messageListener);
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
          chrome.runtime.onMessage.removeListener(messageListener);
        }
      };
      
      chrome.runtime.onMessage.addListener(messageListener);
      
      // Send message to background script to organize tabs
      await chrome.runtime.sendMessage({ 
        action: "organizeTabs"
      });
    } catch (error) {
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
        backgroundImage="linear-gradient(to bottom, rgba(33, 33, 33, 0.03), rgba(33, 33, 33, 0.01))"
        overflow="hidden"
      >
        <Box 
          as="header" 
          p={3} 
          borderBottom="1px" 
          borderColor={borderColor}
          bgColor="brand.800"
          color="white"
        >
          <Logo />
          <Center>
            <Text fontSize="xs" opacity={0.9}>
              Smart tab organization
            </Text>
          </Center>
        </Box>
        
        <Box 
          py={3} 
          px={3}
          overflow="hidden"
          h="calc(100% - 70px)"
        >
          <VStack spacing={3} align="stretch">
            <Box
              bg={bgColor} 
              p={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
            >
              <VStack align="start" spacing={1}>
                <Heading size="xs" mb={1} color="brand.700">
                  Tab Organization Features
                </Heading>
                <Text fontSize="xs">The extension will:</Text>
                <HStack align="start" pl={2} spacing={2}>
                  <Icon as={TabIcon} boxSize="12px" color="accent.500" mt={1} />
                  <Text fontSize="xs">Detect course codes (like CS136, MATH118)</Text>
                </HStack>
                <HStack align="start" pl={2} spacing={2}>
                  <Icon as={TabIcon} boxSize="12px" color="accent.500" mt={1} />
                  <Text fontSize="xs">Group similar tabs by content</Text>
                </HStack>
                <HStack align="start" pl={2} spacing={2}>
                  <Icon as={TabIcon} boxSize="12px" color="accent.500" mt={1} />
                  <Text fontSize="xs">Collapse groups for a cleaner interface</Text>
                </HStack>
              </VStack>
            </Box>
            
            <Button
              size="md"
              colorScheme="brand"
              onClick={organizeTabs}
              isLoading={isLoading}
              loadingText="Organizing..."
              leftIcon={isLoading ? <Spinner size="sm" /> : <TabIcon />}
              boxShadow="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              _active={{ transform: "translateY(0)", boxShadow: "md" }}
              transition="all 0.2s"
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
