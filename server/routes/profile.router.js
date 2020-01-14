const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
    pool.query('SELECT * FROM "user" WHERE "id"=$1', [req.user.user_id])
        .then(result => {
            res.send(result.rows[0]);
        }).catch(error => {
            res.sendStatus(500);
            console.log(error);
        });
});

router.put('/', rejectUnauthenticated, (req, res) => {
    const acceptedKeys = ['full_name', 'company', 'location', 'avatar_url', 'email', 'status'];
    const config = [];
    const sets = req.body.keys().filter(key => acceptedKeys.includes(key)).map((key, i) => {
        config.push(req.body.key);
        return `${key}=$${i+1}`
    }).join(', ');
    if(config.length > 0){
        const query = `UPDATE "user" SET ${sets} WHERE "user_id"=${config.length}`;
        config.push(req.user.user_id);
        pool.query(query, config).then(results => {
            res.sendStatus(200);
        }).catch(error => {
            res.sendStatus(500);
        });
    }
    res.sendStatus(200);
});

module.exports = router;