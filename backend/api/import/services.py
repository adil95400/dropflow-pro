from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, BinaryIO
import uuid
import csv
import json
import xml.etree.ElementTree as ET
import io
import logging
import base64
from datetime import datetime, timedelta
import requests
from PIL import Image

from . import models, schemas
from ..products.models import Product
from ..products.services import create_product, update_product
from ..seo.services import optimize_product_seo
from ...utils import extract_product_id_from_url

# Import API clients
from ...clients.aliexpress import AliExpressClient
from ...clients.bigbuy import BigBuyClient
from ...clients.eprolo import EproloClient
from ...clients.printify import PrintifyClient
from ...clients.spocket import SpocketClient
from ...clients.vision import VisionClient

logger = logging.getLogger(__name__)

# Create API clients
aliexpress_client = AliExpressClient()
bigbuy_client = BigBuyClient()
eprolo_client = EproloClient()
printify_client = PrintifyClient()
spocket_client = SpocketClient()
vision_client = VisionClient()

def create_import_batch(
    db: Session, 
    user_id: str, 
    source: str, 
    urls: List[str], 
    options: Optional[Dict[str, Any]] = None
) -> models.ImportBatch:
    """
    Create a new import batch for URL imports
    """
    batch = models.ImportBatch(
        id=str(uuid.uuid4()),
        user_id=user_id,
        source=source,
        status=models.ImportStatus.pending,
        total_items=len(urls),
        processed_items=0,
        successful_items=0,
        failed_items=0,
        metadata={"options": options}
    )
    
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    # Create import items
    for url in urls:
        item = models.ImportItem(
            id=str(uuid.uuid4()),
            batch_id=batch.id,
            source_url=url,
            status=models.ImportStatus.pending
        )
        db.add(item)
    
    db.commit()
    
    return batch

def create_file_import_batch(
    db: Session, 
    user_id: str, 
    source: str, 
    file_content: bytes, 
    file_name: str, 
    options: Optional[Dict[str, Any]] = None
) -> models.ImportBatch:
    """
    Create a new import batch for file imports
    """
    # Parse file to determine number of items
    total_items = 0
    
    try:
        if file_name.endswith('.csv'):
            # Parse CSV
            csv_content = file_content.decode('utf-8')
            reader = csv.DictReader(io.StringIO(csv_content))
            items = list(reader)
            total_items = len(items)
        elif file_name.endswith('.json'):
            # Parse JSON
            json_content = json.loads(file_content.decode('utf-8'))
            if isinstance(json_content, list):
                total_items = len(json_content)
            else:
                total_items = 1
        elif file_name.endswith('.xml'):
            # Parse XML
            root = ET.fromstring(file_content.decode('utf-8'))
            # Assuming products are in a list structure
            products = root.findall('.//product')
            total_items = len(products)
        else:
            # Unsupported file type
            raise ValueError(f"Unsupported file type: {file_name}")
    except Exception as e:
        logger.error(f"Error parsing file: {e}")
        # Default to 1 item if parsing fails
        total_items = 1
    
    batch = models.ImportBatch(
        id=str(uuid.uuid4()),
        user_id=user_id,
        source=source,
        status=models.ImportStatus.pending,
        total_items=total_items,
        processed_items=0,
        successful_items=0,
        failed_items=0,
        metadata={
            "options": options,
            "file_name": file_name,
            "file_content_base64": base64.b64encode(file_content).decode('utf-8')
        }
    )
    
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    return batch

def create_image_import_batch(
    db: Session, 
    user_id: str, 
    image_content: bytes, 
    image_name: str, 
    options: Optional[Dict[str, Any]] = None
) -> models.ImportBatch:
    """
    Create a new import batch for image imports
    """
    batch = models.ImportBatch(
        id=str(uuid.uuid4()),
        user_id=user_id,
        source="image",
        status=models.ImportStatus.pending,
        total_items=1,
        processed_items=0,
        successful_items=0,
        failed_items=0,
        metadata={
            "options": options,
            "image_name": image_name,
            "image_content_base64": base64.b64encode(image_content).decode('utf-8')
        }
    )
    
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    # Create a single import item
    item = models.ImportItem(
        id=str(uuid.uuid4()),
        batch_id=batch.id,
        status=models.ImportStatus.pending
    )
    db.add(item)
    db.commit()
    
    return batch

