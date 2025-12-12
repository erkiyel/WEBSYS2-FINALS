require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

// If a DATABASE_URL is provided (e.g. Supabase Postgres), use it with postgres dialect
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        // Supabase uses a managed Postgres with TLS; do not reject unauthorized in many dev setups
        rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== 'false'
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Fallback to MySQL (original configuration)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'scrollshopdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    // If using Postgres, ensure serial sequences are in sync with current max ids.
    (async () => {
      try {
        if (sequelize.getDialect && sequelize.getDialect() === 'postgres') {
          // First try the common Orders table variants (quick path)
          const attempts = [
            `SELECT setval(pg_get_serial_sequence('orders','order_id'), COALESCE(MAX(order_id),0)+1, false) FROM orders;`,
            `SELECT setval(pg_get_serial_sequence('"Orders"','order_id'), COALESCE(MAX(order_id),0)+1, false) FROM "Orders";`
          ];

          for (const sql of attempts) {
            try {
              await sequelize.query(sql);
              console.log('Synchronized order_id sequence using:', sql.split('\n')[0]);
              break;
            } catch (e) {
              // ignore and try next variant
            }
          }

          // General case: find all columns with nextval() defaults (serial/identity) and sync their sequences
          try {
            const seqCols = await sequelize.query(
              `SELECT table_schema, table_name, column_name, column_default
               FROM information_schema.columns
               WHERE column_default LIKE 'nextval(%' AND table_schema = 'public';`,
              { type: sequelize.QueryTypes.SELECT }
            );

            for (const row of seqCols) {
              const { table_schema, table_name, column_name, column_default } = row;
              const m = /nextval\('"?([^"']+)"?'::regclass\)/.exec(column_default);
              // Try multiple pg_get_serial_sequence variants to be robust to naming/casing differences
              const candidates = [
                `pg_get_serial_sequence('${table_name}','${column_name}')`,
                `pg_get_serial_sequence('"${table_name}"','${column_name}')`,
                `pg_get_serial_sequence('public."${table_name}"','${column_name}')`
              ];
              let synced = false;
              for (const cand of candidates) {
                try {
                  const setSql = `SELECT setval(${cand}, COALESCE((SELECT MAX("${column_name}") FROM "${table_name}"),0)+1, false);`;
                  await sequelize.query(setSql);
                  console.log(`Synchronized sequence for ${table_name}.${column_name} using ${cand}`);
                  synced = true;
                  break;
                } catch (e) {
                  // try next candidate
                }
              }
              if (!synced && m && m[1]) {
                const seqName = m[1];
                try {
                  const setSql = `SELECT setval('${seqName}', COALESCE((SELECT MAX("${column_name}") FROM "${table_name}"),0)+1, false);`;
                  await sequelize.query(setSql);
                  console.log(`Synchronized sequence ${seqName} for ${table_name}.${column_name}`);
                } catch (e) {
                  console.warn(`Failed to set sequence ${seqName} for ${table_name}.${column_name}:`, e.message || e);
                }
              }
            }
          } catch (e) {
            console.warn('Failed to auto-detect serial columns for sequence sync:', e.message || e);
          }
        }
      } catch (err) {
        console.error('Failed to synchronize sequences:', err);
      }
    })();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;