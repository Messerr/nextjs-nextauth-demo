import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://david:UiqLkwKwOUNDkt9A@cluster0.omsrecw.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client;
}


