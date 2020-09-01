const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    // Busca todos os cadastros no banco e retorna na pagina
    all(callback) {
        db.query(`SELECT * FROM members`, function(err, results) {
            if(err) {
                throw `Database Error! ${err}`
            }
            
            callback(results.rows)
        })
    },

    create(data, callback) {

        const query = `
            INSERT INTO members (
                name,
                avatar_url,
                gender,
                email,
                birth,
                blood,
                weight,
                height,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            date(Date.now()).iso          
        ]
    
        db.query(query, values, (err, results) => {
            if(err) {
                throw `Database Error! ${err}`
            }
            callback(results.rows[0])
        })
    },

    // Procura o id do member
    find(id, callback) {
        db.query(`SELECT * FROM members WHERE id = $1`, [id], function(err, results) {
            if(err) {
                throw `Database Error! ${err}`
            }

            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
            UPDATE members SET
                avatar_url=($1),
                name=($2),
                birth=($3),
                gender=($4),
                email=($5),
                blood=($6),
                weight=($7),
                height=($8)        
            WHERE id = $9
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.email,
            data.blood,
            data.weight,
            data.height,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) {
                throw `Database Error! ${err}`
            }

            callback()
        })
    },

    delete(id, callback) {
        db.query(`DELETE FROM members WHERE id = $1`, [id], 
        function(err, results) {
            if(err) {
                throw `Database Error! ${err}`
            }
            return callback()
        })
    }

}