def process_url_import(db: Session, batch_id: str, user_id: str) -> None:
    """
    Process URL import batch
    """
    batch = db.query(models.ImportBatch).filter(models.ImportBatch.id == batch_id).first()
    if not batch:
        logger.error(f"Import batch not found: {batch_id}")
        return
    
    # Update batch status
    batch.status = models.ImportStatus.processing
    batch.started_at = datetime.utcnow()
    db.commit()
    
    try:
        # Get import items
        items = db.query(models.ImportItem).filter(models.ImportItem.batch_id == batch_id).all()
        
        # Get import options
        options = batch.metadata.get("options", {}) if batch.metadata else {}
        
        # Process each item
        for item in items:
            try:
                # Update item status
                item.status = models.ImportStatus.processing
                db.commit()
                
                # Process based on source
                if batch.source == "aliexpress":
                    process_aliexpress_item(db, item, user_id, options)
                elif batch.source == "bigbuy":
                    process_bigbuy_item(db, item, user_id, options)
                elif batch.source == "eprolo":
                    process_eprolo_item(db, item, user_id, options)
                elif batch.source == "printify":
                    process_printify_item(db, item, user_id, options)
                elif batch.source == "spocket":
                    process_spocket_item(db, item, user_id, options)
                elif batch.source == "url":
                    # Generic URL import - try to detect source
                    process_generic_url_item(db, item, user_id, options)
                else:
                    raise ValueError(f"Unsupported import source: {batch.source}")
                
                # Update batch counters
                batch.processed_items += 1
                batch.successful_items += 1
                db.commit()
                
            except Exception as e:
                logger.error(f"Error processing import item {item.id}: {e}")
                
                # Update item status
                item.status = models.ImportStatus.failed
                item.error_message = str(e)
                
                # Update batch counters
                batch.processed_items += 1
                batch.failed_items += 1
                db.commit()
        
        # Update batch status
        if batch.failed_items == 0:
            batch.status = models.ImportStatus.completed
        elif batch.successful_items == 0:
            batch.status = models.ImportStatus.failed
        else:
            batch.status = models.ImportStatus.partial
        
        batch.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing import batch {batch_id}: {e}")
        
        # Update batch status
        batch.status = models.ImportStatus.failed
        batch.error_message = str(e)
        batch.completed_at = datetime.utcnow()
        db.commit()

def process_bulk_import(db: Session, batch_id: str, user_id: str) -> None:
    """
    Process bulk URL import batch
    """
    # This is essentially the same as process_url_import
    process_url_import(db, batch_id, user_id)

