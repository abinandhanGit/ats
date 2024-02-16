import express from 'express';
import db from '../models/index.js';
import ChecklistTable from '../models/checklistTable.js';
import { Op, Sequelize } from 'sequelize';
import sequelize from '../models/sequelizeConfig.js';
import CandidateinfoTable from '../models/CandidateinfoTable.js';
// import path from 'path';
// const __dirname = path.resolve();
 
const router = express.Router();

router.get('/reqCount', async (req, res) => {

    const result = await ChecklistTable.count();
    // console.log(result);
    res.send(result.toString());
    
});

router.get('/canCount', async (req, res) => {

    const result = await CandidateinfoTable.count();
    // console.log(result);
    res.send(result.toString());
    
});

router.get('/canSelCount', async (req, res) => {

    const result = await CandidateinfoTable.count({
        where:{
            status:"Selected"
        }
    });
    // console.log(result);
    res.send(result.toString());
    
});

router.get('/canPenCount', async (req, res) => {

    const result = await CandidateinfoTable.count({
        where:{
            status:"Pending"
        }
    });
    // console.log(result);
    res.send(result.toString());
    
});

router.get('/canRejCount', async (req, res) => {

  const result = await CandidateinfoTable.count({
      where:{
          status:"Rejected"
      }
  });
  // console.log(result);
  res.send(result.toString());
  
});


router.get('/canIntCount', async (req, res) => {
  const excludedStatuses = ['Selected', 'Pending', 'Rejected'];

  const result = await CandidateinfoTable.count({
    where: {
      status: {
        [Op.not]: excludedStatuses,
      },
    },
  });

  res.send(result.toString());
});


router.get('/canReqCount', async (req, res) => {

    try {
        const results = await CandidateinfoTable.findAll({
          attributes: ['designation', [Sequelize.fn('COUNT', 'designation'), 'count']],
          group: ['designation'],
        });
    
        const jsonData = results.map((result) => ({
          designation: result.designation,
          count: result.get('count'),
        }));
    
        // console.log(jsonData); // This line is optional, for debugging purposes
    
        res.json(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
});

router.get('/manReqCount', async (req, res) => {

    try {
        const results = await ChecklistTable.findAll({
          attributes: ['company_name', [Sequelize.fn('COUNT', 'company_name'), 'count']],
          group: ['company_name'],
        });
    
        const jsonData = results.map((result) => ({
            company_name: result.company_name,
          count: result.get('count'),
        }));
        
        res.json(jsonData);

      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
});

export default router;