import {
  Fragment,
  useEffect,
  useState
} from "react";
import {
  Route,
  Routes
} from "react-router";
import {
  Flex,
  Spinner
} from "@chakra-ui/react";
import {
  getCurrentGuilds,
  getCurrentUser
} from "./api";

import Navbar from "./navigation/navbar";
import Home from "./pages/home";
import ServerManagement from "./pages/server-management";
import Dashboard from "./pages/dashboard";

function App() {
  let [user, setUser] = useState(null);
  let [guilds, setGuilds] = useState([]);
  let [loading, setLoading] = useState(0);
  useEffect(() => {
    const updateLoading = () => {
      setLoading((l) => l + 1);
    }
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch((err) => {})
      .finally(updateLoading);

    getCurrentGuilds()
      .then(res => {
        let filteredGuilds = res.data.filter(guild => ((guild.permissions & 0x20) === 0x20) || (guild.permissions & 0x8) || (guild.owner));
        setGuilds(filteredGuilds);
      })
      .catch((err) => {})
      .finally(updateLoading)
  }, []);
  return (
    loading < 2
    ? (
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
    : (
      <Fragment>
        <Navbar
          user={user}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
              />
            }
          />
          <Route
            path="/server-management"
            element={
              <ServerManagement
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/server-management/:subPath"
            element={
              <ServerManagement
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/server-management/:subPath/:id/subs"
            element={
              <ServerManagement
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/server-management/:subPath/:id/add-bot"
            element={
              <ServerManagement
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/dashboard/:id"
            element={
              <Dashboard
                guilds={guilds}
                user={user}
              />
            }
          />
          <Route
            path="/dashboard/:id/:page"
            element={
              <Dashboard
                guilds={guilds}
                user={user}
              />
            }
          />
        </Routes>
      </Fragment>
    )
  );
}

export default App;