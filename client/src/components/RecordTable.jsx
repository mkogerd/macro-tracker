import React from 'react';
/*import { Button, TextField, IconButton, InputAdornment, Tab, Tabs, Paper } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';*/

export default function MealTable(props) {
  // Load meal entries collected from database
  const mealEntries = props.data.map((entry, index) =>
    <MealEntry key={index} onDelete={props.onDelete} {...entry}/>
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grams</th>
          <th>Protein</th>
          <th>Carb</th>
          <th>Fat</th>
        </tr>
      </thead>
      <tbody>
        {mealEntries}
      </tbody>
    </table>
  );
}

function MealEntry(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.grams}</td>
      <td>{props.protein}</td>
      <td>{props.carb}</td>
      <td>{props.fat}</td>
      <td><button onClick={() => props.onDelete(props.id)}>X</button></td>
    </tr>
  );
}

