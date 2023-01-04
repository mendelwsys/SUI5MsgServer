const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const express = require("express");
// const db = new sqlite3.Database(':memory:');

const dbfile = __dirname+'\\msg.dbl';
const db = new sqlite3.Database(dbfile);

const sqlSelect = "SELECT id, owner,topic,msg,status FROM msgtab";

const sqlUpdate =  "UPDATE msgtab SET owner=?,topic=?,msg=?,status=\"_new\" WHERE id=?";
const sqlDel    =  "DELETE FROM msgtab WHERE id IN ";

const sqlInsert = "INSERT INTO msgtab(owner,topic,msg,status) VALUES (?,?,?,?)";
const sqlCreateTable = "CREATE TABLE msgtab (id INTEGER PRIMARY KEY AUTOINCREMENT, owner TEXT,topic TEXT,msg TEXT,status TEXT)";



let initDb=function()
{
    if (!fs.existsSync(dbfile))
    {
        db.run(sqlCreateTable);
        // let stmt = db.prepare(sqlInsert);
        // for (let i = 0; i < 3; i++)
        //     newMessage({owner: "vlad", topic: "msg", msg: "payMe"}, stmt)
        // stmt.finalize();
    }
}

let newMessage=function(msg,stmt)
{
    // const stmt = db.prepare("INSERT INTO msgtab(owner,topic,msg,status) VALUES (?,?,?,?)");{
        let res = stmt.run(msg.owner, msg.topic, msg.msg, "_new"
            ,
            function (err) {
                if (null == err) {
                    // row inserted successfully'
                    msg.id = this.lastID;
                    console.log("was add with id:"+this.lastID);
                } else {
                    //Oops something went wrong
                    console.log(err);
                }
            }
        );
        // console.log("1:" + msg);
}

    db.serialize(() => {
        initDb();
    });

    const app = express();
    const port = 3001;

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // app.use(express.static('C:/PapaWK/Programm/apache-tomcat-9.0.70/webapps/'));
    app.use(express.static(__dirname));


// console.log(__dirname)


    app.listen(port, () => {
        console.log("Application started and Listening on port:" + port);
    });

    app.use(express.static(__dirname));

//    const data = fs.readFileSync(__dirname + "/answer.html", 'utf8');

    app.get("/api/getmsgs", (req, res) => {

        db.serialize(() => {
            db.all(sqlSelect, (err, rows) => {
                res.send(rows)
            });
        });
    });

    app.post("/api/getmsgs", (req, res) => {

        db.serialize(() => {
            db.all(sqlSelect, (err, rows) => {
                res.send(rows)
            });
        });
    });

    app.post("/api/sendmsg", (req, res) => {

        db.serialize(() => {
            try {
                let stmt = db.prepare(sqlInsert);
                let msg = req.body;
                if (msg && msg.owner)
                    newMessage(msg, stmt)
                stmt.finalize();
                db.all(sqlSelect, (err, rows) => {
                    res.send(rows)
                });
            } catch (e) {
                console.log(e);
            }
        });
    });

    app.post("/api/updmsgs", (req, res) => {

        db.serialize(() => {
            try {
                let msgs = req.body;
                let stmt = db.prepare(sqlUpdate);
                for (let msg of msgs)
                    stmt.run(msg.owner, msg.topic, msg.msg, msg.id)
                stmt.finalize();
                db.all(sqlSelect, (err, rows) => {
                    res.send(rows)
                });
            } catch (e) {
                console.log(e);
            }
        });
    });

    app.post("/api/delmsgs", (req, res) => {

        db.serialize(() => {
            try {
                let msgs = req.body;
                if (msgs && msgs.length>0)
                {
                    let ixes=msgs.reduce((res,el)=>{
                        return  res.length > 0 ? (res + ',' + el.id) : (res + el.id);
                    },'');
                    db.run(sqlDel+'('+ixes+')');
                }
                db.all(sqlSelect, (err, rows) => {
                    res.send(rows)
                });
            } catch (e) {
                console.log(e);
            }
        });
    });

// db.close();