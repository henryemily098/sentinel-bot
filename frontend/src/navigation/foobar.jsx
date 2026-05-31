import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
} from "@chakra-ui/react";
import {
    useColorMode
} from "../components/ui/color-mode";

import icon from "../assets/images/bot-icon.png";

function Foobar() {
    let { colorMode } = useColorMode();
    return (
        <Flex
            align="center"
            bgColor={colorMode === "dark" ? "#0E0917" : "#C6B2DB"}
            justify={["center", "center", "space-between", "space-between"]}
            mt={5}
            p={5}
            shadow="12px 12px 2px 1px rgba(0, 0, 0, .2)"
            w="100%"
        >
            <Stack
                align="center"
                direction="row"
                display={["none", "none", "flex", "flex"]}
                gapX={3}
            >
                <Box
                    bgImg={`url(${icon})`}
                    bgPos="center"
                    bgRepeat="no-repeat"
                    bgSize="cover"
                    h="80px"
                    rounded="full"
                    w="80px"
                >
                </Box>
                <Heading
                    as="h2"
                    display={["none", "none", "block", "block"]}
                >
                    Sentinel Bot
                </Heading>
            </Stack>
            <Box
                display={["none", "none", "inline-block", "inline-block"]}
            >
                © 2026 Sentinel Bot. All rights reserved. Made with ❤️ for Discord communities.
            </Box>
            <Stack
                direction="row"
                gapX={3}
            >
                <Button
                    variant="ghost"
                >
                    Privacy
                </Button>
                <Button
                    variant="ghost"
                >
                    Terms
                </Button>
                <Button
                    variant="ghost"
                >
                    Support
                </Button>
            </Stack>
        </Flex>
    );
}

export default Foobar;