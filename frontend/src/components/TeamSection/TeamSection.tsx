import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Flex,
    Image,
    Heading,
    Text,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    HStack,
    Link,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { speakers, SpeakerData } from './data';
import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';
import { BsLinkedin } from 'react-icons/bs';
import { SiTed } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';

const middleVariants: { [key: string]: any } = {
    initial: {
        y: 70,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    },
};

// Carousel layout constants
const CARD_WIDTH = 340;
const CARD_HEIGHT = 480;
const CARD_GAP = 24;

const TeamSection: React.FC = () => {
    const iconSize = useBreakpointValue({ base: "1.8rem", md: "2.1rem", lg: "2.3rem" });
    const iconBoxSize = useBreakpointValue({ base: "3.2rem", md: "3.8rem", lg: "4.2rem" });

    // Social links
    const socials = [
        {
            label: "Instagram",
            // href: "https://www.instagram.com/",
            icon: <FaInstagram size={iconSize} />,
            color: "#E1306C",
            aria: "instagram",
        },
        {
            label: "LinkedIn",
            // href: "https://www.linkedin.com/",
            icon: <BsLinkedin size={iconSize} />,
            color: "#0077b5",
            aria: "linkedin",
        },
        {
            label: "TED",
            // href: "https://t.me/",
            icon: <FaXTwitter size={iconSize} />,
            color: "#EB0028",
            aria: "ted",
        },
    ];


    const { t, i18n } = useTranslation();

    const ref = useRef<HTMLDivElement>(null);

    const total = speakers.length;
    const extended = [...speakers, ...speakers, ...speakers];
    const startIndex = total;

    const [index, setIndex] = useState(startIndex);
    const [animate, setAnimate] = useState(true);            {/* Speaker Bio Modal */}

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState<SpeakerData | null>(null);
    const flexRef = useRef<HTMLDivElement>(null);

    const shift = (delta: number) => {
        setAnimate(true);
        setIndex((idx) => idx + delta);
    };
    const handlePrev = () => shift(-1);
    const handleNext = () => shift(1);

    const openModal = (speaker: SpeakerData) => {
        setSelected(speaker);
        onOpen();
    };

    const onTransitionEnd = () => {
        if (index >= total * 2) {
            setAnimate(false);
            setIndex(startIndex);
        } else if (index < total) {
            setAnimate(false);
            setIndex(startIndex + (index % total));
        }
    };

    useEffect(() => {
        if (!animate) {
            requestAnimationFrame(() => setAnimate(true));
        }
    }, [animate]);

    return (
        <Box
            id='team-section'
            position="relative"
            bg={useColorModeValue("gray.50", "black")}
            py={{ base: 15, md: 40 }}
            paddingBottom={{ base: "initial", lg: "20rem" }}
            overflow="hidden"
        >
            <Box
                aria-hidden
                position="absolute"
                inset={0}
                opacity={0.25}
                bgGradient={"radial(gray.400 1px, transparent 1px)"}
                backgroundSize={"16px 16px"}
                zIndex={0}
                pointerEvents="none"
            >
            </Box>

            <Box
                aria-hidden
                position="absolute"
                inset={0}
                bgGradient="linear(to-b, transparent, rgba(0,0,0,0.12))"
                zIndex={0}
                pointerEvents="none"
            />

            <motion.div
                ref={ref}
                variants={middleVariants}
                initial="initial"
                whileInView="animate"
            >
                <Heading
                    as="h2"
                    mb={{ base: "3rem", lg: "6rem" }}
                    mt={{ base: "6rem", lg: "initial" }}
                    fontSize={{ base: "2.8rem", lg: "4rem" }}
                    color={useColorModeValue("gray.800", "#fff")}
                    fontWeight="bold"
                    textAlign="center"
                >
                    The Creative Minds
                </Heading>
            </motion.div>
            <Flex
                ref={flexRef}
                onTransitionEnd={onTransitionEnd}
                transition={animate ? 'transform 0.5s ease' : 'none'}
                transform={`translateX(-${index * (CARD_WIDTH + CARD_GAP)}px)`}
                gap={`${CARD_GAP}px`}
                px={6}
            >
                {extended.map((speaker, i) => (
                    <Box
                        key={`${speaker.id}-${i}`}
                        flex="0 0 auto"
                        w={`${CARD_WIDTH}px`}
                        h={`${CARD_HEIGHT}px`}
                        bg="gray.700"
                        borderRadius="10px"
                        p={7}
                        textAlign="left"
                        boxShadow={useColorModeValue("0 0 30px 1px gray", "0 0 30px 1px #000")}
                        transition="transform 0.6s cubic-bezier(.22,1,.36,1), box-shadow 0.35s"
                        _hover={{
                            transform: 'scale(1.05)',
                            boxShadow: '0 16px 48px 0 rgba(233,31,31,0.18)',
                        }}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        zIndex={100}
                    >
                        <Box
                        >
                            <Box
                                h="300px"
                                mb={6}
                                borderRadius="12px"
                                overflow="hidden"
                                boxShadow="0 2px 12px #e91f1f22"
                            >
                                <Image
                                    src={speaker.photo}
                                    alt={t(speaker.name)}
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                />
                            </Box>
                            <Heading
                                fontSize={{ base: "1.5rem", lg: "1.7rem" }}
                                mb={3}
                                color={useColorModeValue("#000", "#fff")}
                                textAlign={"left"}
                                paddingX="0.5rem"
                            >
                                {t(speaker.name)}
                            </Heading>
                            <Text
                                fontSize={{ base: "1.2rem", lg: "1.4rem" }}
                                mb={4}
                                color={useColorModeValue("#000", "#fff")}
                                textAlign={"left"}
                                paddingX="0.5rem"
                            >
                                {t(speaker.title)}
                            </Text>
                        </Box>
                        <Box>
                            <HStack spacing={4} justify="center" paddingTop="0.7rem">
                                {socials.map(social => (
                                    <Link
                                        key={social.label}
                                        href={
                                            social.label === "Instagram"
                                                ? speaker.instagramUrl
                                                : social.label === "LinkedIn"
                                                    ? speaker.linkedinUrl
                                                    : social.label === "TED"
                                                        ? speaker.tedUrl
                                                        : ""
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.aria}
                                    >
                                        <IconButton
                                            icon={social.icon}
                                            aria-label={social.aria}
                                            variant="ghost"
                                            size="lg"
                                            color={useColorModeValue("#000", "#000")}
                                            bg={useColorModeValue("#f0f0f0", "white")}
                                            _hover={{
                                                bg: social.color,
                                                color: "white",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.16)"
                                            }}
                                            isRound
                                            boxSize={iconBoxSize}
                                            transition="all 0.2s"
                                        />
                                    </Link>
                                ))}
                            </HStack>
                        </Box>
                    </Box>
                ))}
            </Flex>

            <IconButton
                aria-label="Previous"
                icon={<ChevronLeftIcon boxSize="3rem" />}
                onClick={handlePrev}
                position="absolute"
                top="50%"
                left="12px"
                transform="translateY(-50%)"
                bg="#EF0028"
                color="#fff"
                borderRadius="full"
                boxSize={{ base: "4.5rem", lg: "6rem" }}
                _hover={{
                    color: '#EF0028',
                    bg: '#fff',
                    border: '2px solid #EF0028'
                }}
            />
            <IconButton
                aria-label="Next"
                icon={<ChevronRightIcon boxSize="3rem" />}
                onClick={handleNext}
                position="absolute"
                top="50%"
                right="12px"
                transform="translateY(-50%)"
                bg="#EF0028"
                color="#fff"
                borderRadius="full"
                boxSize={{ base: "4.5rem", lg: "6rem" }}
                _hover={{
                    color: '#EF0028',
                    bg: '#fff',
                    border: '2px solid #EF0028'
                }}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
                <ModalOverlay bg="rgba(30, 30, 40, 0.85)" />
                <ModalContent
                    maxW={{ base: "90%", lg: "500px" }}
                    bg="linear-gradient(135deg, #f8fafc 60%, #e3e6ef 100%)"
                    borderRadius="2xl"
                    boxShadow="0 12px 48px 0 rgba(233,31,31,0.18), 0 2px 16px 0 #e91f1f22"
                    mx={2}         
                    p={0}
                    overflow="hidden"
                    position="relative"
                    border="1.5px solid #e3e6ef"
                >
                    <ModalCloseButton
                        top={4}
                        right={4}
                        color="#e91f1f"
                        bg="#fff"
                        borderRadius="full"
                        boxShadow="0 2px 8px #e91f1f22"
                        _hover={{ bg: "#e91f1f", color: "#fff" }}
                        zIndex={3}
                    />
                    <ModalBody p={{ base: 4, md: 8 }} position="relative" zIndex={2}>
                        {selected && (
                            <Box
                                flex={1}
                                borderRadius="xl"
                                overflow="hidden"
                                boxShadow="0 0 10px 1px #d8dce3"
                                alignSelf="center"
                                minH={{ base: "200px", md: "260px" }}
                                bg="linear-gradient(135deg, #e3e6ef 0%, #f8fafc 100%)"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                zIndex={2}
                                p={4}
                                width="100%"
                            >
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default TeamSection;
