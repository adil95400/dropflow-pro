import logging
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

from ...clients.openai import OpenAIClient

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = OpenAIClient()

class Chatbot:
    def __init__(self, kb_articles: Optional[List[Dict[str, Any]]] = None):
        """
        Initialize the chatbot with knowledge base articles
        """
        self.kb_articles = kb_articles or []
        self.system_prompt = """
        You are a helpful assistant for DropFlow Pro, a dropshipping platform. Your role is to help users with questions about:
        
        1. Dropshipping best practices
        2. E-commerce strategies
        3. Product sourcing and selection
        4. Using the DropFlow Pro platform
        5. Technical support for the platform
        
        Be concise, helpful, and accurate. If you don't know the answer, suggest contacting support.
        
        When providing instructions about the DropFlow Pro platform, focus on these key features:
        - Product import from multiple suppliers (AliExpress, BigBuy, etc.)
        - AI-powered SEO optimization
        - Order tracking
        - Multi-store synchronization
        - Analytics and reporting
        
        Avoid making up features that don't exist. If unsure, suggest checking the documentation.
        """

    def generate_response(self, conversation_history: List[Dict[str, str]], query: str) -> str:
        """
        Generate a response based on conversation history and the current query
        """
        try:
            # Prepare messages for OpenAI
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]
            
            # Add conversation history
            for message in conversation_history:
                messages.append({
                    "role": message["role"],
                    "content": message["content"]
                })
            
            # Add current query
            messages.append({"role": "user", "content": query})
            
            # Find relevant knowledge base articles
            relevant_articles = self.find_relevant_articles(query)
            
            # If relevant articles found, add them to the system prompt
            if relevant_articles:
                article_content = "\n\n".join([
                    f"Article: {article['title']}\n{article['content']}"
                    for article in relevant_articles
                ])
                
                context_message = {
                    "role": "system",
                    "content": f"Here are some relevant articles that might help answer the user's question:\n\n{article_content}\n\nUse this information to provide a more accurate response."
                }
                
                messages.insert(1, context_message)
            
            # Generate response using OpenAI
            response = openai_client.generate_chat_completion(messages)
            
            return response
        
        except Exception as e:
            logger.error(f"Error generating chatbot response: {e}")
            return "I'm sorry, I'm having trouble generating a response right now. Please try again later or contact our support team for assistance."

    def find_relevant_articles(self, query: str, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """
        Find knowledge base articles relevant to the query
        """
        if not self.kb_articles:
            return []
        
        # In a real implementation, this would use embeddings and vector similarity
        # For now, we'll use a simple keyword matching approach
        
        # Extract keywords from query
        keywords = set(re.findall(r'\b\w{3,}\b', query.lower()))
        
        if not keywords:
            return []
        
        # Score articles based on keyword matches
        scored_articles = []
        
        for article in self.kb_articles:
            article_text = f"{article['title']} {article['content']}".lower()
            matches = sum(1 for keyword in keywords if keyword in article_text)
            score = matches / len(keywords)
            
            if score >= threshold:
                scored_articles.append((article, score))
        
        # Sort by score and return top 3
        scored_articles.sort(key=lambda x: x[1], reverse=True)
        return [article for article, _ in scored_articles[:3]]

    def classify_query(self, query: str) -> str:
        """
        Classify the query into a category
        """
        try:
            # Prepare prompt for classification
            prompt = f"""
            Classify the following query into one of these categories:
            - general_question
            - product_import
            - seo_optimization
            - order_tracking
            - technical_issue
            - billing_question
            - feature_request
            
            Query: {query}
            
            Category:
            """
            
            # Generate classification using OpenAI
            classification = openai_client.generate_completion(prompt).strip()
            
            # Validate classification
            valid_categories = [
                "general_question", "product_import", "seo_optimization", 
                "order_tracking", "technical_issue", "billing_question", "feature_request"
            ]
            
            if classification not in valid_categories:
                return "general_question"
            
            return classification
        
        except Exception as e:
            logger.error(f"Error classifying query: {e}")
            return "general_question"

    def should_escalate_to_human(self, query: str, conversation_history: List[Dict[str, str]]) -> bool:
        """
        Determine if the conversation should be escalated to a human agent
        """
        # Check for explicit requests for human agent
        human_patterns = [
            r"human",
            r"agent",
            r"person",
            r"speak to someone",
            r"talk to someone",
            r"customer service",
            r"support team"
        ]
        
        for pattern in human_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        
        # Check for frustration indicators
        frustration_patterns = [
            r"not helpful",
            r"doesn't work",
            r"doesn't help",
            r"useless",
            r"frustrated",
            r"annoyed",
            r"angry"
        ]
        
        for pattern in frustration_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        
        # Check for complex technical issues
        technical_patterns = [
            r"error code",
            r"doesn't work",
            r"broken",
            r"bug",
            r"issue with",
            r"problem with"
        ]
        
        technical_matches = sum(1 for pattern in technical_patterns if re.search(pattern, query, re.IGNORECASE))
        if technical_matches >= 2:
            return True
        
        # Check for repeated questions (user asking the same thing multiple times)
        if len(conversation_history) >= 4:
            user_messages = [msg["content"] for msg in conversation_history if msg["role"] == "user"]
            if len(user_messages) >= 2:
                last_message = user_messages[-1].lower()
                previous_message = user_messages[-2].lower()
                
                # Check for similarity between last two messages
                if self.calculate_similarity(last_message, previous_message) > 0.8:
                    return True
        
        return False

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity between two texts (simple implementation)
        """
        # Convert to sets of words
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        # Calculate Jaccard similarity
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0

    def generate_suggested_replies(self, query: str) -> List[str]:
        """
        Generate suggested quick replies based on the query
        """
        try:
            # Prepare prompt for generating suggestions
            prompt = f"""
            Generate 3 short, helpful suggested replies to the following user query in a support chat for DropFlow Pro (a dropshipping platform):
            
            User query: {query}
            
            Format each suggestion on a new line, keep them concise (under 100 characters each).
            """
            
            # Generate suggestions using OpenAI
            suggestions_text = openai_client.generate_completion(prompt)
            
            # Parse suggestions (one per line)
            suggestions = [line.strip() for line in suggestions_text.strip().split('\n') if line.strip()]
            
            # Limit to 3 suggestions
            return suggestions[:3]
        
        except Exception as e:
            logger.error(f"Error generating suggested replies: {e}")
            return [
                "I'd be happy to help with that.",
                "Could you provide more details?",
                "Let me check that for you."
            ]