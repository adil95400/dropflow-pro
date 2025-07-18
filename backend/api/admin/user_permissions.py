from fastapi import APIRouter, Request
from supabase import create_client, Client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/admin/user-permissions")
def get_permissions():
    res = supabase.table("user_permissions").select("*, users(email)").execute()
    return [{ "email": r["users"]["email"], "can_import_product": r["can_import_product"], "can_import_reviews": r["can_import_reviews"], "user_id": r["user_id"] } for r in res.data]

@router.post("/admin/user-permissions")
async def update_permissions(req: Request):
    updates = await req.json()
    for u in updates:
        supabase.table("user_permissions").update({
            "can_import_product": u["can_import_product"],
            "can_import_reviews": u["can_import_reviews"]
        }).eq("user_id", u["user_id"]).execute()
    return {"status": "ok"}