import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from bson import ObjectId

# MongoDB connection settings
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "globalnepali"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Clear existing data
    await db.users.delete_many({})
    await db.events.delete_many({})
    await db.articles.delete_many({})
    await db.volunteer_opportunities.delete_many({})
    await db.sponsors.delete_many({})

    # Create admin user
    admin_id = ObjectId()
    admin_user = {
        "_id": admin_id,
        "email": "admin@globalnepali.org",
        "hashed_password": pwd_context.hash("admin123"),
        "full_name": "Admin User",
        "role": "admin",
        "disabled": False,
        "created_at": datetime.utcnow(),
    }
    await db.users.insert_one(admin_user)

    # Create regular users
    user_ids = []
    for i in range(5):
        user_id = ObjectId()
        user = {
            "_id": user_id,
            "email": f"user{i+1}@example.com",
            "hashed_password": pwd_context.hash(f"password{i+1}"),
            "full_name": f"User {i+1}",
            "role": "user",
            "disabled": False,
            "created_at": datetime.utcnow(),
        }
        await db.users.insert_one(user)
        user_ids.append(user_id)

    # Create events
    event_categories = ["Cultural", "Educational", "Social", "Professional"]
    for i in range(10):
        event = {
            "title": f"Event {i+1}",
            "description": f"Description for Event {i+1}",
            "date": (datetime.utcnow() + timedelta(days=i*7)).strftime("%Y-%m-%d"),
            "time": "18:00",
            "location": "San Francisco, CA",
            "capacity": 50,
            "category": event_categories[i % len(event_categories)],
            "registered_count": 0,
            "registered_users": [],
            "status": "upcoming",
            "created_at": datetime.utcnow(),
            "created_by": admin_id,
        }
        await db.events.insert_one(event)

    # Create articles
    article_tags = ["Culture", "Community", "Education", "Technology"]
    for i in range(10):
        article = {
            "title": f"Article {i+1}",
            "excerpt": f"Excerpt for Article {i+1}",
            "content": f"Content for Article {i+1}...",
            "image_url": f"https://picsum.photos/800/400?random={i+1}",
            "tags": [article_tags[i % len(article_tags)]],
            "author": {
                "id": admin_id,
                "name": admin_user["full_name"],
                "avatar": "",
            },
            "published_at": datetime.utcnow() - timedelta(days=i),
            "likes_count": 0,
            "views_count": 0,
            "comments_count": 0,
            "liked_by": [],
            "status": "published",
            "created_at": datetime.utcnow() - timedelta(days=i),
        }
        await db.articles.insert_one(article)

    # Create volunteer opportunities
    opportunity_categories = ["Teaching", "Event Planning", "Technical", "Community Service"]
    for i in range(5):
        opportunity = {
            "title": f"Volunteer Opportunity {i+1}",
            "description": f"Description for Opportunity {i+1}",
            "requirements": ["Requirement 1", "Requirement 2"],
            "location": "San Francisco Bay Area",
            "commitment": "5 hours per week",
            "category": opportunity_categories[i % len(opportunity_categories)],
            "contact": {
                "name": "Contact Person",
                "email": "contact@globalnepali.org",
                "phone": "123-456-7890"
            },
            "status": "active",
            "applicants": [],
            "created_at": datetime.utcnow(),
            "created_by": admin_id,
        }
        await db.volunteer_opportunities.insert_one(opportunity)

    # Create sponsors
    sponsor_tiers = ["Platinum", "Gold", "Silver", "Bronze"]
    for i in range(4):
        sponsor = {
            "name": f"Sponsor {i+1}",
            "description": f"Description for Sponsor {i+1}",
            "logo_url": f"https://picsum.photos/200/100?random={i+1}",
            "website_url": "https://example.com",
            "tier": sponsor_tiers[i],
            "contact": {
                "name": "Sponsor Contact",
                "email": "sponsor@example.com",
                "phone": "123-456-7890"
            },
            "status": "active",
            "created_at": datetime.utcnow(),
            "created_by": admin_id,
        }
        await db.sponsors.insert_one(sponsor)

    print("Seed data created successfully!")
    await client.close()

if __name__ == "__main__":
    asyncio.run(seed_data()) 