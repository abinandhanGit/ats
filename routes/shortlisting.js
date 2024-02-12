import express from 'express';
import db from '../models/index.js';
import ChecklistTable from '../models/checklistTable.js';
import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelizeConfig.js';
import CandidateinfoTable from '../models/CandidateinfoTable.js';
// import path from 'path';
// const __dirname = path.resolve();
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

const router = express.Router();

router.get('/positions', async (req, res) => {
  const result = await ChecklistTable.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('position_tobe_filled')), 'position_tobe_filled']],
    where: {
      status: 'Open'
    },
  });
  res.send(result);
});


router.get('/companyNames/:designation', async (req, res) => {

  // console.log("designation : ", req.params.designation)
  const result = await ChecklistTable.findAll({
    attributes: ['company_name'],
    where: {
      position_tobe_filled: [req.params.designation],
      status: ['Open']
    },
  });
  res.send(result);
});

router.post('/candidates', async (req, res) => {
  const { position_tobe_filled } = req.body;

  const result = await CandidateinfoTable.findAll({
    where: {
      designation: position_tobe_filled,
    },
  });

  res.send(result);
});

router.get('/statusCandidates/:status', async (req, res) => {
  // const {position_tobe_filled} = req.body;
  const status = req.params.status;
  // console.log("status is  ", status)
  const result = await CandidateinfoTable.findAll({
    where: {
      status: [status],
    },
  });

  res.send(result);
});

