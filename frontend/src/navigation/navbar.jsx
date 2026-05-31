import {
    useState
} from "react";
import {
    useNavigate
} from "react-router";
import {
    Box,
    Button,
    CloseButton,
    Drawer,
    Flex,
    Heading,
    IconButton,
    Menu,
    Portal,
    Separator,
    Stack
} from "@chakra-ui/react";
import {
    BsColumnsGap
} from "react-icons/bs"
import {
    useColorMode
} from "../components/ui/color-mode";
import {
    BsArrowRight,
    BsDiscord,
    BsDoorOpen,
    BsList,
    BsMenuButtonWide,
    BsPerson
} from "react-icons/bs";

import config from "../config.json";
import icon from "../assets/images/bot-icon.png";

function Navbar({ user }) {
    let { colorMode } = useColorMode();
    let [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleScroll = (id) => {
        setOpen(false);
        if(window.location.pathname === "/") {
            const element = document.getElementById(id);
            if(element)element.scrollIntoView({ behavior: "smooth" });
        }
        else {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }

    return (
        <Flex
            align="center"
            bgColor={colorMode === "dark" ? "#0E0917" : "#C6B2DB"}
            id="navbar"
            justify="space-between"
            mb={5}
            p={5}
            pos="fixed"
            shadow="12px 12px 2px 1px rgba(0, 0, 0, .2)"
            top={0}
            w="100%"
            zIndex="sticky"
        >
            <Stack
                align="center"
                cursor="pointer"
                direction="row"
                gapX={3}
                onClick={() => handleScroll("landing")}
            >
                <Box
                    bgImg={`url(${icon})`}
                    bgPos="center"
                    bgRepeat="no-repeat"
                    bgSize="cover"
                    h={["40px", "40px", "80px", "80px"]}
                    rounded="full"
                    w={["40px", "40px", "80px", "80px"]}
                >
                </Box>
                <Heading
                    as="h2"
                    display={["none", "none", "block", "block"]}
                >
                    Sentinel Bot
                </Heading>
            </Stack>
            <Stack
                display={["none", "none", "flex", "flex"]}
                direction="row"
                gapX={5}
            >
                <Button
                    onClick={() => handleScroll("feature")}
                    rounded="2xl"
                    size="2xl"
                    variant="ghost"
                >
                    Fitur
                </Button>
            </Stack>
            <Stack
                display={["none", "none", "flex", "flex"]}
            >
                {
                    user
                    ? (
                        <Menu.Root>
                            <Menu.Trigger
                                asChild
                            >
                                <IconButton
                                    colorPalette="gray"
                                    rounded="full"
                                    size="2xl"
                                    variant="outline"
                                >
                                    <BsPerson />
                                </IconButton>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item
                                            cursor="pointer"
                                            onClick={() => {
                                                navigate("/server-management");
                                                setOpen(false);
                                            }}
                                            value="manage-server"
                                        >
                                            Dashboard <Menu.ItemCommand><BsColumnsGap /></Menu.ItemCommand>
                                        </Menu.Item>
                                        <Menu.Item
                                            color="fg.error"
                                            cursor="pointer"
                                            onClick={() => window.location.href = `${config.baseURL}/auth/logout`}
                                            value="logout"
                                        >
                                            Log Out <Menu.ItemCommand><BsDoorOpen /></Menu.ItemCommand>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    )
                    : (
                        <Button
                            colorPalette="blue"
                            onClick={() => window.location.href = `${config.baseURL}/auth/login`}
                            variant="solid"
                        >
                            <BsDiscord /> Login Via Discord
                        </Button>
                    )
                }
            </Stack>
            <Box
                display={["inline", "inline", "none", "none"]}
            >
                <Drawer.Root
                    onOpenChange={(e) => setOpen(e.open)}
                    open={open}
                    size="full"
                >
                    <Drawer.Trigger asChild>
                        <IconButton
                            size="sm"
                            variant="outline"
                        >
                            <BsList />
                        </IconButton>
                    </Drawer.Trigger>
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Main Menu</Drawer.Title>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <Stack
                                        direction="column"
                                        gapY={10}
                                        onClick={() => handleScroll("feature")}
                                    >
                                        <Flex
                                            align="center"
                                            justify="space-between"
                                        >
                                            <Box>Fitur</Box>
                                            <Box><BsArrowRight /></Box>
                                        </Flex>
                                        <Separator />
                                    </Stack>
                                </Drawer.Body>
                                <Drawer.Footer
                                    flexDirection="column"
                                >
                                    {
                                        user
                                        ? (
                                            <Button
                                                colorPalette="blue"
                                                onClick={() => {
                                                    navigate("/server-management");
                                                    setOpen(false);
                                                }}
                                                variant="solid"
                                                w="100%"
                                            >
                                                <BsMenuButtonWide /> Manage Server
                                            </Button>
                                        )
                                        : (
                                            <Button
                                                colorPalette="blue"
                                                onClick={() => window.location.href = `${config.baseURL}/auth/login`}
                                                variant="solid"
                                                w="100%"
                                            >
                                                <BsDiscord /> Login Via Discord
                                            </Button>
                                        )
                                    }
                                </Drawer.Footer>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Drawer.CloseTrigger>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            </Box>
        </Flex>
    );
}

export default Navbar;