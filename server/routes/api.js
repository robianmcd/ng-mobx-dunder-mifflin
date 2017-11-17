const express = require('express');
const router = express.Router();

let employees = [
  {id: '01', name: 'Ryan', parentId: undefined},
  {id: '02', name: 'Michael', parentId: '01'},
  {id: '03', name: 'Jim', parentId: '02'},
  {id: '04', name: 'Dwight', parentId: '02'},
  {id: '05', name: 'Andy', parentId: '02'},
];

router.get('/employees', (req, res) => {
  res.json(employees);
});

module.exports = router;
