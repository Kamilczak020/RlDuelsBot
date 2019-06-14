export function readinessHealthcheck(database, res) {
  database.sequelize.query('SELECT 1').then(() => {
    res.send(200);
  }).catch((err) => {
    res.send(500);
  });
}
