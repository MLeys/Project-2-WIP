
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
        // console.log(req.params.id, ' <------- req.params.id')
        // console.log('+++++++++++++++++++++++++++++++++++++++++++');
        console.log(req.body, ' <------- req.body')
        console.log('===========  SAVE EDIT ===============');
        
        const rockDoc = await Rock.findById(req.params.id)
            .populate("userId")
            .populate("projectId")
            .exec();
    
        rockDoc.title = req.body.title;
        rockDoc.description = req.body.description;
        rockDoc.category = req.body.category;
        rockDoc.priority = req.body.priority;
        rockDoc.difficulty = req.body.difficulty;
        rockDoc.userName = req.body.userName;
        rockDoc.userId = req.user._id;
        console.log('+++++++++++++++++++++++++++++++++++++++++++');
        console.log(rockDoc, ' <------- rockDoc ()')
        // const projectDoc = await Project.findById(rockDoc.projectId.id).exec();

        
        console.log(rockDoc, '<-- rockDoc SAVING ')
        rockDoc.save(function(err) {
            res.redirect(`/projects/${rockDoc.projectId._id}`)
        })            
        
        
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR ---> ctrl.projects.create')
    }
}

async function editRock(req, res) {
    try {

        console.log('===========  EDIT ROCK ===============');
        const rockDoc = await Rock.findById(req.params.id)
            .populate("userId")
            .populate("projectId")
            .exec();


        res.render('rocks/edit', {rock: rockDoc});
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR ---> ctrl.rocks.editRock')
    }
}

async function deleteRock(req, res) {
    try {
        console.log(req.params.id, 'deleteRock +++++++ req.params.id')
        const rockDoc = await Rock.findByIdAndDelete(req.params.id);

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

            projectDoc.save(function(err) {            

                res.redirect(`/projects/${ req.params.id }`);
                // res.redirect(`/projects/${ projectDoc.id }`);
            })    
            rockDoc.save( function(err) {
                if (err) return res.send('projectDoc SAve Error rocks controller create');
                
   
            })        
    } catch(err) {
        console.log(err);
        console.log('TERMINAL ERROR <-- ctrl.rocks.create')
    }
}