def process_file_import(db: Session, batch_id: str, user_id: str) -> None:
    """
    Process file import batch
    """
    batch = db.query(models.ImportBatch).filter(models.ImportBatch.id == batch_id).first()
    if not batch:
        logger.error(f"Import batch not found: {batch_id}")
        return
    
    # Update batch status
    batch.status = models.ImportStatus.processing
    batch.started_at = datetime.utcnow()
    db.commit()
    
    try:
        # Get file content from metadata
        if not batch.metadata or "file_content_base64" not in batch.metadata:
            raise ValueError("File content not found in batch metadata")
        
        file_content = base64.b64decode(batch.metadata["file_content_base64"])
        file_name = batch.metadata.get("file_name", "import.csv")
        
        # Get import options
        options = batch.metadata.get("options", {}) if batch.metadata else {}
        
        # Parse file based on type
        if file_name.endswith('.csv'):
            items = parse_csv_file(file_content)
        elif file_name.endswith('.json'):
            items = parse_json_file(file_content)
        elif file_name.endswith('.xml'):
            items = parse_xml_file(file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_name}")
        
        # Update batch total items
        batch.total_items = len(items)
        db.commit()
        
        # Create import items if they don't exist
        existing_items = db.query(models.ImportItem).filter(models.ImportItem.batch_id == batch_id).all()
        if not existing_items:
            for item_data in items:
                item = models.ImportItem(
                    id=str(uuid.uuid4()),
                    batch_id=batch_id,
                    title=item_data.get("title"),
                    description=item_data.get("description"),
                    price=float(item_data.get("price", 0)),
                    original_price=float(item_data.get("original_price", 0)),
                    external_id=item_data.get("external_id"),
                    source_url=item_data.get("source_url"),
                    status=models.ImportStatus.pending,
                    metadata=item_data
                )
                db.add(item)
            db.commit()
            
            # Refresh items list
            existing_items = db.query(models.ImportItem).filter(models.ImportItem.batch_id == batch_id).all()
        
        # Process each item
        for item in existing_items:
            try:
                # Update item status
                item.status = models.ImportStatus.processing
                db.commit()
                
                # Create product from item data
                product = create_product_from_import_item(db, item, user_id, options)
                
                # Update item with product ID
                item.product_id = product.id
                item.status = models.ImportStatus.completed
                
                # Update batch counters
                batch.processed_items += 1
                batch.successful_items += 1
                db.commit()
                
            except Exception as e:
                logger.error(f"Error processing import item {item.id}: {e}")
                
                # Update item status
                item.status = models.ImportStatus.failed
                item.error_message = str(e)
                
                # Update batch counters
                batch.processed_items += 1
                batch.failed_items += 1
                db.commit()
        
        # Update batch status
        if batch.failed_items == 0:
            batch.status = models.ImportStatus.completed
        elif batch.successful_items == 0:
            batch.status = models.ImportStatus.failed
        else:
            batch.status = models.ImportStatus.partial
        
        batch.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing import batch {batch_id}: {e}")
        
        # Update batch status
        batch.status = models.ImportStatus.failed
        batch.error_message = str(e)
        batch.completed_at = datetime.utcnow()
        db.commit()

def process_image_import(db: Session, batch_id: str, user_id: str) -> None:
    """
    Process image import batch
    """
    batch = db.query(models.ImportBatch).filter(models.ImportBatch.id == batch_id).first()
    if not batch:
        logger.error(f"Import batch not found: {batch_id}")
        return
    
    # Update batch status
    batch.status = models.ImportStatus.processing
    batch.started_at = datetime.utcnow()
    db.commit()
    
    try:
        # Get image content from metadata
        if not batch.metadata or "image_content_base64" not in batch.metadata:
            raise ValueError("Image content not found in batch metadata")
        
        image_content = base64.b64decode(batch.metadata["image_content_base64"])
        
        # Get import options
        options = batch.metadata.get("options", {}) if batch.metadata else {}
        
        # Get the single import item
        item = db.query(models.ImportItem).filter(models.ImportItem.batch_id == batch_id).first()
        if not item:
            raise ValueError("Import item not found")
        
        # Update item status
        item.status = models.ImportStatus.processing
        db.commit()
        
        try:
            # Use vision API to analyze image
            vision_result = vision_client.analyze_image(image_content)
            
            # Extract product information
            product_info = {
                "title": vision_result.get("title", "Product from Image"),
                "description": vision_result.get("description", ""),
                "price": float(vision_result.get("price", 0)),
                "original_price": float(vision_result.get("original_price", 0)),
                "category": vision_result.get("category", ""),
                "tags": vision_result.get("tags", []),
                "images": vision_result.get("similar_images", [])
            }
            
            # Update item with extracted info
            item.title = product_info["title"]
            item.description = product_info["description"]
            item.price = product_info["price"]
            item.original_price = product_info["original_price"]
            item.metadata = product_info
            
            # Create product from item data
            product = create_product_from_import_item(db, item, user_id, options)
            
            # Update item with product ID
            item.product_id = product.id
            item.status = models.ImportStatus.completed
            
            # Update batch counters
            batch.processed_items += 1
            batch.successful_items += 1
            
        except Exception as e:
            logger.error(f"Error processing image import: {e}")
            
            # Update item status
            item.status = models.ImportStatus.failed
            item.error_message = str(e)
            
            # Update batch counters
            batch.processed_items += 1
            batch.failed_items += 1
        
        # Update batch status
        if batch.failed_items == 0:
            batch.status = models.ImportStatus.completed
        else:
            batch.status = models.ImportStatus.failed
        
        batch.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing image import batch {batch_id}: {e}")
        
        # Update batch status
        batch.status = models.ImportStatus.failed
        batch.error_message = str(e)
        batch.completed_at = datetime.utcnow()
        db.commit()

