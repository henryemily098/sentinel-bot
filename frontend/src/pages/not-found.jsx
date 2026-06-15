import {
    Box, 
    Button, 
    ButtonGroup, 
    Container, 
    Stack
} from "@chakra-ui/react";
import {
    BsArrowLeft,
    BsHouseDoor
} from "react-icons/bs";
import {
    useNavigate
} from "react-router";

import icon from "../assets/images/bot-icon.png";

function NotFound() {
    const navigate = useNavigate();
    return (
        <Container
            maxW="2xl"
            mt={
                document.getElementById("navbar")
                ? `${document.getElementById("navbar").clientHeight + 10}px`
                : 0
            }
        >
            <Stack
                align="center"
                direction="column"
                gapY={3}
                h="70vh"
                justify="center"
            >
                <Box
                    bgImg={`url(${icon})`}
                    bgPos="center"
                    bgRepeat="no-repeat"
                    bgSize="cover"
                    h={["100px", "100px", "150px", "150px"]}
                    w={["100px", "100px", "150px", "150px"]}
                />
                <Box
                    as="h1"
                    fontSize={["5xl", "5xl", "8xl", "8xl"]}
                    fontWeight="bold"
                >
                    404
                </Box>
                <Box
                    as="p"
                    fontSize={["lg", "lg", "2xl", "2xl"]}
                    textAlign="center"
                >
                    Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </Box>

                <ButtonGroup
                    my={5}
                >
                    <Button
                        onClick={() => navigate(-1)}
                        size={["md", "md", "2xl", "2xl"]}
                        variant="outline"
                    >
                        <BsArrowLeft /> Kembali
                    </Button>
                    <Button
                        colorPalette="blue"
                        onClick={() => navigate("/")}
                        size={["md", "md", "2xl", "2xl"]}
                        variant="solid"
                    >
                        <BsHouseDoor /> Ke Halaman Utama
                    </Button>
                </ButtonGroup>
            </Stack>
        </Container>
    );
}

export default NotFound;