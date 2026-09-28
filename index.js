import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";

/* express and port declartaion */
const app = express();
const port = 3000;

/* set view enginer for ejs */
app.set("view engine", "ejs");

/* middleware */
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan("tiny"));
app.use(express.static("public"));

/* request handlers */
app.get("/", (req, res) => {
    res.render("index.ejs", {
        title: "Drink Search Homepage"
    });
});

/* per random cocktail drink search submission  */
app.post("/submit", async (req, res) => {
    try {
        /* get response from axios */
        const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        /* store first json object */
        const result = response.data.drinks[0];
        /* render the data into the main page*/
        res.render("index.ejs", {
            data: result,
            title: "Drink Search Homepage"
        });
    } catch (error) {
        /* handle request errors */
        console.error("Failed to make request:", error.message);
        res.status(500).send("Failed to fetch activity. Please try again.");
        res.redirect("/");
    }
});

/* page not found error handler */
app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});

/* listen on designated port */
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});