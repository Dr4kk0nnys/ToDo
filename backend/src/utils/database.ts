import { MongoClient, Db } from 'mongodb';

/* Interfaces */
import IDatabaseCollections from '../interfaces/DatabaseCollections';
import IRegisterUser from '../interfaces/RegisterUser';


class Database {
    client: MongoClient;
    database: Db;
    collections: IDatabaseCollections;

    constructor() {
        this.client = new MongoClient(process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        this.controller();
    }

    private async controller() {
        /**
            * The .catch will only be called if there's an exception.
            * Note that the "Connected to the database." message has a color to it.
                * It doesn't affect the code, only displays the message in green.
        **/
        await this.connect().catch((e) => console.log('\x1b[31m%s\x1b[0m', 'Error while trying to connect to the database.\n' + e));
        console.log('\x1b[32m%s\x1b[0m', 'Connected to the database.');

        /**
            * The database will be responsible for every collection.
            * The collections will then be responsible for every amount of data in the collection itself.
            * A collection containing multiple registered users will only be responsible for the registered users.
        **/
        this.database = this.client.db(process.env.DATABASE_NAME);

        this.collections = {
            /**
                * RegisteredUsers will be the collection containing all users of the website.
                * If a user is registered on the website it will be inside this collection.
                * If a user registers on the website it will be added on this collection.
            **/
            registeredUsers: this.database.collection(process.env.REGISTERED_USERS_NAME),

            /**
                * ToDos will be the collection containing all tasks of the website.
                * It will identify it's owner by the id of the user.
                * It will contain only the title of the todo and it's deadline.
            **/
            toDos: this.database.collection('toDos')
        }
    }

    private connect = async () => this.client.isConnected() ? console.log('Already Connected!') : await this.client.connect();
    
    isEmailAlreadyRegistered = async (email: string) => await this.collections.registeredUsers.findOne({ email });

    insertUser = async ({ email, password }: IRegisterUser) => await this.collections.registeredUsers.insertOne({ email, password, sessionId: '' });

    addSession = async (email: string, sessionId: string) => await this.collections.registeredUsers.updateOne({ email }, { $set: { sessionId } });
}

export default Database;