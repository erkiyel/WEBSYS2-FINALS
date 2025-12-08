require('dotenv').config();
const { Client } = require('pg');

console.log('Testing Supabase Session Pooler Connection...\n');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Password:', process.env.DB_PASSWORD ? '******' : 'Not set');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

async function test() {
  try {
    console.log('\n🔗 Connecting...');
    await client.connect();
    console.log('✅ SUCCESS! Connected to Supabase via Session Pooler');
    
    // Test version
    const versionRes = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', versionRes.rows[0].version.split(',')[0]);
    
    // Test current user
    const userRes = await client.query('SELECT current_user, current_database()');
    console.log('👤 Current User:', userRes.rows[0].current_user);
    console.log('🗄️  Current Database:', userRes.rows[0].current_database);
    
    // List tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`\n📋 Tables (${tablesRes.rows.length}):`);
    if (tablesRes.rows.length === 0) {
      console.log('   No tables found. You need to run the SQL in Supabase first!');
    } else {
      tablesRes.rows.forEach(t => console.log(`   • ${t.table_name}`));
    }
    
    await client.end();
    console.log('\n🎉 All tests passed! Your connection is working.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  Wrong username or password!');
      console.log('Make sure:');
      console.log('1. Username is: postgres.spmqfeyajqdhgwanaqzw');
      console.log('2. Password is correct');
      console.log('3. You have access to the database');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n⚠️  Host not found. Check your hostname.');
    } else {
      console.log('\n🔧 Error details:', error);
    }
    
    process.exit(1);
  }
}

test();