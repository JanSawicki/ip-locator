import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";

export default function DetailsComponent(props) {
  return (
    <Table className={props.classes.table}>
      <TableBody>
        {props.geoData &&
          props.geoData.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}