def process_aliexpress_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process AliExpress import item
    """
    # Extract product ID from URL
    product_id = extract_product_id_from_url(item.source_url)
    if not product_id:
        raise ValueError(f"Could not extract product ID from URL: {item.source_url}")
    
    # Get product details from AliExpress API
    product_data = aliexpress_client.get_product_details(product_id)
    
    # Update item with product data
    item.external_id = product_id
    item.title = product_data["title"]
    item.description = product_data["description"]
    item.price = calculate_selling_price(product_data["price"], options)
    item.original_price = product_data["price"]
    
    # Create product in database
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=product_data["title"],
        description=product_data["description"],
        price=item.price,
        original_price=item.original_price,
        images=product_data["images"],
        supplier="AliExpress",
        category=product_data.get("category", ""),
        external_id=product_id,
        source_url=item.source_url,
        variants=product_data.get("variants", []),
        attributes=product_data.get("attributes", {}),
        options=options
    )
    
    # Update item with product ID
    item.product_id = product.id
    item.status = models.ImportStatus.completed

def process_bigbuy_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process BigBuy import item
    """
    # Extract product ID from URL
    product_id = extract_product_id_from_url(item.source_url)
    if not product_id:
        raise ValueError(f"Could not extract product ID from URL: {item.source_url}")
    
    # Get product details from BigBuy API
    product_data = bigbuy_client.get_product_details(product_id)
    
    # Update item with product data
    item.external_id = product_id
    item.title = product_data["name"]
    item.description = product_data["description"]
    item.price = calculate_selling_price(product_data["price"], options)
    item.original_price = product_data["price"]
    
    # Create product in database
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=product_data["name"],
        description=product_data["description"],
        price=item.price,
        original_price=item.original_price,
        images=product_data["images"],
        supplier="BigBuy",
        category=product_data.get("category", ""),
        external_id=product_id,
        source_url=item.source_url,
        variants=product_data.get("variants", []),
        attributes=product_data.get("attributes", {}),
        options=options
    )
    
    # Update item with product ID
    item.product_id = product.id
    item.status = models.ImportStatus.completed

def process_eprolo_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process Eprolo import item
    """
    # Similar implementation to AliExpress and BigBuy
    # For brevity, we'll use a placeholder implementation
    product_id = "eprolo-123"  # In a real implementation, extract from URL
    
    # Update item with mock data
    item.external_id = product_id
    item.title = "Eprolo Product"
    item.description = "This is an Eprolo product description."
    item.price = 49.99
    item.original_price = 19.99
    
    # Create product in database
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=item.title,
        description=item.description,
        price=item.price,
        original_price=item.original_price,
        images=["https://example.com/image.jpg"],
        supplier="Eprolo",
        category="Electronics",
        external_id=product_id,
        source_url=item.source_url,
        variants=[],
        attributes={},
        options=options
    )
    
    # Update item with product ID
    item.product_id = product.id
    item.status = models.ImportStatus.completed

def process_printify_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process Printify import item
    """
    # Similar implementation to other suppliers
    # For brevity, we'll use a placeholder implementation
    product_id = "printify-123"  # In a real implementation, extract from URL
    
    # Update item with mock data
    item.external_id = product_id
    item.title = "Printify Product"
    item.description = "This is a Printify product description."
    item.price = 39.99
    item.original_price = 15.99
    
    # Create product in database
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=item.title,
        description=item.description,
        price=item.price,
        original_price=item.original_price,
        images=["https://example.com/image.jpg"],
        supplier="Printify",
        category="Apparel",
        external_id=product_id,
        source_url=item.source_url,
        variants=[],
        attributes={},
        options=options
    )
    
    # Update item with product ID
    item.product_id = product.id
    item.status = models.ImportStatus.completed

