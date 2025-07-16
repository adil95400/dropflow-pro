import json
import re
import uuid
import hashlib
import random
import string
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union
import logging

logger = logging.getLogger(__name__)

def generate_uuid() -> str:
    """Generate a random UUID string."""
    return str(uuid.uuid4())

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_random_string(length: int = 10) -> str:
    """Generate a random string of fixed length."""
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

def format_currency(amount: float, currency: str = "EUR") -> str:
    """Format a number as currency."""
    if currency == "EUR":
        return f"€{amount:.2f}"
    elif currency == "USD":
        return f"${amount:.2f}"
    else:
        return f"{amount:.2f} {currency}"

def calculate_profit_margin(cost: float, price: float) -> float:
    """Calculate profit margin percentage."""
    if cost <= 0:
        return 0
    return ((price - cost) / cost) * 100

def slugify(text: str) -> str:
    """Convert text to slug format."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def parse_csv(csv_content: str) -> List[Dict[str, Any]]:
    """Parse CSV content into a list of dictionaries."""
    lines = csv_content.strip().split('\n')
    headers = [h.strip() for h in lines[0].split(',')]
    
    result = []
    for line in lines[1:]:
        values = line.split(',')
        if len(values) >= len(headers):
            row = {}
            for i, header in enumerate(headers):
                row[header] = values[i].strip()
            result.append(row)
    
    return result

def extract_product_id_from_url(url: str) -> Optional[str]:
    """Extract product ID from various e-commerce URLs."""
    # AliExpress
    ali_patterns = [
        r'/item/(\d+)\.html',
        r'/product/(\d+)\.html',
        r'aliexpress\.com\/i\/(\d+)\.html',
    ]
    for pattern in ali_patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    # Amazon
    amazon_pattern = r'amazon\.[a-z\.]+\/[^\/]+\/dp\/([A-Z0-9]{10})'
    match = re.search(amazon_pattern, url)
    if match:
        return match.group(1)
    
    # eBay
    ebay_pattern = r'ebay\.[a-z\.]+\/itm\/[^\/]+\/(\d+)'
    match = re.search(ebay_pattern, url)
    if match:
        return match.group(1)
    
    return None

def get_tracking_carrier(tracking_number: str) -> Optional[str]:
    """Attempt to identify carrier from tracking number format."""
    if re.match(r'^1Z[0-9A-Z]{16}$', tracking_number):
        return 'UPS'
    elif re.match(r'^[0-9]{12}$', tracking_number):
        return 'FedEx'
    elif re.match(r'^[0-9]{20,22}$', tracking_number):
        return 'USPS'
    elif re.match(r'^[0-9]{10}$', tracking_number):
        return 'DHL'
    elif re.match(r'^[A-Z]{2}[0-9]{9}[A-Z]{2}$', tracking_number):
        return 'Royal Mail'
    elif re.match(r'^[0-9]{13}$', tracking_number):
        return 'Colissimo'
    
    return None

def log_activity(user_id: str, action: str, details: Dict[str, Any]) -> None:
    """Log user activity for audit purposes."""
    try:
        activity = {
            "user_id": user_id,
            "action": action,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "ip_address": "127.0.0.1"  # In a real app, get from request
        }
        logger.info(f"Activity: {json.dumps(activity)}")
        # In a real app, save to database
    except Exception as e:
        logger.error(f"Failed to log activity: {e}")