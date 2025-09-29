import React from "react";
import {
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { hero1, hero2 } from "../../assets";
import Typed from "react-typed";

const HeroSection: React.FC = () => {
  return (
    <Box
      id="hero-section"
      as="section"
      position="relative"
      width="100%"
      minH={{ base: "50vh", md:"78vh", lg: "97vh" }}
      // bg={{ base: "#000", md: "linear-gradient(135deg, #000, #666)" }}
      bg='#EDE0B0'
      color="#fff"
      overflow="hidden"
      zIndex={1}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backgroundImage={hero2}
        backgroundSize={{ base: "contain", md: "cover", lg:"contain" }}
        backgroundPosition={{ base: "center", md: "center" }}
        backgroundRepeat="no-repeat"
      // filter={{ base: "blur(5px)", md: "blur(3px)" }}
      // opacity={{ base: 0.85, lg: 0.6 }}
      />

      <Box
        position="absolute"
        top={{ base: "50%", lg: "45%" }}
        left={{ base: "50%", lg: "50%" }}
        transform="translate(-50%, -50%)"
        w="100%"
        h={{ base: "20rem", lg: "30rem" }}
        bg="linear-gradient(to left, #000, #000)"
        filter={{ base: "blur(50px)", md: "blur(50px)" }}
        opacity={0.4}
        zIndex={2}
      />

      <Flex
        position="absolute"
        top={{ base: "50%", lg: "45%" }}
        left={{ base: "50%", lg: "50%" }}
        transform="translate(-50%, -50%)"
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        maxW="1400px"
        width="100%"
        mx="auto"
        paddingX="4rem"
        zIndex={2}

      >
        <Box>
          <Text
            fontSize={{ base: "4.5rem", md: "4.8rem", lg: "4.8rem", xl: "9rem" }}
            mb={8}
            align={"center"}
            fontFamily={"'Inter', sans-serif"}
            fontWeight="1000"
            letterSpacing={-2}
            color={"#fff"}
          >
            Googooli :)
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default HeroSection;