router.post('/statusCandidates', async (req, res) => {
  const { status, orderBy, order, page, pageSize } = req.body;

  try {
    const result = await CandidateinfoTable.findAll({
      where: { status: [status] },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [[orderBy || 'id', order || 'DESC']], // Default order by 'id' in ascending order if not provided
    });

    res.send(result);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/handleStatus', async (req, res) => {
  const {
    id,
    newStatus,
    technical_feedback,
    hr_feedback,
    tele_comm_feedback,
    aptitude_feedback,
    rejected_feedback,
    machine_feedback,
    mailids,
  } = req.body;
  console.log(
    id,
    newStatus,
    technical_feedback,
    hr_feedback,
    tele_comm_feedback,
    aptitude_feedback,
    machine_feedback
  );

  let process;

  if (technical_feedback) {
    process = 'technical_timestamp';
  } else if (hr_feedback) {
    process = 'hr_timestamp';
  } else if (tele_comm_feedback) {
    process = 'tele_comm_timestamp';
  } else if (aptitude_feedback) {
    process = 'aptitude_timestamp';
  } else if (rejected_feedback) {
    process = 'rejected_timestamp';
  } else if (machine_feedback) {
    process = 'rejected_timestamp';
  } else {
    process = 'screening_timestamp';
  }

  var date_time = new Date();

  try {
    try {
      await CandidateinfoTable.update(
        {
          status: newStatus,
          technical_feedback: technical_feedback,
          tele_comm_feedback: tele_comm_feedback,
          aptitude_feedback: aptitude_feedback,
          hr_feedback: hr_feedback,
          rejected_feedback: rejected_feedback,
          machine_feedback: machine_feedback,
          [process]: date_time,
        },
        { where: { id: id } }
      );
    } catch (err) {
      console.log('Error in updating2 :', err);
    }

    res.send('Data updated');
  } catch (error) {
    console.log('Error in updating1 :', error);
  }
});

// router.put('/handleStatus', async (req, res) => {

//   const {id, newStatus, technical_feedback, hr_feedback, tele_comm_feedback, aptitude_feedback, rejected_feedback} = req.body;
//   console.log(id, newStatus, technical_feedback, hr_feedback, tele_comm_feedback, aptitude_feedback);

//   let process;

//   if (technical_feedback) {
//     process = "technical_timestamp";
//   } else if (hr_feedback) {
//     process = "hr_timestamp";
//   } else if (tele_comm_feedback) {
//     process = "tele_comm_timestamp";
//   } else if (aptitude_feedback) {
//     process = "aptitude_timestamp";
//   } else if (rejected_feedback) {
//     process = "rejected_timestamp";
//   }

//   var date_time = new Date();

//   try {
//     try {
//       const updateData = {
//         status: newStatus,
//         [process]: date_time
//       };

//       if (technical_feedback !== undefined) {
//         updateData.technical_feedback = technical_feedback;
//       }
//       if (hr_feedback !== undefined) {
//         updateData.hr_feedback = hr_feedback;
//       }
//       if (tele_comm_feedback !== undefined) {
//         updateData.tele_comm_feedback = tele_comm_feedback;
//       }
//       if (aptitude_feedback !== undefined) {
//         updateData.aptitude_feedback = aptitude_feedback;
//       }
//       if (rejected_feedback !== undefined) {
//         updateData.rejected_feedback = rejected_feedback;
//       }

//       await CandidateinfoTable.update(
//         updateData,
//         { where: { id: id } }
//       );
//     } catch (err) {
//       console.log("Error in updating2 :", err);
//     }

//     res.send("Data updated");

//   } catch(error) {
//     console.log("Error in updating1 :", error);
//   }

// });

router.put('/handleFeedback', async (req, res) => {
  const {
    id,
    technical_feedback,
    hr_feedback,
    telecomm_feedback,
    aptitude_feedback,
    machine_feedback,
  } = req.body;

  try {
    await CandidateinfoTable.update(
      {
        technical_feedback: technical_feedback,
        telecomm_feedback: telecomm_feedback,
        aptitude_feedback: aptitude_feedback,
        hr_feedback: hr_feedback,
        machine_feedback: machine_feedback,
      },
      { where: { id: id } }
    );

    res.send('Data updated');
  } catch (error) {
    console.log('Error in updating1 :', error);
  }
});

router.get('/count/:status', async (req, res) => {
  const status = req.params.status;

  const result = await CandidateinfoTable.count({
    where: {
      status: [status],
    },
  });
  // console.log(result);
  res.send(result.toString());
});

router.post('/technology', async (req, res) => {
  const {
    searchInput,
    position_tobe_filled,
    location,
    notice_duration,
    candidate_name,
    status = 'Pending',
  } = req.body;

  // const { filter, searchInput, orderBy, order, page, pageSize } = req.body;
  console.log(
    searchInput,
    ' ',
    position_tobe_filled,
    ' ',
    location,
    ' ',
    notice_duration,
    ' ',
    status
  );

  try {
    let whereClause = {};

    if (status) {
      whereClause['status'] = {
        [Sequelize.Op.like]: `${status}`,
      };
    }

    if (position_tobe_filled) {
      whereClause['designation'] = {
        [Sequelize.Op.like]: `${position_tobe_filled}`,
      };
    }

    if (searchInput) {
      whereClause['technology'] = {
        [Sequelize.Op.like]: `%${searchInput}%`,
      };
    }

    if (candidate_name) {
      whereClause['candidate_name'] = {
        [Sequelize.Op.like]: `%${candidate_name}%`,
      };
    }

    if (location) {
      whereClause['preferred_location'] = {
        [Sequelize.Op.like]: `%${location}%`,
      };
    }

    if (notice_duration) {
      whereClause['notice_duration'] = {
        [Sequelize.Op.like]: `${notice_duration}`,
      };
    }

    const result = await CandidateinfoTable.findAll({
      where: whereClause,
    });

    res.send(result);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/shortlistedSearch', async (req, res) => {
  const {
    nameSearchInput,
    technologySearchInput,
    position_tobe_filled,
    notice_duration,
    status = 'pending',
  } = req.body;

  // const { filter, searchInput, orderBy, order, page, pageSize } = req.body;
  console.log(
    'hehere ',
    nameSearchInput,
    ' ',
    technologySearchInput,
    ' ',
    position_tobe_filled,
    ' ',
    notice_duration,
    ' ',
    status
  );
  try {
    let whereClause = {};

    if (status) {
      whereClause['status'] = {
        [Sequelize.Op.like]: `${status}`,
      };
    }

    if (position_tobe_filled) {
      whereClause['designation'] = {
        [Sequelize.Op.like]: `${position_tobe_filled}`,
      };
    }

    if (nameSearchInput) {
      whereClause['candidate_name'] = {
        [Sequelize.Op.like]: `${nameSearchInput}%`,
      };
    }

    if (technologySearchInput) {
      whereClause['technology'] = {
        [Sequelize.Op.like]: `%${technologySearchInput}%`,
      };
    }

    if (notice_duration) {
      whereClause['notice_duration'] = {
        [Sequelize.Op.like]: `${notice_duration}`,
      };
    }

    const result = await CandidateinfoTable.findAll({
      where: whereClause,
    });

    res.send(result);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/sendmail', async (req, res) => {
  // initialize nodemailer

  const {receiver_mailids, feedback, candidate_name, newStatus, designation, company_name} = req.body;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAILID,
      pass: process.env.APPPASSWORD,
    },
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions));

  // for (const user of users) {
  //   if (user.email) {
  //     const mailOptions = {
  //       from: '"My Company" <my@company.com>', // sender address
  //       template: 'email', // the name of the template file, i.e., email.handlebars
  //       to: user.email,
  //       subject: `Welcome to My Company, ${user.name}`,
  //       context: {
  //         name: user.name,
  //         company: 'my company',
  //       },
  //     };
  //     try {
  //       await transporter.sendMail(mailOptions);
  //     } catch (error) {
  //       console.log(`Nodemailer error sending email to ${user.email}`, error);
  //     }
  //   }
  // }

  const context = {
    name: candidate_name, // Change this to the actual recipient's name
    company: company_name, // Change this to the actual company name
    feedback: feedback,
    designation:designation,
    newStatus:newStatus
  };

  var mailOptions = {
    from: process.env.EMAILID,
    to: receiver_mailids,
    subject: 'Update from ATS',
    text: '',
    template: 'email',
    context: context
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info.response)
    }
  });

});

router.post('/sendRejectmail', async (req, res) => {
  // initialize nodemailer

  const {receiver_mailids, feedback, candidate_name, newStatus, designation, company_name} = req.body;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAILID,
      pass: process.env.APPPASSWORD,
    },
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions));

  const context = {
    name: candidate_name,
    company: company_name,
    feedback: feedback,
    designation:designation,
    newStatus:newStatus
  };

  var mailOptions = {
    from: process.env.EMAILID,
    to: receiver_mailids,
    subject: 'Update from ATS',
    // text: 'You are selected',
    template: 'rejemail',
    context: context
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info.response)
    }
  });

});

export default router;