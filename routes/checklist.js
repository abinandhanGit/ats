import express from 'express';
import db from '../models/index.js';
import ChecklistTable from '../models/checklistTable.js';
import { Op, Sequelize } from 'sequelize';
import sequelize from '../models/sequelizeConfig.js';

const router = express.Router();

// sequelize.sync();

//returns all rows
router.get('/all', async(req, res)=>{
  try{
    const result = await ChecklistTable.findAll({
      order: [['id', 'ASC']],
      where: {status: "Open"}
    });
    // console.log(result);
    const items = result.rows;
    res.send(result);
  }catch(err){
    console.log("Error fetching : ", err);
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

    const result = await ChecklistTable.findAll({
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

    const result = await ChecklistTable.findAll({
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

// //lazyload : page, pagesize passed in query
// router.get('/', async (req, res) => {

//         //   try {
//         //     const result = await db.query('SELECT * FROM checklisttable;');
//         //     const items = result.rows;
//         //     res.send(items);
//         //   } catch (error) {
//         //     console.error('Error fetching items:', error);
//         //   }
//         const { page = 1, pageSize = 5 } = req.query;

//         // try {
//         // const result = await db.query('SELECT * FROM checklisttable ORDER BY id LIMIT $1 OFFSET $2;', [pageSize, (page - 1) * pageSize]);
//         // const items = result.rows;
//         // res.send(items);
//         // } catch (error) {
//         // console.error('Error fetching items:', error);
//         // res.status(500).send('Internal Server Error');
//         // }

//         try {
//             const result = await ChecklistTable.findAndCountAll({
//               limit: pageSize,
//               offset: (page - 1) * pageSize,
//               order: [['id', 'ASC']],
//             });
          
//             const items = result.rows;
//             const totalCount = result.count;
//             res.send(items);
//             // res.json({
//             //   items,
//             //   totalCount,
//             //   totalPages: Math.ceil(totalCount / pageSize),
//             // });
//           } catch (error) {
//             console.error('Error fetching items:', error);
//             res.status(500).send('Internal Server Error');
//           }

// });
 


//lazyload : page, pagesize passed in body

router.post('/', async (req, res) => {

    const {page, pageSize} = req.body;
  
    try {
      const result = await ChecklistTable.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: [['id', 'ASC']],
      });
            
      const items = result.rows;
      // const totalCount = result.count;
      res.send(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).send('Internal Server Error');
    }
  
});

//Get all data using pagination
router.post('/all', async(req, res)=>{

  const { searchInput, orderBy, order, page, pageSize } = req.body;
  // console.log(searchInput, orderBy, order, page, pageSize)
  try {
      let whereClause = {};
  
      if (searchInput) {
          whereClause[Op.or] = [
              { company_name: { [Op.like]: `%${searchInput}%` } },
              { position_tobe_filled: { [Op.like]: `%${searchInput}%` } },
              // { no_of_openings: { [Op.like]: `%${searchInput}%` } },
              { location: { [Op.like]: `%${searchInput}%` } },
              // { onboarding_days: { [Op.like]: `%${searchInput}%` } },
              { status: { [Op.like]: `%${searchInput}%` } }
          ];
      }

      const result = await ChecklistTable.findAndCountAll({
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
  
  //   try {
  //     const result = await db.query('SELECT * FROM checklisttable WHERE id = ($1)', [id]);
  //     const items = result.rows;
  //     res.send(items);
  //   } catch (error) {
  //     console.log('Error occurred:', error);
  //   }

  try {
      const item = await ChecklistTable.findByPk(id);
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

  console.log(req.body)

  const {
        company_name, 
        contact_person_name, 
        mobile_number, 
        email_id, 
        date_of_request, 
        requester_name, 
        requester_designation, 
        position_tobe_filled, 
        onboarding_days, 
        job_description, 
        reason_for_hiring, 
        qualification, 
        experience, 
        position_type, 
        location, 
        no_of_openings, 
        ctc_range, 
        initial_approval, 
        final_approval, 
        profile_sourcing, 
        budget,
        status="Open"
  } = req.body;
  
    // try {
    //   await db.query(
    //     'INSERT INTO checklisttable (company_name, contact_person_name, mobile_number, email_id, date_of_request, requester_name, requester_designation, position_tobe_filled, onboarding_days, job_description, reason_for_hiring, qualification, experience, position_type, location, no_of_openings, ctc_range, initial_approval, final_approval, profile_sourcing, budget) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);',
    //     [
    //       company_name, 
    //       contact_person_name, 
    //       mobile_number, 
    //       email_id, 
    //       date_of_request, 
    //       requester_name, 
    //       requester_designation, 
    //       position_tobe_filled, 
    //       onboarding_days, 
    //       job_description, 
    //       reason_for_hiring, 
    //       qualification, 
    //       experience, 
    //       position_type, 
    //       location, 
    //       no_of_openings, 
    //       ctc_range, 
    //       initial_approval, 
    //       final_approval, 
    //       profile_sourcing, 
    //       budget
    //     ]
    //   );
    //   res.send('done');
    // } catch (error) {
    //   console.error('Error inserting items:', error);
    // }

    try{
      await ChecklistTable.create({
        company_name:company_name,
        contact_person_name:contact_person_name,
        mobile_number:mobile_number,
        email_id:email_id,
        date_of_request:date_of_request,
        requester_name:requester_name,
        requester_designation:requester_designation,
        position_tobe_filled:position_tobe_filled,
        onboarding_days:onboarding_days,
        job_description:job_description,
        reason_for_hiring:reason_for_hiring,
        qualification:qualification,
        experience:experience,
        position_type:position_type,
        location:location,
        no_of_openings:no_of_openings,
        ctc_range:ctc_range,
        initial_approval:initial_approval,
        final_approval:final_approval,
        profile_sourcing:profile_sourcing,
        budget:budget,
        status:status
      });
      res.send("Data inserted");
      
    }catch(error){
      res.send(error);
    }

});

router.put('/edit', async (req, res) => {

  const data = req.body;
  // console.log(data);
  // try {
  //   for (const item in data) {
  //     try {
  //       await db.query(`UPDATE checklisttable SET ${item}=($1) WHERE id=($2);`, [data[item], req.body.id]);
  //     } catch (error) {
  //       console.log('Error in updating:', error);
  //     }
  //   }
  //   res.send('Data updated');
  // } catch (error) {
  //   console.log(error);
  // }

  try{

    for(const item in data){
      try {
        await ChecklistTable.update(
          { [item]: data[item] },
          { where: { id: data['id'] } }
        )
      } catch (err) {
        console.log("Error in updating2 :", err);
      }
    }

    res.send("Data updated");

  }catch(error){
    res.send(error);
  }

});

router.delete('/delete/:id', async (req, res) => {

  try{
    await ChecklistTable.destroy({ where: { id: req.params.id } });
    res.send("Data deleted");
  }catch(err){
    console.log("Error in deleting : ", err);
  }

});

export default router;