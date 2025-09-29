import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Heading,
  Text,
  chakra,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { FiGlobe, FiUsers, FiMapPin } from "react-icons/fi";
import AboutCard from "./AboutCard";
import { hackathon } from "../../assets";

interface AboutSectionProps {
  heroImageUrl?: string;
}

const Accent = chakra("span", {
  baseStyle: {
    bgGradient: "linear(to-r, red.300, red.300)",
    bgClip: "text",
  },
});

const AboutSection: React.FC<AboutSectionProps> = ({ heroImageUrl }) => {
  const bg = useColorModeValue("gray.50", "black");
  const cardBg = useColorModeValue("white", "gray.900");
  const textSubtle = useColorModeValue("gray.600", "gray.200");
  const borderCol = useColorModeValue("gray.200", "whiteAlpha.300");

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      id="about-section"
      as="section"
      position="relative"
      bg={bg}
      width="100%"
      py={{ base: "3rem", md: "5rem", lg: "7rem" }}
      overflow="hidden"
    >
      <Box
        aria-hidden
        position="absolute"
        inset={0}
        opacity={heroImageUrl ? 0.12 : 0.25}
        bgGradient={heroImageUrl ? undefined : "radial(gray.400 1px, transparent 1px)"}
        backgroundSize={heroImageUrl ? undefined : "16px 16px"}
        zIndex={0}
      >
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt=""
            objectFit="cover"
            w="full"
            h="full"
            filter="grayscale(10%)"
          />
        )}
      </Box>

      <Box aria-hidden position="absolute" inset={0} bgGradient="linear(to-b, transparent, rgba(0,0,0,0.12))" zIndex={0} />

      <Container maxW={{ base: "95%", lg: "1100px" }} position="relative" zIndex={1}>
        {/* Header */}
        <Stack spacing={5} mb={{ base: "2.5rem", md: "3.5rem", lg: "4.5rem" }} textAlign={{ base: "left", md: "center" }}>
          <Heading as="h2" fontSize={{ base: "1.7rem", md: "2.7rem", lg: "3.2rem" }} lineHeight={1.15} color="#fff">
            Meet <Accent>Our Hackathon Team</Accent>
          </Heading>
          <Text
            fontSize={{ base: "1.2rem", md: "1.4rem", lg: "1.6rem" }}
            color={textSubtle}
            maxWidth={{ base: "initial", md: "initial", lg: "900px" }}
            mx={{ base: "initial", md: "initial", lg: "auto" }}
          >
            We’re a small, focused crew of builders competing at the{" "}
            <strong>Google Cloud × AI Tinkerers Toronto Hackathon (Sept&nbsp;30, 2025)</strong>.
            Our goal is simple: ship a working <strong>Agentic AI</strong> demo by end of day,
            something useful, clear, and technically sound. This page introduces our team, our
            approach, and the project direction (final topic to be confirmed at kickoff).
          </Text>
        </Stack>

        {/* Overview panel */}
        <Box
          bg={cardBg}
          rounded="3xl"
          borderWidth="1px"
          borderColor={borderCol}
          boxShadow={useColorModeValue("lg", "dark-lg")}
          p={{ base: "1.5rem", md: "2.5rem", lg: "3.5rem" }}
          mb={{ base: "2.5rem", md: "3.5rem", lg: "4.5rem" }}
        >
          <SimpleGrid columns={{ base: 1, md: 12 }} spacing={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }} alignItems="center">
            <Box gridColumn={{ md: "1 / span 7" }}>
              <Heading as="h3" fontSize={{ base: "1.6rem", md: "2rem", lg: "2.2rem" }} mb={3} color={"red.300"}>
                Our mission for the day
              </Heading>
              <Text fontSize={{ base: "1.05rem", md: "1.15rem", lg: "1.4rem" }} color={textSubtle} lineHeight={1.9} textAlign="justify">
                <strong>Build a practical agent</strong> that turns a real workflow from{" "}
                <em>prompt</em> into a dependable <em>partner</em>. We’ll scope tight, ship fast,
                and iterate in short loops, prioritizing a crisp user flow, clear architecture, and
                a confident demo. Final idea will be selected at kickoff, candidates include:
                <br />
                <br />
                • <strong>Ops assistant</strong> (data intake → planning → tool calls → summary) <br />
                • <strong>Support copilot</strong> (triage → retrieve context → draft actions) <br />
                • <strong>Data wrangler</strong> (parse files/URLs → normalize → QA insights)
              </Text>

              <Stack mt={4} spacing={1} fontSize={{ base: "1.2rem", md: "1.5rem", lg:"1.5rem" }} color={textSubtle}>
                <Text>
                  <strong>Team name:</strong> <Accent>Googooli</Accent>
                </Text>
                <Text>
                  <strong>Focus areas:</strong> <Accent>agents, RAG, workflow automation</Accent>
                </Text>
                <Text>
                  <strong>Demo goal:</strong> <Accent>...</Accent>
                </Text>
              </Stack>
            </Box>

            <Box gridColumn={{ md: "8 / span 5" }}>
              <Box rounded="2xl" overflow="hidden" borderWidth="1px" borderColor={borderCol}>
                <Image
                  src={hackathon}
                  alt="Our team collaborating during build time"
                  objectFit="cover"
                  w="full"
                  h={{ base: "13rem", md: "16rem", lg: "20rem" }}
                />
              </Box>
            </Box>
          </SimpleGrid>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={{ base: "1.25rem", md: "1.5rem", lg: "2rem" }}>
          <AboutCard
            icon={FiUsers}
            title="Who we are"
            blurb="Engineers and tinkerers who like tight scopes and working demos. We split roles across app, agent logic, and data, pairing where it helps and unblocking each other fast."
            ctaLabel="Meet the team"
            onCtaClick={() => go("team-section")}
          />
          <AboutCard
            icon={FiGlobe}
            title="How we build"
            blurb="Lightweight front end, focused API, pragmatic agent stack. We favor small components, repeatable prompts, metrics for evaluation, and a clear fallback path for the demo."
            ctaLabel="Project Repo"
            onCtaClick={() => go("updates-section")}
          />
          <AboutCard
            icon={FiMapPin}
            title="Game plan"
            blurb="Kickoff → idea lock → stub flows → wire tools → test edge cases → record demo. We keep a visible checklist and ship vertical slices so progress is obvious."
            ctaLabel="Our checklist"
            onCtaClick={() => go("checklist-section")}
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default AboutSection;
