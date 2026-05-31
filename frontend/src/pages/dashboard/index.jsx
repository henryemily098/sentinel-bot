import {
    useEffect,
    useState
} from "react";
import {
    useNavigate,
    useParams
} from "react-router";
import {
    Box,
    Flex,
    Spinner
} from "@chakra-ui/react";
import {
    Helmet
} from "@dr.pogodin/react-helmet";
import {
    createWebSocket
} from "../../api";
import config from "../../config.json";
import Sidebar from "./navigation/sidebar";
import Configuration from "./configuration";
import Logs from "./logs";

function Dashboard({ user, guilds }) {
    let { id, page } = useParams();
    const navigate = useNavigate();
    let [isSubscribed, setSubscribed] = useState(false);
    let [channels, setChannels] = useState([]);
    let [client, setClient] = useState(null);
    let [guild, setGuild] = useState(null);

    useEffect(() => {
        let newClient;
        let acceptedPath = ["badwords", "logs"];
        if(!user) window.location.href = `${config.baseURL}/auth/login`;
        else if(!id || guilds.map(i => i.id).indexOf(id) === -1) navigate("/server-management");
        else if(page && !acceptedPath.includes(page)) navigate(`/dashboard/${id}`);
        else {
            newClient = createWebSocket(`${config.baseURL}/web-socket`);
            newClient.onConnect = () => {
                newClient.publish({
                    destination: `/socket-request/guilds/${id}`
                });
                newClient.publish({
                    destination: `/socket-request/guilds/${id}/channels`
                });
                newClient.publish({
                    destination: `/socket-request/subscriptions/${user.id}/get/${id}`
                });
                newClient.subscribe(`/socket-response/guilds/${id}`, (response) => {
                    let g = JSON.parse(response.body);
                    setGuild(g);
                });
                newClient.subscribe(`/socket-response/guilds/${id}/channels`, (response) => {
                    let cs = JSON.parse(response.body);
                    setChannels(cs || []);
                });
                newClient.subscribe(`/socket-response/subscriptions/${user.id}/get/${id}`, (response) => {
                    let body = JSON.parse(response.body);
                    setSubscribed(body ? true : false);
                });
            }
            setClient(newClient);
        }
        return () => {
            if(newClient) newClient.deactivate();
        }
    }, [
        id,
        guilds,
        page,
        navigate,
        user
    ]);

    return (
        client && guild && user
        ? (
            <Flex
                direction="row"
                mt={
                    document.getElementById("navbar")
                    ? `${document.getElementById("navbar").clientHeight}px`
                    : 0
                }
            >
                <Helmet>
                    <title>{guild.name} - Dashboard - Sentinel Bot</title>
                </Helmet>
                <Box
                    w={["0", "0", "20%", "20%"]}
                >
                    <Sidebar
                        guild={guild}
                        isSubscribed={isSubscribed}
                    />
                </Box>
                <Box
                    w={["100%", "100%", "80%", "80%"]}
                >
                    {
                        page && page === "logs"
                        ? <Logs />
                        : <Configuration
                            channels={channels}
                            client={client}
                            guild={guild}
                            isSubscribed={isSubscribed}
                        />
                    }
                </Box>
            </Flex>
        )
        : (
            <Flex
                align="center"
                h="100vh"
                justify="center"
            >
                <Spinner
                    size="xl"
                />
            </Flex>
        )
    );
}

export default Dashboard;