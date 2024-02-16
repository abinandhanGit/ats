import express from 'express';
import bodyParser from 'body-parser';
import CandidateinfoTable from '../models/CandidateinfoTable.js';
import { Op, Sequelize } from 'sequelize';
import sequelize from '../models/sequelizeConfig.js';
import reader from 'xlsx';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { unlinkSync } from 'fs';
import fs from 'fs';

const __dirname = path.resolve();

const router = express.Router();


//Get all data using pagination
router.post('/all', async(req, res)=>{

    const { searchInput, orderBy, order, page, pageSize } = req.body;

    try {
        let whereClause = {};
    
        if (searchInput) {
            whereClause[Op.or] = [
                { candidate_name: { [Op.like]: `%${searchInput}%` } },
                { designation: { [Op.like]: `%${searchInput}%` } },
                { preferred_location: { [Op.like]: `%${searchInput}%` } },
                { status: { [Op.like]: `%${searchInput}%` } },
                { expectation: { [Op.like]: `%${searchInput}%` } },
            ];
        }

        const result = await CandidateinfoTable.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [[orderBy || 'id', order || 'DESC']], // Default order by 'id' in ascending order if not provided
        });
    
        res.send(result);
        
      } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal Server Error");
      }

})


export default router;