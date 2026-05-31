import {
    Box,
    Button,
    Stack,
    Text
} from "@chakra-ui/react";
import {
    BsChevronRight
} from "react-icons/bs"
import config from "../../config.json";
import Reveal from "../../Reveal";

function Landing() {
    return (
        <Stack
            align="center"
            direction="column"
            gapY={[3, 3, 4, 4]}
            h="100dvh"
            id="landing"
            justify="center"
            mx={["0", "0", "20%", "20%"]}
        >
            <Box>
                <Reveal
                    delay={0.1}
                >
                    <Box
                        as="h1"
                        fontSize={["2xl", "2xl", "7xl", "7xl"]}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Lindungi Server Discord-mu
                    </Box>
                </Reveal>
            </Box>
            <Box>
                <Reveal
                    delay={0.1}
                >
                    <Box
                        as="h2"
                        color="#5200EB"
                        fontSize={["xl", "xl", "6xl", "6xl"]}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Dengan Sentinel Bot
                    </Box>
                </Reveal>
            </Box>
            <Box
                mx={["10%", "10%", "0", "0"]}
            >
                <Reveal>
                    <Text
                        fontSize={["md", "md", "3xl", "3xl"]}
                        textAlign="center"
                    >
                        Bot moderasi bertenaga AI yang melindungi komunitas Discord-mu 24/7. Anti-raid, auto-mod, analitik lengkap. Semua dalam satu platform.
                    </Text>
                </Reveal>
            </Box>
            <Box>
                <Reveal>
                    <Stack
                        align="center"
                        direction="row"
                        gapX={4}
                        justify="center"
                    >
                        <Button
                            colorPalette="blue"
                            onClick={() => window.location.href = `${config.baseURL}/auth/login?guild=1`}
                            rounded="lg"
                            size={["md", "md", "2xl", "2xl"]}
                            variant="solid"
                        >
                            Tambahkan Ke Server <BsChevronRight />  
                        </Button>
                        <Button
                            colorPalette="gray"
                            onClick={() => {
                                const element = document.getElementById("pricing");
                                if(element) element.scrollIntoView({ behavior: "smooth" });
                            }}
                            rounded="lg"
                            size={["md", "md", "2xl", "2xl"]}
                            variant="outline"
                        >
                            Lihat Harga  
                        </Button>
                    </Stack>
                </Reveal>
            </Box>
        </Stack>
    );
}

export default Landing;