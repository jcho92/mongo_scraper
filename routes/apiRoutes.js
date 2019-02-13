
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        // db.Article.remove({})
        //     .then(function () {
        //         console.log("removed database")
        //     })

        // First, we grab the body of the html with axios
        axios.get("https://www.echojs.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            var result = [];
            console.log($.children)
            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function (i, element) {
                // Save an empty result object
                console.log($(this).children("h2").text())
                console.log($(this).attr("data-news-id"))

                var data = {
                    title: $(this).children("h2").text(),
                    link: $(this).children("h2").children("a").attr("href"),
                    id: $(this).attr("data-news-id")
                }
                result.push(data)
            });
            res.render("index", {
                story: result
            });


        });
        // Send a message to the client

    });
    // api to grab all the articles 
    app.post("/update", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ id: req.body.id })
            .then(function (data) {

                if (data == "") {
                    console.log("data doesnt exist adding to database")
                    db.Article.create(req.body)
                        .then(function (dbArticle) {
                            console.log(dbArticle)
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            res.json(err);
                        });

                }
                else {
                    console.log("already exists")
                }

            })
    });

    // api to create the saved articles

    //api to search the database for correct the correct article
    app.get("/article/", function (req, res) {
        db.Article.find({})
            .then(function (dbdata) {
                res.render("saved", {
                    data: dbdata
                })
                console.log(dbdata)
            }).catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/article/:id", function (req, res) {
        db.Article.find({ id: req.params.id })
            .then(function (updateData) {
                res.send(updateData)
                console.log(updateData)
            })
    })

    app.post("/article/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log(dbNote)
                // console.log(dbNote.body)
                console.log(req.params.id)
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ id: req.params.id }, { note: dbNote.id }, { new: true });
            })
            .then(function (dbArticle) {
                console.log(dbArticle)
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // finds all the notes
    app.get("/notes", function (req, res) {
        db.Note.find({})
            .then(function (dbNote) {
               res.json(dbNote)
            })
    })
    // finds a specific note based on the id
    app.get("/notes/:id", function(req, res){
        db.Note.find({id:req.params.id})
            .then(function(dbNote){
                res.send(dbNote)
            })
    })

    // clears all the notes
    app.get("/clearnote", function (req, res) {
        db.Note.remove({})
            .then(function (dbdata) {
                console.log(dbdata)
            })
    })

    app.get("/clear", function (req, res) {
        db.Article.remove({})
            .then(function (dbdata) {
                console.log(dbdata)
            })
    })

    app.get("/delete/:id", function(req, res){
        db.Note.findOneAndDelete({_id:req.params.id})
        .then(function(noteData){
           res.json(noteData)

        })
    })


}