/*
 * GET home page.
 */

exports.index = function (req, res) {
    console.log('Index route');
    if (req.linkedInOAuth !== undefined) {
        console.log('Authenticated route');
        res.render('selector', {title: 'Fetch LinkedIn Details',
            apis: [
                {
                    endpoint: 'people',
                    title: 'People API',
                    params: [
                        'id',
                        'first-name',
                        'last-name',
                        'headline',
                        'picture-url',
                        'summary',
                        'specialties',
                        'positions',
                        'recommendations-received',
                        'skills',
                        'site-standard-profile-request',
                        'api-standard-profile-request:(url)',
                        'public-profile-url'
                    ]
                },
                {
                    endpoint: 'full',
                    title: 'Fetch All User Info API',
                    params: []
                }
            ]
        });

    } else {
        res.render('index', { title: 'Express' });
    }

};