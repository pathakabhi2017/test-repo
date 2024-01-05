const express = require("express");
const moment = require("moment/moment");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const Categories = require("../models/Categories");
const Questions = require("../models/Ques")

router.post("/addcategory", async (req, res) => {
    try {
        const categories = new Categories({
            name: req.body.name,
            status: req.body.status,
        });

        var category = await Categories.findOne({ name: req.body.name });
        if (category) {
            res.json({ "response_msg": "duplicate_data" });
        }
        else {
            const savecates = await categories.save();
            if (savecates._id) {
                res.json({ "response_msg": "success" });
            }
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

// ROUTE 3 : Update an existing ques using : PUT "/api/ques/updateques/:id" .Login required
router.put("/updatecat/:id", fetchuser, async (req, res) => {

    //Find the ques to be updated and update it
    try {
        var categories = await Categories.findById(req.params.id);
        if (!categories) {
            res.status(404).send("Not Found");
        }
        // var category = await Categories.findOne({ name: req.body.name });
        // if (category) {
        //     res.json({ "response_msg": "duplicate_data" });
        // } else {

        categories = await Categories.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                status: req.body.status,
            },
            { new: true }
        );
        res.json({ categories });
        //}

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 1 : Get All the Ques using : GET "/api/ques/getuser" .Login required
router.get("/fetchallcategoriesactive", async (req, res) => {
    try {
        let no = 0;
        //const result = await Exam.find();
        const result = await Categories.aggregate([
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "category",
                    as: "catecount",
                }
            }

        ])

        //console.log(result)
        const categoriesdata = result.map((res) => {
            no++;
            return {
                no: no,
                id: res._id,
                name: res.name,
                questions_total: res.catecount.length,
                status: res.status,
                date: moment(res.date).format('DD-MM-YYYY'),
            }

        })

        categoriesdata: categoriesdata,

            res.status(200).send({
                success: true,
                categories: categoriesdata,
            });
    }


    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 1 : Get All the Ques using : GET "/api/ques/getuser" .Login required
router.get("/fetchallcategories", async (req, res) => {

    try {
        let no = 0;
        //const result = await Exam.find();
        const result = await Categories.find({}).sort({ date: -1 });

        const categoriesdata = result.map((res) => {
            no++;
            return {
                no: no,
                id: res._id,
                name: res.name,
                status: res.status,
                date: moment(res.date).format('DD-MM-YYYY'),
            }
        })

        categoriesdata: categoriesdata,

            res.status(200).send({
                success: true,
                categories: categoriesdata,
            });
    }


    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4 : Delete an existing ques using : DELETE "/api/quess/deleteQues/:id" .Login required
router.delete("/deleteCates/:id", fetchuser, async (req, res) => {
    //Find the ques to be deleted and delete it
    try {

        let cates = await Categories.findById(req.params.id);
        if (!cates) {
            res.status(404).send({
                "status": "error",
                "error": {
                    "code": "Category_not_found",
                    "message": "Category not found"
                }
            });
        }

        let Cateques = await Questions.find({ category: req.params.id })

        if (Cateques != '') {
            // res.status(203).send("Cannot delete category. The category is associated with existing questions. Please remove or reassign the questions before attempting to delete the category.")
            res.status(201).send({
                "status": "error",
                "error": {
                    "code": "Category_dependency",
                    "message": "Cannot delete category. The category is associated with existing questions. Please remove or reassign the questions before attempting to delete the category."
                }
            }

            )
        }
        else {
            cates = await Categories.findByIdAndDelete(req.params.id);
            //res.json({ success: 'true' });
            res.status(200).send({
                "status": "success",
                "data": {
                    "code": "success",
                    "message": "Category deleted successfully."
                }
            })
        }
    } catch (error) {

        res.status(500).send({
            "status": "error",
            "error": {
                "code": "internal server error",
                "message": "Internal Server Error"
            }
        });
    }
});


router.post("/fetchcategoriesByStatus", async (req, res) => {

    try {
        let no = 0;
        //const result = await Exam.find();
        const result = await Categories.find({ status: req.body.status });

        const categoriesdata = result.map((res) => {
            no++;
            return {
                no: no,
                id: res._id,
                name: res.name,
                status: res.status,
                date: moment(res.date).format('DD-MM-YYYY'),
            }
        })
        //console.log(categoriesdata)
        categoriesdata: categoriesdata,

            res.status(200).send({
                success: true,
                categories: categoriesdata,
            });
    }


    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;