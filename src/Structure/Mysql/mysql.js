module.exports = (bot) => {
    const mysql = require('mysql');
    
    var db_config = {
        host: bot.config.BDD.host,
        password: bot.config.BDD.password,
        user: bot.config.BDD.user,
        database: bot.config.BDD.database,
        charset: 'utf8mb4'
    }
      
    bot.db = mysql.createPool(db_config);
      
    bot.db.getConnection(function(err, con) {
        if(err) {
            con.release();
        }
        console.log('\x1b[33m' + 'Connectés à la base de données ' + '\x1b[35m' + db_config.database + '\x1b[33m' + ' !')
    })
}