import express from 'express';
import bodyParser from 'body-parser';
import CandidateinfoTable from '../models/CandidateinfoTable.js';
import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelizeConfig.js';
import reader from 'xlsx';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { unlinkSync } from 'fs';
import fs from 'fs';

const __dirname = path.resolve();

const router = express.Router();

// sequelize.sync();

router.use(fileUpload(
  {
  tempFileDir: `${__dirname}/files`}
));

// router.use(bodyParser.urlencoded({
//   extended: true
// }));

//returns all rows
router.get('/all', async(req, res)=>{
    try{
      const result = await CandidateinfoTable.findAll({
        order: [['id', 'DESC']],
      });
      // console.log(result);
      const items = result.rows;
      res.send(result);
    }catch(err){
      console.log("Error fetching : ", err);
    }
});

router.post('/sort', async (req, res)=>{

  const { orderBy, order } = req.body;
  
  try {

    const result = await ChecklistTable.findAll({
      order: [[orderBy || 'id', order || 'ASC']], // Default order by 'id' in ascending order if not provided
    });

    res.send(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }

});

router.post('/searchall', async (req, res)=>{

  const { filter, searchInput } = req.body;
  
  try {
    let whereClause = {};

    if (filter && searchInput) {
      whereClause[filter] = {
        [Sequelize.Op.like]: `${searchInput}%`,
      };
    }

    const result = await CandidateinfoTable.findAll({
      where: whereClause
    });

    res.send(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }


});

router.post('/search', async (req, res)=>{

  const { filter, searchInput, orderBy, order, page, pageSize } = req.body;
  
  try {
    let whereClause = {};

    if (filter && searchInput) {
      whereClause[filter] = {
        [Sequelize.Op.like]: `${searchInput}%`,
      };
    }

    const result = await CandidateinfoTable.findAll({
      where: whereClause,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [[orderBy || 'id', order || 'ASC']], // Default order by 'id' in ascending order if not provided
    });

    res.send(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }


});

// router.get('/search', async (req, res)=>{

//   const {name, exp} = req.query;

//   try{
//     const result = await CandidateinfoTable.findAll({
//       where: {
//         candidate_name: {
//           [Sequelize.Op.like]: `${req.query.name}%`
//         },
//         // relevant_experience: {
//         //   [Sequelize.Op.like]: `${req.query.exp}%`
//         // }
//       },
//       order: [['id']],
//     });
//     res.send(result);
//   }catch(error){
//     console.log("Error : ", error);
//   }
// });

//lazyload : page, pagesize passed in query

router.get('/', async (req, res) => {

  const { page = 1, pageSize = 3 } = req.query;

  try {
      const result = await ChecklistTable.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: [['id', 'ASC']],
      });
      const items = result.rows;
      const totalCount = result.count;
      res.send(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).send('Internal Server Error');
    }

});

//lazyload : page, pagesize passed in body
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

//get by id : pass id in params
router.get('/:id', async (req, res) => {

  const id = req.params.id;

  try {
      const item = await CandidateinfoTable.findByPk(id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
  } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).send('Internal Server Error');
  }

});

router.post('/insert', async (req, res) => {

  const {
    candidate_name,
    education,
    technology,
    mobile_number,
    email_id,
    home_town,
    current_location,
    preferred_location,
    previous_employment,
    current_employment,
    designation,
    company_name,
    qualification,
    experience,
    relevant_experience,
    course_completion,
    skill_set,
    current_takehome,
    expectation,
    notice_duration,
    reason_relieving,
    having_offers,
    resume,
    status
  } = req.body;
  
  var date_time = new Date();

    try{
      await CandidateinfoTable.create({
        candidate_name:candidate_name,
        education:education,
        technology:technology,
        mobile_number:mobile_number,
        profile_received_date:date_time,
        email_id:email_id,
        home_town:home_town,
        current_location:current_location,
        preferred_location:preferred_location,
        previous_employment:previous_employment,
        current_employment:current_employment,
        designation:designation,
        company_name:company_name,
        qualification:qualification,
        experience:experience,
        relevant_experience:relevant_experience,
        course_completion:course_completion,
        skill_set:skill_set,
        current_takehome:current_takehome,
        expectation:expectation,
        notice_duration:notice_duration,
        reason_relieving:reason_relieving,
        having_offers:having_offers,
        resume:resume,
        status:status
      });
      res.send("Data inserted");
    }catch(error){
      console.log("error inserting elements:", error);
    }

});

