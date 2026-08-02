from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import dns.resolver

# Force dnspython to use Google's DNS to prevent local router DNS timeouts
try:
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4']
except Exception:
    pass

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://Abhishekgangji:Abhishek123@cluster0.hmxyswd.mongodb.net/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "Example")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def connect_to_mongo():
    try:
        db_config.client = AsyncIOMotorClient(MONGODB_URL)
        db_config.db = db_config.client[DATABASE_NAME]
        print(f"Connected to MongoDB database: {DATABASE_NAME}")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    if db_config.client:
        db_config.client.close()
        print("Closed MongoDB connection.")

def get_db():
    return db_config.db
