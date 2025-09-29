// FooterSection.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Text,
  Link,
  IconButton,
  useBreakpointValue,
  Flex,
  HStack,
  VStack,
  Image,
  useColorModeValue,
  Divider,
  Collapse,
  Button,
} from '@chakra-ui/react';
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { logo } from '../../assets';
import { Link as RouterLink } from "react-router-dom";

const FooterSection: React.FC = () => {

  // --- sizes with safe fallbacks
  const iconSize = useBreakpointValue({ base: '1.5rem', md: '1.35rem', lg: '1.6rem' }) ?? '1.3rem';
  const iconButtonSize = useBreakpointValue({ base: '3.2rem', md: '3rem', lg: '3.2rem' }) ?? '2.8rem';
  const linkFontSize = useBreakpointValue({ base: '1.2rem', md: '1.3rem', lg: '1.3rem' }) ?? '1rem';

  // --- colors
  const bg = useColorModeValue('#0e0e0e', '#0e0e0e'); // fixed dark to match reference
  const linkColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');
  const linkHover = useColorModeValue('white', 'white');
  const dividerColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.300');
  const subtleText = useColorModeValue('whiteAlpha.700', 'whiteAlpha.700');

  // --- your original links (kept exactly)
  const navLinks = useMemo(
    () => [
      { label: 'Home', href: '#hero-section' },
    ],
    []
  );

  // --- extra groups (from the screenshot). You can edit freely.
  const groupTwo = useMemo(
    () => [
      { label: 'About Us', href: '#about-section' },
    ],
    []
  );

  const groupThree = useMemo(
    () => [
      { label: 'Team', href: '#team-section' },
    ],
    []
  );

  // const groupFour = useMemo(
  //   () => [
  //     { label: 'Sponsors', href: '/sponsors' },
  //   ],
  //   []
  // );

  // --- socials (same logic as yours; only black/white)
  const socials = useMemo(
    () => [
      { label: 'Facebook', href: 'https://www.facebook.com/', icon: <FaFacebookF size={iconSize} /> },
      { label: 'YouTube', href: 'https://www.youtube.com/', icon: <FaYoutube size={iconSize} /> },
      { label: 'Instagram', href: 'https://www.instagram.com/', icon: <FaInstagram size={iconSize} /> },
      { label: 'X (Twitter)', href: 'https://x.com/', icon: <FaXTwitter size={iconSize} /> },
    ],
    [iconSize]
  );

  // --- back-to-top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Prepare all groups in an array for easy mapping
  const linkGroups = [navLinks, groupTwo, groupThree];

  const [openGroupIdx, setOpenGroupIdx] = useState<number | null>(0);

  const handleToggleGroup = (idx: number) => {
    setOpenGroupIdx(openGroupIdx === idx ? null : idx);
  };

  return (
    <Box as="footer" position="relative" bg={bg} pt={{ base: '2.5rem', md: '3rem' }} pb={{ base: '2.5rem', md: '3rem' }} zIndex={10}>
      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        

        <Flex justify="center" my={{ base: 12, md: 12, lg: 12 }}>
          <Link as={RouterLink} to="/" cursor="pointer">
          <Image
            src={logo}
            alt="logo"
            width={{ base: '60px', lg: '65px' }}
            borderRadius="lg"
            mb={4}
          />
          </Link>
        </Flex>

        {/* Social icons */}
        <HStack 
        spacing={{ base: 4, md: 5 }} 
        my={{ base: 12, md: 12, lg: 12 }}
        justify="center"
        >
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              isExternal
              aria-label={s.label}
              _focusVisible={{ boxShadow: 'outline' }}
            >
              <IconButton
                aria-label={s.label}
                icon={s.icon}
                isRound
                size="30rem"
                boxSize={iconButtonSize}
                bg="white"
                color="black"
                variant="ghost"
                _hover={{
                  bg: 'black',
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.16)',
                }}
                _active={{ bg: 'black', color: 'white' }}
                transition="all 0.2s"
              />
            </Link>
          ))}
        </HStack>

        <Flex
          role="navigation"
          aria-label="Footer"
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          wrap="nowrap"
          gap={{ base: 0, md: 0 }}
          mt={{ base: 2, md: 0 }}
        >
          {linkGroups.map((group, idx) => (
            <React.Fragment key={idx}>
              {/* Mobile: Collapsible group */}
              <Box w="100%" display={{ base: 'block', md: 'none' }}>
                <Button
                  onClick={() => handleToggleGroup(idx)}
                  w="100%"
                  justifyContent="space-between"
                  rightIcon={
                    openGroupIdx === idx ? (
                      <ChevronUpIcon boxSize={6} />
                    ) : (
                      <ChevronDownIcon boxSize={6} />
                    )
                  }
                  fontWeight="bold"
                  fontSize="1.15rem"
                  color={linkColor}
                  bg="transparent"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.200' }}
                  borderBottom="1px solid"
                  borderColor={dividerColor}
                  borderRadius={0}
                  py={5}
                >
                  {group[0]?.label.split(' ')[0] || `Group ${idx + 1}`}
                </Button>
                <Collapse in={openGroupIdx === idx} animateOpacity>
                  <VStack align="center" spacing={0} py={2} bg="transparent" w="100%">
                    {group.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        isExternal={Boolean((item as any).isExternal)}
                        color={linkColor}
                        fontSize={linkFontSize}
                        lineHeight="2rem"
                        _hover={{ color: linkHover, textDecoration: 'none' }}
                        _focusVisible={{ boxShadow: 'outline' }}
                        textAlign="center"
                        w="100%"
                        py={2}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </VStack>
                </Collapse>
              </Box>
              
              {/* Desktop: Always expanded */}
              <VStack
                align="center"
                minW={{ base: '100%', md: '180px' }}
                px={{ base: 0, md: 6 }}
                mb={{ base: 0, md: 0 }}
                display={{ base: 'none', md: 'flex' }}
              >
                {group.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    isExternal={Boolean((item as any).isExternal)}
                    color={linkColor}
                    fontSize={linkFontSize}
                    lineHeight="2rem"
                    _hover={{ color: linkHover, textDecoration: 'none' }}
                    _focusVisible={{ boxShadow: 'outline' }}
                    textAlign="center"
                    w="100%"
                  >
                    {item.label}
                  </Link>
                ))}
              </VStack>
              {idx < linkGroups.length - 1 && (
                <>
                  <Box display={{ base: 'none', md: 'block' }} h="auto" alignSelf="stretch">
                    <Divider orientation="vertical" borderColor={dividerColor} />
                  </Box>
                  <Box display={{ base: 'block', md: 'none' }} w="100%" px={8}>
                    <Divider orientation="horizontal" borderColor={dividerColor} />
                  </Box>
                </>
              )}
            </React.Fragment>
          ))}
        </Flex>
      </Container>

      {/* Back to Top */}
      {showTop && (
        <IconButton
          icon={<MdKeyboardArrowUp size="22px" />}
          aria-label="Back to top"
          position="fixed"
          bottom="24px"
          right="24px"
          zIndex={100}
          colorScheme="red"
          size="lg"
          borderRadius="full"
          boxShadow="lg"
          onClick={scrollToTop}
        />
      )}
    </Box>
  );
};

export default FooterSection;
