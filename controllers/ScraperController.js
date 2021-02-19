var request = require("request");
const fs = require('fs');
var pretty = require('pretty');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Promise = require('promise');


const cheerio = require('cheerio');
const { htmlToText } = require('html-to-text');


var extractGoogleSearchResultLinks = (rawHTML) => {
    const dom = new JSDOM(rawHTML);
    var p_elements = dom.window.document.querySelectorAll("h3");

    var links = [];
    for (var p_element of p_elements) {
        try {
            var link = p_element.parentNode.getAttribute("href").split("/url?q=")[1].split('&')[0];
            links.push(link);
        } catch (e) {}
    }

    return links;
}



var getJsonText = (htmlObj) => {
    var reg = /(\[.*?\])/gi;

    const text = htmlToText(htmlObj.body, {
        wordwrap: 130
    }).replace(reg, "").replace("\n", "");

    return {
        link: htmlObj.link,
        text: text
    };
}


var getGoogleLinkToSearch = (text, searchNoStart) => {
    var searchPrefix = "https://www.google.com/search?q=";
    var searchText = text.split(" ").join("+");
    var searchStringTotal = searchPrefix + searchText + "&start=" + searchNoStart.toString();
    return searchStringTotal;
};


var extractCompanyNameFromURL = (link) => {
    var companyName = link.split('.com')[0].split("\/").slice(-1)[0].split(".").slice(-1)[0];
    console.log(companyName);
    return companyName;
};

var fetchPageFromURL = (link) => {
    return new Promise((resolve, reject) => {
        request({ uri: link },
            function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
    });
}

// this method fetches a single page turned into object from url
var fetchPageObjectFromURL = (link) => {
    return new Promise((resolve, reject) => {
        request({ uri: link },
            function(error, response, body) {
                if (error) {
                    resolve(error); // should be reject but replaced with resolve to avoid 404 errors
                } else {
                    resolve({
                        "link": link,
                        "body": body
                    });
                }
            });
    });
}

// this method fetches all the data from all the links from a list

var fetchMultipleLinkData = (linkList) => {
    return new Promise((resolve, reject) => {
        var promises = [];

        for (var link of linkList) {
            promises.push(fetchPageObjectFromURL(link));
        }

        Promise.all(promises).then(collectedArticlesArr => {
            var objectArr = [];

            for (var htmlObj of collectedArticlesArr) {
                objectArr.push(getJsonText(htmlObj));
            }

            resolve(objectArr);
        }).catch(err => {
            reject(err);
        });
    });
}

// this function scrapes a signle page from google search result. it can be 1st, 2nd or any other page based on the startFromIndex value. 
var startScraping = (selectedSeed, startFromIndex) => {
    return new Promise((resolve, reject) => {
        try {
            // call a search on google
            fetchPageFromURL(getGoogleLinkToSearch(selectedSeed, startFromIndex))
                .then((initGoogleSearchResponse) => {

                    // comment out this part after unbanning
                    // console.log("in startScraping ==> ", initGoogleSearchResponse);
                    var resultedLinks = extractGoogleSearchResultLinks(initGoogleSearchResponse);


                    // var resultedLinks = [
                    //     'https://pathao.com/',
                    //     'https://pathao.com/bn/',
                    //     'https://play.google.com/store/apps/details%3Fid%3Dcom.pathao.user%26hl%3Dbn%26gl%3DUS',
                    //     'https://bn.wikipedia.org/wiki/%25E0%25A6%25AA%25E0%25A6%25BE%25E0%25A6%25A0%25E0%25A6%25BE%25E0%25A6%2593',
                    //     'https://en.wikipedia.org/wiki/Pathao',
                    //     'https://www.facebook.com/pathaobd/',
                    //     'https://www.facebook.com/pathaonpl/',
                    //     'https://apps.apple.com/us/app/pathao/id1201700952',
                    //     'https://bd.linkedin.com/company/pathao'
                    // ];

                    // console.log(resultedLinks);

                    return resultedLinks;

                }).then((resultedLinks) => {
                    console.log("2nd response is ==> ", resultedLinks);

                    fetchMultipleLinkData(resultedLinks).then((objectArr) => {
                        // console.log("in 3rd then response ==> arr length is --> ", collectedArticlesArr);
                        console.log("success in fetchMultipleLinkData", objectArr.length);

                        resolve(objectArr);
                    });
                }).catch(e => {
                    console.log("error in startscraping ==> ", e);
                    resolve(e); // should be reject but replaced with resolve to avoid 404 errors
                }).finally(() => {
                    console.log("reached FINALLY of startScraping function");
                });
        } catch (e) {
            console.log("error in try-catch of startScraping", e);
            resolve(e); // should be reject but replaced with resolve to avoid 404 errors
        }
    });
}


exports.scraper = async(req, res, next) => {
    // link = "https://pathao.com/?lang=en";
    console.log('paisi');
    var link = decodeURIComponent(req.params.url);

    ///////////////////////////////////
    const seedLinks = require('../models/SeedLinks');
    const traversedLinks = require('../models/TraversedLinks');

    seedLinks.hasMany(traversedLinks, { foreignKey: 'sid' });
    traversedLinks.belongsTo(seedLinks, { foreignKey: 'sid' });


    const errHandler = (err) => {
        console.log(err);
    }

    const checkRepeatedLink = await seedLinks.findAll({
        where: {
            seedLink: link,
        }
    });

    if (checkRepeatedLink.length != 0) {

        // console.log("length 0 pai nai ==> ", checkRepeatedLink);
        // was searched before 
        const ans = await seedLinks.findAll({
            where: {
                seedLink: link,
            },
            include: [{
                model: traversedLinks,
                required: true,
            }],
        });

        console.log(ans)

        var ret = [];
        for (var temp of ans[0].TraversedLinks) {
            ret.push({
                link: temp.traversedLink,
                body: temp.content,
            })
        }
        res.json(ret);
    } else {
        // was never searched before
        var companyName = extractCompanyNameFromURL(link);
        console.log(link);

        var promise1 = startScraping(companyName, 0);
        var promise2 = startScraping(companyName, 10);

        Promise.all([promise1, promise2]).then(async multiPageObjectArr => {

            var combinedArr = [];
            for (var arr of multiPageObjectArr) {
                combinedArr.push(...arr);
            }

            // insert in DB
            const insertSeedLink = await seedLinks.create({
                seedLink: link
            }).catch(errHandler);

            for (var obj of combinedArr) {
                const insertTraversedLink = await traversedLinks.create({
                    sid: insertSeedLink.sid,
                    traversedLink: obj.link,
                    content: obj.text,
                }).catch(errHandler);
            }

            console.log(combinedArr.length);

            res.json(combinedArr);

        }).catch(e => {
            res.json({
                "message": "There was an error : " + e,
            })
        });
    }
}