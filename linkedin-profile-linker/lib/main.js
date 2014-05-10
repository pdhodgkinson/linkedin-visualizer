var check = require('check-types'),
    extend = require('node.extend');

var findProjectById = function (obj, projectId) {
        'use strict';
        var project,
            i;
        for (i = 0; i < obj.projects.values.length; i++) {
            project = obj.projects.values[i];
            if (project.id === projectId) {
                return project;
            }
        }
        return null;
    },
    findJobById = function (obj, jobId) {
        'use strict';
        var position,
            i;
        for (i = 0; i < obj.positions.values.length; i++) {
            position = obj.positions.values[i];
            if (position.id === jobId) {
                return position;
            }
        }
        return null;
    },
    findJobByName = function (obj, companyName) {
        'use strict';
        var position,
            i;
        for (i = 0; i < obj.positions.values.length; i++) {
            position = obj.positions.values[i];
            if (check.object(position.company) === true &&
                position.company.name === companyName) {
                return position;
            }
        }
    },
    findProjectByName = function (obj, projectName) {
        'use strict';
        var project,
            i;
        for (i = 0; i < obj.projects.values.length; i++) {
            project = obj.projects.values[i];
            if (project.name === projectName) {
                return project;
            }
        }
        return null;
    };

module.exports = {
    projectConnect: function (obj, theJob, theProject, options) {
        'use strict';
        var project = null,
            job = null;
        
        if (check.number(theJob) === true) {
            job = findJobById(obj, theJob);
        } else {
            job = findJobByName(obj, theJob);
        }
        if (job === null) {
            throw 'Job not found';
        }
        
        if (check.number(theProject) === true) {
            project = findProjectById(obj, theProject);
        } else {
            project = findProjectByName(obj, theProject);
        }
        
        if (project === null) {
            throw 'Project not found';
        }
        
        if (check.not.array(job.projects)) {
            job.projects = [];
        }
        extend(project, options);
        job.projects.push(project);
        
        return obj;
    }
};