import {
    Fragment
} from "react";
import {
    useColorMode
} from "../../../components/ui/color-mode";
import {
    Box,
    Flex,
    Separator,
    Stack
} from "@chakra-ui/react";
import {
    BsArrowRight,
    BsColumnsGap,
    BsFillChatFill,
    BsHddStackFill
} from "react-icons/bs";
import {
    useNavigate,
    useParams
} from "react-router";

const pages = [
    {
        Icon: BsColumnsGap,
        label: "Configuration",
        value: "configuration"
    },
    {
        Icon: BsFillChatFill,
        label: "Badwords",
        value: "badwords"
    },
    {
        Icon: BsHddStackFill,
        label: "Logs",
        value: "logs"
    }
]

function Sidebar({ guild }) {
    const navigate = useNavigate();
    let { colorMode } = useColorMode();
    let { id, page } = useParams();
    return (
        <Fragment>
            <Stack
                bgColor={colorMode === "dark" ? "#0E0917" : "#C6B2DB"}
                direction="column"
                display={["none", "none", "flex", "flex"]}
                h="100vh"
                left={0}
                pos="fixed"
                top={
                    document.getElementById("navbar")
                    ? `${document.getElementById("navbar").clientHeight}px`
                    : 0
                }
                w="20%"
            >
                <Flex
                    align="center"
                    justify="space-between"
                    p={5}
                >
                    <Stack
                        align="center"
                        direction="row"
                        gapX={5}
                    >
                        <Box
                            bgImg={`url(${guild.iconURL})`}
                            bgPos="center"
                            bgRepeat="no-repeat"
                            bgSize="cover"
                            h="70px"
                            rounded="full"
                            w="70px"
                        >
                        </Box>
                        <Box
                            as="h3"
                            fontWeight="bold"
                            fontSize="xl"
                        >
                            {guild.name}
                        </Box>
                    </Stack>
                </Flex>
                {
                    pages.map((p) =>
                        <Fragment
                            key={p.value}
                        >
                            <Flex
                                align="center"
                                cursor="pointer"
                                fontSize="xl"
                                justify="space-between"
                                onClick={() => navigate(`/dashboard/${id}${p.value === "configuration" ? "" : `/${p.value}`}`)}
                                p={5}
                                transition="all 0.2s"
                            >
                                <Stack
                                    align="center"
                                    direction="row"
                                    gapX={2}
                                >
                                    <p.Icon />
                                    <Box
                                        as="p"
                                    >
                                        {p.label}
                                    </Box>
                                </Stack>
                                <BsArrowRight />
                            </Flex>
                            {
                                page
                                ? (
                                    page === p.value
                                    ? <Separator variant="solid" />
                                    : ""
                                )
                                : (
                                    p.value === "configuration"
                                    ? <Separator variant="solid" />
                                    : ""
                                )
                            }
                        </Fragment>
                    )
                }
            </Stack>
        </Fragment>
    );
}

export default Sidebar;