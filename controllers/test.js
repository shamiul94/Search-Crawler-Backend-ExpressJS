exports.create = async(req, res, next) => {
    const seedLinks = require('../models/SeedLinks');
    const traversedLinks = require('../models/TraversedLinks');

    // seedLinks.hasMany(traversedLinks, { as: 'Traversed_Link', foreignKey: 'sid' });
    // traversedLinks.belongsTo(seedLinks, { as: 'Seed_Link', foreignKey: 'sid' });

    // const errHandler = (err) => {
    //     console.log(err);
    // }

    // const seed = await seedLinks.create({
    //     seedLink: "https://chaldal.com"
    // }).catch(errHandler);

    // const traversed = await traversedLinks.create({
    //     sid: seed.sid,
    //     traversedLink: "https://biis.com",
    //     content: "some random content",
    // }).catch(errHandler);


    // const traversed2 = await traversedLinks.create({
    //     sid: seed.sid,
    //     traversedLink: "https://biis22.com",
    //     content: "some random content",
    // }).catch(errHandler);


    // const ans = await seedLinks.findAll({
    //     include: [{
    //         model: traversedLinks,
    //         as: 'Traversed_Link',
    //         required: true,
    //     }],
    // });

    // const ans = await seedLinks.findAll({
    //     where: {
    //         seedLink: "https://chaldal.com",
    //     },
    //     include: [{
    //         model: traversedLinks,
    //         as: 'Traversed_Link',
    //         required: true,
    //     }],
    // });

    // const ans = await seedLinks.findAll({
    //     where: {
    //         seedLink: "https://chaldal.com",
    //     }
    // });


    console.log(ans);
    res.send(ans);
}