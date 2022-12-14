const User = require("../models/user")
const Project = require("../models/project");
const Rock = require("../models/rock");

module.exports = {
  create,
  delete: deleteRock,
  edit: editRock,
  update: saveEdit,
};

async function saveEdit(req, res) {
    try {

        // console.log('===========================================');
        // console.log('===========================================');
        console.log(req.params.id, ' <------- req.params.id')
        // console.log('+++++++++++++++++++++++++++++++++++++++++++');
        console.log(req.body, ' <------- req.body')
        console.log('===========  SAVE EDIT ===============');

        const rockDoc = await Rock.findById(req.params.id)
        .populate('userId')
        .populate('projectId');    
        console.log(rockDoc, ' <------- rockDoc (BEFORE)')      
    
        rockDoc.title = req.body.title;
        rockDoc.description = req.body.description;
        rockDoc.category = req.body.category;
        rockDoc.priority = req.body.priority;
        rockDoc.difficulty = req.body.difficulty;
        rockDoc.userId = req.body.userId;
        rockDoc.progress = req.body.progress;
        rockDoc.userNote = req.body.userNote;
        // rockDoc.userName = req.body.assignUser.name;
        // rockDoc.userAvatar = req.body.assignUser.avatar;
 
        rockDoc.save(function(err) {
            const rock = Rock.findById(rockDoc._id)
                .populate('userId')
                .populate('projectId');
            const projectDoc = Project.findByIdAndUpdate(rockDoc.projectId._id)
                .populate("userCreated")
                .populate("usersAssigned")
                .populate("projectManager")
                .populate("rocks");

            res.redirect(`/projects/${rockDoc.projectId._id}`)
        })            
    
        
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR ---> ctrl.projects.create')
    }
}

async function editRock(req, res) {
    try {
        const rockCategories = [ 'Team', 'Project', 'Personal', 'Base', 'Other', 'Activity'];
        const rockPriorities = [ 'Urgent', 'High', 'Normal', 'Low'];
        const rangeTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        console.log(req.body, ' REQ BODY')
        
        const userDocs = await User.find({});
        const rockDoc = await Rock.findById(req.params.id)
            .populate("userId")
            .populate("projectId");
            

        res.render('rocks/edit', {
            rock: rockDoc,
            rockCategories,
            rockPriorities,
            userDocs,
            rangeTen
        });
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR ---> ctrl.rocks.editRock')
    }
}

async function deleteRock(req, res) {
    try {
        const rockDoc = await Rock.findByIdAndRemove(req.params.id);

        res.redirect(`/projects/${rockDoc.projectId}`)
    } catch(err) {
        console.log(err);
        res.send('TERMINAL ERROR ---> ctrl.projects.delete')
    }
}

async function create(req, res) {
    try {
        const projectDoc = await Project.findById(req.params.id);

        req.body.userId = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        req.body.projectId = projectDoc._id;
        req.body.complete = false;
        req.body.progress = 0.

        const newRock = await Rock.create(req.body);
        
        const rockDoc = await Rock.findById(newRock._id)
            .populate("userId")
            .populate("projectId");

            projectDoc.rocks.push(rockDoc);
            Project.findById(req.params.id)
                .populate("userCreated")
                .populate("usersAssigned")
                .populate("rocks")
                .exec();
            rockDoc.save( function(err) {
                if (err) return res.send('projectDoc SAve Error rocks controller create');
                projectDoc.save(function(err) {            

                    res.redirect(`/projects/${ req.params.id }`);
                    // res.redirect(`/projects/${ projectDoc.id }`);
                })    
            })        
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR <-- ctrl.rocks.create')
    }
}

