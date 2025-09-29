import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    IconButton,
    Image,
    Link,
    useColorMode,
    useColorModeValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    VStack,
    Button,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { logo } from "../../assets";
import { HamburgerIcon } from "@chakra-ui/icons";

const MyNavbar: React.FC = () => {
    const { colorMode } = useColorMode();

    const [isNavVisible, setIsNavVisible] = useState(true);

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const currentPosition = window.pageYOffset;
        setIsNavVisible(currentPosition < scrollPosition);
        setScrollPosition(currentPosition);
    };

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    const menuItems = [
        { label: "Home", id: "hero-section" },
        { label: "Team", id: "team-section" },
        { label: "About Us", id: "about-section" },
        // { label: "Partners", id: "/sponsors" },
    ];

    const navigate = useNavigate();
    const location = useLocation();

    const handleSectionMenuClick = (id: string) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: id } });
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleMenuClick = (id: string) => {
        closeDrawer();
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollPosition]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (location.state && (location.state as any).scrollTo) {
            const sectionId = (location.state as any).scrollTo;
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    }, [location]);

    return (
        <>
            <Box
                display={{ base: "none", lg: "none" }}
                width="100%"
                py="1.5rem"
                px="1rem"
                bg={useColorModeValue("#f1f1f1", "black")}
                zIndex="999"
            >
                <Link as={RouterLink} to="/" cursor="pointer">
                    <Flex justifyContent="space-between" alignItems="center" paddingX="1rem">
                        <Image src={logo} width={{ base: "70%", md: "60%" }} />
                    </Flex>
                </Link>
            </Box>

            <Box
                position="sticky"
                top={0}
                transition="top 0.3s"
                zIndex="999"
                sx={{
                    background: "rgba(20, 20, 20, 0.55)", // semi-transparent dark
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Mobile Navbar */}
                <Flex
                    as="nav"
                    display={{ base: "block", lg: "none" }}
                    position="relative"
                    width="100%"
                    height="7rem"
                    paddingX="0.6rem"
                    bg="#111111"
                >
                    <Flex
                        position={"absolute"}
                        top={"50%"}
                        left={"7%"}
                        transform={"translate(-50%, -50%)"}
                        paddingX="1rem"
                    >
                        <IconButton
                            aria-label="Open menu"
                            icon={<HamburgerIcon />}
                            display={{ base: "inline-flex", lg: "none" }}
                            onClick={openDrawer}
                            variant="ghost"
                            fontSize="2.2rem"
                            mr={2}
                            color={useColorModeValue("#fff", "#fff")}
                        />
                    </Flex>
                    <Link as={RouterLink} to="/" cursor="pointer">
                        <Image
                            position={"absolute"}
                            top={"50%"}
                            left={"50%"}
                            transform={"translate(-50%, -50%)"}
                            src={logo}
                            width={{ base: "55px", md: "55px" }}
                            borderRadius={"15px"}
                        />
                    </Link>
                </Flex>

                <Drawer placement="right" onClose={closeDrawer} isOpen={isDrawerOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody bg="linear-gradient(135deg, #121212, #1e1e1e, #2c2c2c)">
                            <VStack spacing={6} mt={10}>
                                {menuItems.map((item) =>
                                    item.id.startsWith("/") ? (
                                        <Button
                                            as={RouterLink}
                                            to={item.id}
                                            key={item.id}
                                            variant="ghost"
                                            fontSize={{ base: "1.3rem", lg: "1.6rem" }}
                                            width="100%"
                                            color="#fff"
                                            onClick={closeDrawer}
                                        >
                                            {item.label}
                                        </Button>
                                    ) : (
                                        <Button
                                            key={item.id}
                                            variant="ghost"
                                            fontSize={{ base: "1.3rem", lg: "1.6rem" }}
                                            width="100%"
                                            color="#fff"
                                            onClick={() => {
                                                if (typeof closeDrawer === "function") closeDrawer();
                                                setTimeout(() => {
                                                    const el = document.getElementById(item.id);
                                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                                }, 200);
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    )
                                )}
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Desktop Navbar */}
                <Flex
                    as="nav"
                    display={{ base: "none", lg: "block" }}
                    width="100%"
                    height="8rem"
                    paddingX="1rem"
                    position="relative"
                    bg="#111111"
                >
                    <Flex
                        position="relative"
                        width="100%"
                        height="100%"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingX="2rem"
                    >
                        {/* Far left: Logo */}
                        <Link as={RouterLink} to="/" cursor="pointer">
                            <Image src={logo} width={{ lg: "65px", xl: "65px" }} borderRadius={"15px"} />
                        </Link>

                        {/* Center: Nav items */}
                        <Flex
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            gap={2}
                            alignItems="center"
                        >
                            {menuItems.map((item) =>
                                item.id.startsWith("/") ? (
                                    <Button
                                        as={RouterLink}
                                        to={item.id}
                                        key={item.id}
                                        variant="ghost"
                                        fontSize="1.6rem"
                                        color={colorMode === "dark" ? "#fff" : "#fff"}
                                        _hover={{ color: "red" }}
                                    >
                                        {item.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        fontSize="1.6rem"
                                        color={colorMode === "dark" ? "#fff" : "#fff"}
                                        _hover={{ color: "red" }}
                                        onClick={() => handleSectionMenuClick(item.id)}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default MyNavbar;