//body should be of format [{},{},{}]
// router.post('/insertMultiple', async (req, res) => {

//   console.log(req.body);

//   try{
//       await CandidateinfoTable.bulkCreate(req.body);
//       res.send("Data inserted");
//   }catch(error){
//       console.log("error inserting elements:", error);
//   }

// });

router.post('/fromxl', async (req, res)=>{
  
  const {filename="hiring.xlsx"} = req.body;

  const file = reader.readFile(`files/data/${filename}`);
    
  let data = [] 
    
  const sheets = file.SheetNames;
    
  // for(let i = 0; i < sheets.length; i++) { 
    const temp = reader.utils.sheet_to_json( 
          file.Sheets[file.SheetNames[0]]) 
          temp.forEach((res) => { 
            data.push({candidate_name:res['CANDIDATE NAME'], 
                       education:res['EDUCATION'],
                       technology:res['TECHNOLOGY'],
                       mobile_number:res['MOBILE'],
                       email_id:res['EMAIL ID'],
                       resume:res['RESUME'],
                       home_town:res['HOMETOWN'],
                       current_location:res['CURRENT LOCATION'],
                       preferred_location:res['PREFERRED LOCATION'],
                       previous_employment:res['PREVIOUS EMPLOYMENT'],
                       current_employment:res['CURRENT EMPLOYMENT'],
                       designation:res['DESIGNATION'],
                       experience:res['TOTAL EXPERIENCE'],
                       relevant_experience:res['RELEVANT EXPERIENCE'],
                       course_completion:res['COURSE COMPLETION '],
                       skill_set:res['SKILL SET'],
                       current_takehome:res['CURRENT TAKE HOME'],
                       expectation:res['EXPECTATION'],
                       notice_duration:res['NOTICE PERIOD'],
                       reason_relieving:res['REASON FOR RELEAVING'],
                       having_offers:res['OFFER IF'],
                       status:"Pending"
                      }); 
          })
    // console.log(data);

  // } 
    
  try{
    await CandidateinfoTable.bulkCreate(data);
    res.send("Data inserted");
    await unlinkSync(`files/data/${filename}`);
  }catch(error){
      console.log("error inserting elements:", error);
  }

});

router.post('/upload', async (req, res, next) => {

  let uploadFile = req.files.file;
  const name = uploadFile.name;
  console.log("name : ", name);
  const saveAs = `${name}`;
  await uploadFile.mv(`${__dirname}/files/data/${saveAs}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json({ status: 'uploaded', name, saveAs });
  });

});

router.post('/uploadResume', (req, res, next) => {

  let uploadFile = req.files.file;
  const name = uuidv4() + uploadFile.name;
  
  // const saveAs = `${name}`;
  const parentDir = path.join(__dirname, '..');
  const saveAs = path.join(parentDir, 'resumes', name);

  uploadFile.mv(saveAs, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(saveAs);
  });
});

router.post('/getResume', async (req, res, next) => {

  const { id } = req.body;
  // const parentDir = path.join(__dirname, '..');
  // const saveAs = path.join(parentDir, 'resumes', name);

  try {
    
    const result = await CandidateinfoTable.findOne({
      attributes: ['resume'],
      where: {
        id: id 
      }
    });

    const resumePath = result.resume;
    if(resumePath){
      res.sendFile(resumePath);
    }else{
      res.status(404).send('Resume not found');
    }

  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }

});

router.put('/edit', async (req, res) => {

  const data = req.body;
  console.log(data);

  try{

    for(const item in data){
      if(data[item] !== ''){
        try {
          await CandidateinfoTable.update(
            { [item]: data[item] },
            { where: { id: data['id'] } }
          )
        } catch (err) {
          console.log("Error in updating2 :", err);
        }
      }
    }

    res.send("Data updated");

  }catch(error){
    console.log("Error in updating1 :", error);
  }

});

// router.delete('/delete/:id', async (req, res) => {

//   try{
//     await CandidateinfoTable.destroy({ where: { id: req.params.id } });
//     res.send("Data deleted");
//   }catch(err){
//     console.log("Error in deleting : ", err);
//   }

// });

export default router;