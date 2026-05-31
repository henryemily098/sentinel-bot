import {
    Box,
    Card,
    Stack,
    Text,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    BsBell,
    BsGear,
    BsLightning,
    BsLock,
    BsShield
} from "react-icons/bs";
import Reveal from "../../Reveal";

function EachFeature({ Icon, title, description, color }) {
    return (
        <WrapItem
            w={["90%", "90%", "30%", "30%"]}
        >
            <Card.Root
                borderRadius="lg"
                w="100%"
            >
                <Card.Body
                    gapY={3}
                >
                    <Box
                        bgColor={color || "#5842D4"}
                        borderRadius="3xl"
                        fontSize={["xl", "xl", "3xl", "3xl"]}
                        p={3}
                        w="max-content"
                    >
                        <Icon />
                    </Box>
                    <Card.Title
                        fontSize={["lg", "lg", "xl", "xl"]}
                        fontWeight="bold"
                    >
                        {title}
                    </Card.Title>
                    <Card.Description
                        fontSize={["md", "md", "lg", "lg"]}
                    >
                        {description}
                    </Card.Description>
                </Card.Body>
            </Card.Root>
        </WrapItem>
    );
}

function Feature() {
    return (
        <Stack
            align="center"
            direction="column"
            gapY={3}
            h={["auto", "auto", "100vh", "100vh"]}
            id="feature"
            justify="center"
        >
            <Box
                w="100%"
            >
                <Reveal>
                    <Box
                        as="h1"
                        fontSize={["2xl", "2xl", "7xl", "7xl"]}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Semua yang Dibutuhkan Server-mu
                    </Box>
                </Reveal>
            </Box>
            <Box
                w="100%"
            >
                <Reveal>
                    <Text
                        fontSize={["md", "md", "3xl", "3xl"]}
                        mx={["0", "0", "20%", "20%"]}
                        textAlign="center"
                    >
                        Sentinel Bot hadir dengan fitur-fitur canggih yang dirancang khusus untuk melindungi dan mengelola komunitas Discord-mu.
                    </Text>
                </Reveal>
            </Box>
            <Box
                w="100%"
            >
                <Reveal>
                    <Wrap
                        gap={3}
                        justify="center"
                        my="10px"
                        w="100%"
                    >
                        <EachFeature
                            color="#5842D4"
                            description="AI-powered moderation that detects spam, toxic content, and rule violations automatically — 24/7."
                            Icon={BsShield}
                            title="Advanced Auto-Moderation"
                        />
                        <EachFeature
                            color="#7C68ED"
                            description="Real-time raid detection with automatic lockdown mode to protect your community instantly."
                            Icon={BsLock}
                            title="Anti-Raid Protection"
                        />
                        <EachFeature
                            color="#A5F590"
                            description="Full insights into your server activity, member growth, and moderation logs with beautiful charts."
                            Icon={BsLock}
                            title="Detailed Analytics"
                        />
                        <EachFeature
                            color="#F57E00"
                            description="Responses under 50ms with 99.9% uptime SLA. Your server protection never sleeps."
                            Icon={BsLightning}
                            title="Lightning Fast"
                        />
                        <EachFeature
                            color="#E00056"
                            description="Get notified about suspicious activity via Discord DM, email, or webhook integrations."
                            Icon={BsBell}
                            title="Smart Alerts"
                        />
                        <EachFeature
                            color="#4F0FFF"
                            description="Tailor every rule, filter, and response to fit your community's unique needs perfectly."
                            Icon={BsGear}
                            title="Fully Customizable"
                        />
                    </Wrap>
                </Reveal>
            </Box>
        </Stack>
    );
}

export default Feature;