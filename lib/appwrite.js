import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aayush.Aora',
    projectId: '66bcf533002b44b69180',
    databaseId: '66bcf6da0010679ef52f',
    userCollectionId: '66bcf7030002c6e92d07',
    videoCollectionId: '66bcf73b002fc432279c',
    storageId: '66bcf8d70038dce0d510'
}

const { 
    endpoint, 
    platform, 
    projectId, 
    databaseId, 
    userCollectionId, 
    videoCollectionId, 
    storageId 
} = config;


const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) 
    .setPlatform(config.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(), 
            email,
            password,
            username
        )

        if(!newAccount){
            throw new Error('Account not created');
        }

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;

    } catch(error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async(email, password) =>{
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;

    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount){
            throw new Error('No account found');
        }

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser){
            throw new Error('No user found');
        }

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}