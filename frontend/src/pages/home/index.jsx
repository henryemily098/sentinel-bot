import {
    Fragment
} from "react";
import {
    Flex,
} from "@chakra-ui/react";
import {
    Helmet
} from "@dr.pogodin/react-helmet";

import Foobar from "../../navigation/foobar";

import Landing from "./landing";
import Feature from "./feature";

function Home() {
    return (
        <Fragment>
            <Flex
                align="center"
                direction="column"
            >
                <Helmet>
                    <title>Sentinel Bot</title>
                </Helmet>
                <Landing />
                <Feature />
            </Flex>
            <Foobar />
        </Fragment>
    );
}

export default Home;