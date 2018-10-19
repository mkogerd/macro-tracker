import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function RecordTable(props) {
  // Load meal entries collected from database
  const recordEntries = props.data.map((entry, index) =>
    <RecordEntry key={index} onDelete={props.onDelete} {...entry}/>
  );

  return (
    <Table style={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell numeric>Amount (g)</TableCell>
          <TableCell numeric>Protein (g)</TableCell>
          <TableCell numeric>Carbs (g)</TableCell>
          <TableCell numeric>Fat (g)</TableCell>
          <TableCell numeric></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recordEntries}
      </TableBody>
    </Table>
  );
}

function RecordEntry(props) {
  return (
    <TableRow>
      <TableCell component="th" scope="row" style={{overflow: 'hidden'}}>
        {props.name}
      </TableCell>
      <TableCell numeric>{props.grams}</TableCell>
      <TableCell numeric>{props.protein}</TableCell>
      <TableCell numeric>{props.carb}</TableCell>
      <TableCell numeric>{props.fat}</TableCell>
      <TableCell numeric>
        <IconButton aria-label="Delete" onClick={() => props.onDelete(props.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

