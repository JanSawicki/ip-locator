import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import DetailsComponent from "./DetailsComponent";
import MapComponent from "./MapComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const LOCAL_STORAGE_IP_ADDRESS_LIST = "";
const MAX_LENGTH_LAST_SEARCHED_IPS = 10;

export default function App() {
  const classes = useStyles();

  const getDataAxios = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const [ipAddress, setIpAddress] = useState("0.0.0.0");
  const [ipAddressError, setIpAddressError] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [previousCoordinates, setPreviousCoordinates] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [previousGeoData, setPreviousGeoData] = useState(null);
  const [searchedIpAddresses, setSearchedIpAddresses] = useState([]);

  useEffect(() => {
    getDataAxios("https://www.cloudflare.com/cdn-cgi/trace").then((data) => {
      let ipAddress = String(data).match(
        /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
      )[0];
      setIpAddress(ipAddress);
      search(ipAddress);
    });
  }, []);

  // https://stackoverflow.com/a/27434991
  const validateIpAddress = (ipaddress) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    );
  };

  const search = (ipAddress) => {
    let promise = getDataAxios(
      `https://ipapi.co/${ipAddress}/json/`
      //`http://ip-api.com/json/${ipAddress}`
      // `http://api.ipstack.com/${ipAddress}?access_key=f0eebe98233dcbdbed889c014e1ecd67`
    ).then((data) => {
      console.log(data);
      setPreviousCoordinates(coordinates);
      setPreviousGeoData(geoData);

      setCoordinates([Number(data["latitude"]), Number(data["longitude"])]);

      setGeoData([
        { name: "Country", value: data["country_name"] },
        { name: "Region", value: data["region"] },
        { name: "City", value: data["city"] },
        { name: "Currency", value: data["currency"] },
        { name: "Latitude", value: data["latitude"] },
        { name: "Longitude", value: data["longitude"] },
      ]);
    });

    let newSearchedIpAddresses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_IP_ADDRESS_LIST)
    );
    if (newSearchedIpAddresses === null) {
      newSearchedIpAddresses = [];
    }

    if (
      newSearchedIpAddresses[newSearchedIpAddresses.length - 1] !== ipAddress
    ) {
      newSearchedIpAddresses.push(ipAddress);
      if (newSearchedIpAddresses.length > MAX_LENGTH_LAST_SEARCHED_IPS) {
        newSearchedIpAddresses = newSearchedIpAddresses.slice(
          newSearchedIpAddresses.length - MAX_LENGTH_LAST_SEARCHED_IPS,
          newSearchedIpAddresses.length
        );
      }
    }

    setSearchedIpAddresses(newSearchedIpAddresses);

    localStorage.setItem(
      LOCAL_STORAGE_IP_ADDRESS_LIST,
      JSON.stringify(newSearchedIpAddresses)
    );

    return promise;
  };

  const handleIpAddressInput = (value) => {
    if (validateIpAddress(value)) {
      setIpAddressError(false);
    } else {
      setIpAddressError(true);
    }
    setIpAddress(value);
  };

  return (
    <Grid
      id="wrapper"
      container
      spacing={3}
      direction="row"
      xs={12}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={2}>
        <Paper className={classes.paper} style={{ minHeight: "30vw" }}>
          <Table className={classes.table}>
            <TableBody>
              {searchedIpAddresses
                .slice()
                .reverse()
                .map((row) => (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid container item xs={10} spacing={2}>
        <Grid item xs={6}>
          <MapComponent coordinates={coordinates} style={{ height: "20vw" }} />
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <DetailsComponent
              geoData={geoData}
              classes={classes}
            ></DetailsComponent>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper className={classes.paper} style={{ height: "5vw" }}>
            <TextField
              error={false}
              value={ipAddress}
              onChange={(event) => handleIpAddressInput(event.target.value)}
              id="standard-basic"
              label="IP address"
              error={ipAddressError}
            />
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper} style={{ height: "5vw" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                search(ipAddress);
              }}
            >
              Search
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={6} style={{ height: "20vw" }}>
          {previousCoordinates && (
            <MapComponent coordinates={previousCoordinates} />
          )}
        </Grid>
        <Grid item xs={6} style={{ height: "20vw" }}>
          {previousGeoData && (
            <Paper className={classes.paper}>
              <DetailsComponent
                geoData={previousGeoData}
                classes={classes}
              ></DetailsComponent>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