def process_spocket_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process Spocket import item
    """
    # Similar implementation to other suppliers
    # For brevity, we'll use a placeholder implementation
    product_id = "spocket-123"  # In a real implementation, extract from URL
    
    # Update item with mock data
    item.external_id = product_id
    item.title = "Spocket Product"
    item.description = "This is a Spocket product description."
    item.price = 59.99
    item.original_price = 24.99
    
    # Create product in database
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=item.title,
        description=item.description,
        price=item.price,
        original_price=item.original_price,
        images=["https://example.com/image.jpg"],
        supplier="Spocket",
        category="Home",
        external_id=product_id,
        source_url=item.source_url,
        variants=[],
        attributes={},
        options=options
    )
    
    # Update item with product ID
    item.product_id = product.id
    item.status = models.ImportStatus.completed

def process_generic_url_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> None:
    """
    Process generic URL import item by detecting the source
    """
    url = item.source_url
    
    if "aliexpress.com" in url:
        process_aliexpress_item(db, item, user_id, options)
    elif "bigbuy.eu" in url:
        process_bigbuy_item(db, item, user_id, options)
    elif "eprolo.com" in url:
        process_eprolo_item(db, item, user_id, options)
    elif "printify.com" in url:
        process_printify_item(db, item, user_id, options)
    elif "spocket.co" in url:
        process_spocket_item(db, item, user_id, options)
    else:
        raise ValueError(f"Unsupported URL: {url}")

def create_product_from_import_item(db: Session, item: models.ImportItem, user_id: str, options: Dict[str, Any]) -> Product:
    """
    Create a product from import item data
    """
    # Get item metadata
    metadata = item.metadata or {}
    
    # Create product
    product = create_product_from_data(
        db,
        user_id=user_id,
        title=item.title,
        description=item.description,
        price=item.price,
        original_price=item.original_price,
        images=metadata.get("images", []),
        supplier=metadata.get("supplier", "Import"),
        category=metadata.get("category", ""),
        external_id=item.external_id,
        source_url=item.source_url,
        variants=metadata.get("variants", []),
        attributes=metadata.get("attributes", {}),
        options=options
    )
    
    return product

def create_product_from_data(
    db: Session,
    user_id: str,
    title: str,
    description: str,
    price: float,
    original_price: float,
    images: List[str],
    supplier: str,
    category: str,
    external_id: Optional[str] = None,
    source_url: Optional[str] = None,
    variants: Optional[List[Dict[str, Any]]] = None,
    attributes: Optional[Dict[str, Any]] = None,
    options: Optional[Dict[str, Any]] = None
) -> Product:
    """
    Create a product from raw data
    """
    # Check if product already exists
    if external_id:
        existing_product = db.query(Product).filter(
            Product.user_id == user_id,
            Product.external_id == external_id
        ).first()
        
        if existing_product and options and options.get("skip_existing", True):
            # Skip existing product
            return existing_product
        elif existing_product:
            # Update existing product
            product_data = {
                "title": title,
                "description": description,
                "price": price,
                "original_price": original_price,
                "images": images,
                "supplier": supplier,
                "category": category,
                "source_url": source_url,
                "variants": variants,
                "attributes": attributes,
                "updated_at": datetime.utcnow()
            }
            
            return update_product(db, product_id=existing_product.id, product_data=product_data)
    
    # Prepare tags
    tags = []
    if attributes:
        # Extract tags from attributes
        for key, value in attributes.items():
            if isinstance(value, str):
                tags.append(value)
            elif isinstance(value, list):
                tags.extend(value)
    
    # Add category as tag
    if category:
        tags.append(category)
    
    # Add supplier as tag
    if supplier:
        tags.append(supplier)
    
    # Create new product
    product_data = {
        "user_id": user_id,
        "title": title,
        "description": description,
        "price": price,
        "original_price": original_price,
        "images": images,
        "supplier": supplier,
        "category": category,
        "external_id": external_id,
        "source_url": source_url,
        "variants": variants,
        "attributes": attributes,
        "tags": tags,
        "status": "draft"
    }
    
    # Set publish status if specified in options
    if options and options.get("publish_directly", False):
        product_data["status"] = "published"
    
    # Create product
    product = create_product(db, product_data=product_data)
    
    # Optimize SEO if enabled
    if options and options.get("auto_optimize", True):
        try:
            language = options.get("language", "fr")
            optimize_product_seo(db, product.id, language)
        except Exception as e:
            logger.error(f"Error optimizing product SEO: {e}")
    
    # Translate if enabled
    if options and options.get("auto_translate", False) and options.get("target_languages"):
        try:
            for language in options.get("target_languages", []):
                if language != options.get("language", "fr"):  # Skip source language
                    # In a real implementation, call translation service
                    pass
        except Exception as e:
            logger.error(f"Error translating product: {e}")
    
    return product

def calculate_selling_price(cost_price: float, options: Dict[str, Any]) -> float:
    """
    Calculate selling price based on cost price and options
    """
    # Get markup factor
    markup = options.get("price_markup", 2.5)
    
    # Calculate base price
    price = cost_price * markup
    
    # Apply min/max constraints
    min_price = options.get("min_price")
    max_price = options.get("max_price")
    
    if min_price is not None and price < min_price:
        price = min_price
    
    if max_price is not None and price > max_price:
        price = max_price
    
    # Round to 2 decimal places
    price = round(price * 100) / 100
    
    return price

def parse_csv_file(file_content: bytes) -> List[Dict[str, Any]]:
    """
    Parse CSV file content
    """
    csv_content = file_content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(csv_content))
    return list(reader)

def parse_json_file(file_content: bytes) -> List[Dict[str, Any]]:
    """
    Parse JSON file content
    """
    json_content = json.loads(file_content.decode('utf-8'))
    
    if isinstance(json_content, list):
        return json_content
    elif isinstance(json_content, dict):
        # If it's a single object, wrap it in a list
        return [json_content]
    else:
        raise ValueError("Invalid JSON format")

def parse_xml_file(file_content: bytes) -> List[Dict[str, Any]]:
    """
    Parse XML file content
    """
    root = ET.fromstring(file_content.decode('utf-8'))
    
    # Assuming products are in a list structure
    products = []
    
    # Try to find product elements
    product_elements = root.findall('.//product')
    
    if not product_elements:
        # Try alternative element names
        product_elements = root.findall('.//item') or root.findall('.//Product') or root.findall('.//Item')
    
    for product_elem in product_elements:
        product = {}
        
        # Extract all child elements
        for child in product_elem:
            tag = child.tag
            text = child.text
            
            if text:
                product[tag] = text.strip()
        
        products.append(product)
    
    return products

def get_import_batches(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    status: Optional[str] = None,
    source: Optional[str] = None
) -> List[models.ImportBatch]:
    """
    Get import batches for a user
    """
    query = db.query(models.ImportBatch).filter(models.ImportBatch.user_id == user_id)
    
    if status:
        query = query.filter(models.ImportBatch.status == status)
    
    if source:
        query = query.filter(models.ImportBatch.source == source)
    
    query = query.order_by(models.ImportBatch.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_import_batch(db: Session, batch_id: str, user_id: str) -> Optional[models.ImportBatch]:
    """
    Get import batch by ID
    """
    return db.query(models.ImportBatch).filter(
        models.ImportBatch.id == batch_id,
        models.ImportBatch.user_id == user_id
    ).first()

def reset_import_batch(db: Session, batch_id: str) -> models.ImportBatch:
    """
    Reset import batch for retry
    """
    batch = db.query(models.ImportBatch).filter(models.ImportBatch.id == batch_id).first()
    if not batch:
        raise ValueError(f"Import batch not found: {batch_id}")
    
    # Reset batch status
    batch.status = models.ImportStatus.pending
    batch.processed_items = 0
    batch.successful_items = 0
    batch.failed_items = 0
    batch.error_message = None
    batch.started_at = None
    batch.completed_at = None
    
    # Reset item statuses
    items = db.query(models.ImportItem).filter(models.ImportItem.batch_id == batch_id).all()
    for item in items:
        item.status = models.ImportStatus.pending
        item.error_message = None
    
    db.commit()
    db.refresh(batch)
    
    return batch

def delete_import_batch(db: Session, batch_id: str) -> None:
    """
    Delete import batch
    """
    batch = db.query(models.ImportBatch).filter(models.ImportBatch.id == batch_id).first()
    if batch:
        db.delete(batch)
        db.commit()

def get_import_templates(db: Session, user_id: str) -> List[models.ImportTemplate]:
    """
    Get import templates for a user
    """
    return db.query(models.ImportTemplate).filter(models.ImportTemplate.user_id == user_id).all()

def get_import_template(db: Session, template_id: str, user_id: str) -> Optional[models.ImportTemplate]:
    """
    Get import template by ID
    """
    return db.query(models.ImportTemplate).filter(
        models.ImportTemplate.id == template_id,
        models.ImportTemplate.user_id == user_id
    ).first()

def create_import_template(db: Session, template: schemas.ImportTemplateCreate, user_id: str) -> models.ImportTemplate:
    """
    Create a new import template
    """
    # If this is set as default, unset any existing default templates
    if template.is_default:
        existing_defaults = db.query(models.ImportTemplate).filter(
            models.ImportTemplate.user_id == user_id,
            models.ImportTemplate.is_default == True,
            models.ImportTemplate.source == template.source
        ).all()
        
        for default_template in existing_defaults:
            default_template.is_default = False
    
    db_template = models.ImportTemplate(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=template.name,
        description=template.description,
        source=template.source,
        is_default=template.is_default,
        settings=template.settings
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    return db_template

def update_import_template(db: Session, template_id: str, template: schemas.ImportTemplateUpdate) -> models.ImportTemplate:
    """
    Update an import template
    """
    db_template = db.query(models.ImportTemplate).filter(models.ImportTemplate.id == template_id).first()
    if not db_template:
        raise ValueError(f"Import template not found: {template_id}")
    
    # Update fields if provided
    if template.name is not None:
        db_template.name = template.name
    
    if template.description is not None:
        db_template.description = template.description
    
    if template.is_default is not None:
        # If setting as default, unset any existing default templates
        if template.is_default and not db_template.is_default:
            existing_defaults = db.query(models.ImportTemplate).filter(
                models.ImportTemplate.user_id == db_template.user_id,
                models.ImportTemplate.is_default == True,
                models.ImportTemplate.source == db_template.source,
                models.ImportTemplate.id != template_id
            ).all()
            
            for default_template in existing_defaults:
                default_template.is_default = False
        
        db_template.is_default = template.is_default
    
    if template.settings is not None:
        db_template.settings = template.settings
    
    db_template.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_template)
    
    return db_template

def delete_import_template(db: Session, template_id: str) -> None:
    """
    Delete an import template
    """
    db_template = db.query(models.ImportTemplate).filter(models.ImportTemplate.id == template_id).first()
    if db_template:
        db.delete(db_template)
        db.commit()

def get_import_schedules(db: Session, user_id: str) -> List[models.ImportSchedule]:
    """
    Get import schedules for a user
    """
    return db.query(models.ImportSchedule).filter(models.ImportSchedule.user_id == user_id).all()

def get_import_schedule(db: Session, schedule_id: str, user_id: str) -> Optional[models.ImportSchedule]:
    """
    Get import schedule by ID
    """
    return db.query(models.ImportSchedule).filter(
        models.ImportSchedule.id == schedule_id,
        models.ImportSchedule.user_id == user_id
    ).first()

def create_import_schedule(db: Session, schedule: schemas.ImportScheduleCreate, user_id: str) -> models.ImportSchedule:
    """
    Create a new import schedule
    """
    # Validate template exists
    template = db.query(models.ImportTemplate).filter(
        models.ImportTemplate.id == schedule.template_id,
        models.ImportTemplate.user_id == user_id
    ).first()
    
    if not template:
        raise ValueError(f"Import template not found: {schedule.template_id}")
    
    # Calculate next run time
    next_run = calculate_next_run(
        frequency=schedule.frequency,
        day_of_week=schedule.day_of_week,
        day_of_month=schedule.day_of_month,
        time_of_day=schedule.time_of_day
    )
    
    db_schedule = models.ImportSchedule(
        id=str(uuid.uuid4()),
        user_id=user_id,
        template_id=schedule.template_id,
        name=schedule.name,
        description=schedule.description,
        is_active=schedule.is_active,
        frequency=schedule.frequency,
        day_of_week=schedule.day_of_week,
        day_of_month=schedule.day_of_month,
        time_of_day=schedule.time_of_day,
        next_run=next_run
    )
    
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def update_import_schedule(db: Session, schedule_id: str, schedule: schemas.ImportScheduleUpdate) -> models.ImportSchedule:
    """
    Update an import schedule
    """
    db_schedule = db.query(models.ImportSchedule).filter(models.ImportSchedule.id == schedule_id).first()
    if not db_schedule:
        raise ValueError(f"Import schedule not found: {schedule_id}")
    
    # Update fields if provided
    if schedule.name is not None:
        db_schedule.name = schedule.name
    
    if schedule.description is not None:
        db_schedule.description = schedule.description
    
    if schedule.is_active is not None:
        db_schedule.is_active = schedule.is_active
    
    if schedule.template_id is not None:
        # Validate template exists
        template = db.query(models.ImportTemplate).filter(
            models.ImportTemplate.id == schedule.template_id,
            models.ImportTemplate.user_id == db_schedule.user_id
        ).first()
        
        if not template:
            raise ValueError(f"Import template not found: {schedule.template_id}")
        
        db_schedule.template_id = schedule.template_id
    
    # If any schedule parameters changed, recalculate next run
    schedule_changed = False
    
    if schedule.frequency is not None:
        db_schedule.frequency = schedule.frequency
        schedule_changed = True
    
    if schedule.day_of_week is not None:
        db_schedule.day_of_week = schedule.day_of_week
        schedule_changed = True
    
    if schedule.day_of_month is not None:
        db_schedule.day_of_month = schedule.day_of_month
        schedule_changed = True
    
    if schedule.time_of_day is not None:
        db_schedule.time_of_day = schedule.time_of_day
        schedule_changed = True
    
    if schedule_changed:
        db_schedule.next_run = calculate_next_run(
            frequency=db_schedule.frequency,
            day_of_week=db_schedule.day_of_week,
            day_of_month=db_schedule.day_of_month,
            time_of_day=db_schedule.time_of_day
        )
    
    db_schedule.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def delete_import_schedule(db: Session, schedule_id: str) -> None:
    """
    Delete an import schedule
    """
    db_schedule = db.query(models.ImportSchedule).filter(models.ImportSchedule.id == schedule_id).first()
    if db_schedule:
        db.delete(db_schedule)
        db.commit()

def calculate_next_run(
    frequency: str,
    time_of_day: str,
    day_of_week: Optional[int] = None,
    day_of_month: Optional[int] = None
) -> datetime:
    """
    Calculate the next run time for a schedule
    """
    now = datetime.utcnow()
    
    # Parse time of day
    hour, minute = map(int, time_of_day.split(':'))
    
    # Start with today at the specified time
    next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    # If that time has already passed today, start from tomorrow
    if next_run <= now:
        next_run += timedelta(days=1)
    
    if frequency == "daily":
        # For daily, we're already good
        pass
    elif frequency == "weekly":
        # For weekly, adjust to the specified day of week
        days_ahead = day_of_week - next_run.weekday()
        if days_ahead < 0:  # Target day already happened this week
            days_ahead += 7
        next_run += timedelta(days=days_ahead)
    elif frequency == "monthly":
        # For monthly, adjust to the specified day of month
        if day_of_month < next_run.day:
            # Target day already happened this month, go to next month
            if next_run.month == 12:
                next_run = next_run.replace(year=next_run.year + 1, month=1, day=day_of_month)
            else:
                next_run = next_run.replace(month=next_run.month + 1, day=day_of_month)
        else:
            # Target day is later this month
            next_run = next_run.replace(day=day_of_month)
    
    return next_run