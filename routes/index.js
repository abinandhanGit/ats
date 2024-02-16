import express from 'express';
import bodyParser from 'body-parser';
import checklistRoutes from './checklist.js';
import candidateinfoRoutes from './candidateinfo.js';
import userinfoRoutes from './userinfo.js'; 
import shortlistingRoutes from './shortlisting.js';
import dashboardRoutes from './dashboard.js';
import masterdataRoutes from './masterdata.js';
// import tempRoutes from './temp.js'; 

const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/checklist', checklistRoutes);
router.use('/candidateinfo', candidateinfoRoutes);
router.use('/userinfo', userinfoRoutes);
router.use('/shortlisting', shortlistingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/masterdata', masterdataRoutes);
// router.use('/temp', tempRoutes);

export default router;