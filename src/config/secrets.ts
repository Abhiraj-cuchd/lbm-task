import dotenv from 'dotenv';
dotenv.config();
const _config = {
    node_env: process.env.NODE_ENV,
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT
};

Object.freeze(_config);

export default _config;
