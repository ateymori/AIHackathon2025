import React from "react";
import {
  Box,
  Text,
  useColorModeValue,
  Icon,
  HStack,
  VStack,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

export interface AboutCardProps {
  icon: IconType;
  title: string;
  blurb: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const MotionBox = motion(Box);

const AboutCard: React.FC<AboutCardProps> = ({ icon, title, blurb, ctaLabel, onCtaClick }) => {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "whiteAlpha.200");
  const shadow = useColorModeValue("lg", "dark-lg");
  const titleColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <MotionBox
      maxWidth={{ base: "initial", md: "70%", lg: "initial" }}
      mx={{ base: "initial", md: "auto", lg: "initial" }}
      role="group"
      tabIndex={0}
      whileHover={{ y: -6 }}
      whileFocus={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      bg={bg}
      borderWidth="1px"
      borderColor={border}
      rounded="2xl"
      boxShadow={shadow}
      p={{ base: 5, md: 6 }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        rounded: "2xl",
        padding: "1px",
        bg: useColorModeValue(
          "linear-gradient(135deg, rgba(203,0,0,0.35), rgba(0,0,0,0.06))",
          "linear-gradient(135deg, rgba(255,70,70,0.45), rgba(255,255,255,0.08))"
        ),
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        pointerEvents: "none",
      }}
      _focusVisible={{ boxShadow: "0 0 0 3px rgba(203,0,0,0.45)" }}
    >
      <HStack spacing={4} align="flex-start">
        <Box
          aria-hidden
          display="inline-flex"
          rounded="xl"
          borderWidth="1px"
          borderColor={border}
          p={3}
          boxShadow="sm"
        >
          <Icon as={icon} boxSize={6} color={useColorModeValue("red.600", "red.300")} />
        </Box>
        <VStack align="start" spacing={3}>
          <Text
            as="h3"
            fontSize={{ base: "1.6rem", lg: "1.6rem" }}
            color={"red.200"}
          >
            {title}
          </Text>
          <Text
            fontSize={{ base: "1.3rem", md: "1.35rem", lg: "1.6rem" }}
            color={textColor}
            lineHeight={1.7}
            textAlign={{ base: "justify", md: "initial" }}
          >
            {blurb}
          </Text>
          {ctaLabel && (
            <Button
              onClick={onCtaClick}
              variant="outline"
              size="md"
              rounded="lg"
              borderColor={useColorModeValue("red.600", "red.300")}
              color={useColorModeValue("red.700", "red.200")}
              _hover={{ bg: useColorModeValue("red.50", "whiteAlpha.100") }}
            >
              {ctaLabel}
            </Button>
          )}
        </VStack>
      </HStack>
    </MotionBox>
  );
};

export default AboutCard;