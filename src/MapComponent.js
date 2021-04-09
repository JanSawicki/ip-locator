import GoogleMapReact from "google-map-react";
import React from "react";
import { Map, Marker } from "pigeon-maps";

export default function MapComponent(props) {
  return (
    <Map
      height={300}
      defaultCenter={[0,0]}
      defaultZoom={0.7}
    >
      <Marker
        width={50}
        anchor={props.coordinates}
      />
    </Map>
  );
  // <GoogleMapReact
  //   bootstrapURLKeys={{
  //     key: "*PUT KEY HERE*",
  //   }}
  //   defaultCenter={
  //     (props.geoData && [
  //       props.geoData["latitude"],
  //       props.geoData["longitude"],
  //     ]) || [10, 0]
  //   }
  //   defaultZoom={7}
  // >
  //   <RoomIcon
  //     lat={(props.geoData && props.geoData["latitude"]) || 10}
  //     lng={(props.geoData && props.geoData["longitude"]) || 0}
  //   />
  // </GoogleMapReact>
}
