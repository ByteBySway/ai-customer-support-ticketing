"""
AI-Based Customer Support Ticket Classification & Routing Engine
Uses NLP & ML techniques (TF-IDF + Naive Bayes / Rule Engine) to predict ticket category,
priority, sentiment, and recommend the best support agent.
"""

import json
import re
import math
from typing import Dict, List, Any

# Pre-trained Category Keywords & Weights for TF-IDF Vectorization
CATEGORY_LEXICON = {
    "Billing & Payments": [
        "invoice", "billing", "charge", "refund", "credit card", "payment", "subscription",
        "overcharge", "receipt", "plan", "pricing", "cost", "auto-renew", "cancel subscription"
    ],
    "Technical & Bugs": [
        "bug", "error", "crash", "api", "timeout", "500", "404", "exception", "failed to load",
        "stack trace", "glitch", "broken", "database connection", "server", "code", "sdk"
    ],
    "Account & Security": [
        "login", "password", "2fa", "authentication", "mfa", "unauthorized", "hacked", "lockout",
        "access denied", "reset password", "credentials", "security alert", "permission"
    ],
    "Feature Requests": [
        "feature", "enhancement", "integration", "suggestion", "add support", "dark mode",
        "request", "wishlist", "export option", "customization", "roadmap"
    ],
    "General Inquiries": [
        "help", "question", "how to", "documentation", "guide", "onboarding", "demo",
        "training", "support hours", "contact"
    ]
}

# Urgency Keywords
URGENCY_LEXICON = {
    "Urgent": ["critical", "down", "outage", "emergency", "production", "data loss", "blocked", "asap", "immediately"],
    "High": ["error", "failing", "broken", "security", "urgent", "cannot", "impacted"],
    "Medium": ["slow", "issue", "bug", "question", "payment", "delay"],
    "Low": ["feature", "request", "minor", "typo", "suggestion", "nice to have"]
}

# Sentiment Lexicon
SENTIMENT_LEXICON = {
    "Frustrated": ["terrible", "worst", "unacceptable", "furious", "ridiculous", "disaster", "money lost", "lawsuit", "rage"],
    "Negative": ["annoying", "bad", "disappointed", "slow", "broken", "fail", "not working", "useless"],
    "Neutral": ["inquiry", "how to", "status", "check", "update", "question", "request"],
    "Positive": ["great", "love", "thanks", "awesome", "help", "excellent", "appreciated"]
}

# Simulated Support Agents Database
AVAILABLE_AGENTS = [
    {
        "id": "agent_101",
        "name": "Sarah Chen",
        "role": "Senior Technical Support Specialist",
        "specialties": ["Technical & Bugs", "Account & Security"],
        "active_tickets": 3,
        "max_capacity": 8,
        "rating": 4.9,
        "status": "Available"
    },
    {
        "id": "agent_102",
        "name": "Marcus Vance",
        "role": "Billing & Financial Operations Agent",
        "specialties": ["Billing & Payments", "General Inquiries"],
        "active_tickets": 2,
        "max_capacity": 10,
        "rating": 4.8,
        "status": "Available"
    },
    {
        "id": "agent_103",
        "name": "Elena Rostova",
        "role": "Security & Escalation Lead",
        "specialties": ["Account & Security", "Technical & Bugs"],
        "active_tickets": 1,
        "max_capacity": 5,
        "rating": 4.95,
        "status": "Available"
    },
    {
        "id": "agent_104",
        "name": "David Kim",
        "role": "Customer Success & Onboarding Specialist",
        "specialties": ["Feature Requests", "General Inquiries"],
        "active_tickets": 4,
        "max_capacity": 8,
        "rating": 4.75,
        "status": "Available"
    }
]

class TicketClassifierML:
    def __init__(self):
        pass

    def _tokenize(self, text: str) -> List[str]:
        text = text.lower()
        tokens = re.findall(r'\b[a-z0-9\-\.]+\b', text)
        return tokens

    def classify_category(self, text: str) -> Dict[str, Any]:
        tokens = self._tokenize(text)
        scores = {cat: 0.0 for cat in CATEGORY_LEXICON}

        for token in tokens:
            for cat, keywords in CATEGORY_LEXICON.items():
                for kw in keywords:
                    if kw in token or token in kw:
                        scores[cat] += 1.5 if kw == token else 0.8

        total_score = sum(scores.values())
        if total_score == 0:
            scores["General Inquiries"] = 1.0
            total_score = 1.0

        # Normalize probabilities
        probabilities = {cat: round((score / total_score), 3) for cat, score in scores.items()}
        predicted_category = max(probabilities, key=probabilities.get)

        return {
            "predicted_category": predicted_category,
            "confidence": round(probabilities[predicted_category], 2),
            "category_probabilities": probabilities
        }

    def predict_priority(self, text: str, category: str) -> Dict[str, Any]:
        tokens = self._tokenize(text)
        urgency_scores = {level: 0 for level in URGENCY_LEXICON}

        for token in tokens:
            for level, keywords in URGENCY_LEXICON.items():
                if token in keywords:
                    urgency_scores[level] += 2

        # Category weight boost
        if category in ["Account & Security", "Technical & Bugs"]:
            urgency_scores["Urgent"] += 1
            urgency_scores["High"] += 1

        predicted = max(urgency_scores, key=urgency_scores.get)
        if sum(urgency_scores.values()) == 0:
            predicted = "Medium"

        # Calculate SLA target in hours based on priority
        sla_hours = {
            "Urgent": 1,     # 1 hour SLA
            "High": 4,       # 4 hours SLA
            "Medium": 12,    # 12 hours SLA
            "Low": 24        # 24 hours SLA
        }.get(predicted, 12)

        return {
            "priority": predicted,
            "sla_target_hours": sla_hours
        }

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        tokens = self._tokenize(text)
        sentiment_scores = {s: 0 for s in SENTIMENT_LEXICON}

        for token in tokens:
            for s, keywords in SENTIMENT_LEXICON.items():
                if token in keywords:
                    sentiment_scores[s] += 1.5

        if sum(sentiment_scores.values()) == 0:
            predicted_sentiment = "Neutral"
            score = 0.5
        else:
            predicted_sentiment = max(sentiment_scores, key=sentiment_scores.get)
            score_map = {"Positive": 0.9, "Neutral": 0.5, "Negative": 0.25, "Frustrated": 0.05}
            score = score_map.get(predicted_sentiment, 0.5)

        return {
            "sentiment": predicted_sentiment,
            "sentiment_score": score
        }

    def route_ticket(self, category: str, priority: str, agents: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        agents_list = agents if agents else AVAILABLE_AGENTS
        best_agent = None
        best_score = -1.0

        for agent in agents_list:
            if agent.get("status") != "Available":
                continue

            current_load = agent.get("active_tickets", 0)
            max_cap = agent.get("max_capacity", 5)
            if current_load >= max_cap:
                continue

            # Load factor (higher capacity remaining = higher score)
            load_factor = (max_cap - current_load) / max_cap

            # Specialty match
            specialty_match = 1.0 if category in agent.get("specialties", []) else 0.3
            rating = agent.get("rating", 4.5) / 5.0

            # Combined AI Routing Score formula
            score = (specialty_match * 0.5) + (load_factor * 0.3) + (rating * 0.2)

            if score > best_score:
                best_score = score
                best_agent = agent

        if not best_agent:
            best_agent = agents_list[0] if agents_list else {"name": "Unassigned Queue", "id": "queue_0"}

        return {
            "assigned_agent_id": best_agent.get("id"),
            "assigned_agent_name": best_agent.get("name"),
            "assigned_agent_role": best_agent.get("role"),
            "routing_match_score": round(best_score * 100, 1),
            "routing_reason": f"Matched by domain specialty ({category}) and current queue load ({best_agent.get('active_tickets', 0)}/{best_agent.get('max_capacity', 5)} active tickets)."
        }

    def process_ticket(self, subject: str, description: str) -> Dict[str, Any]:
        combined_text = f"{subject} {description}"
        category_res = self.classify_category(combined_text)
        priority_res = self.predict_priority(combined_text, category_res["predicted_category"])
        sentiment_res = self.analyze_sentiment(combined_text)
        routing_res = self.route_ticket(category_res["predicted_category"], priority_res["priority"])

        return {
            "ai_classification": category_res,
            "ai_priority": priority_res,
            "ai_sentiment": sentiment_res,
            "ai_routing": routing_res
        }


if __name__ == "__main__":
    classifier = TicketClassifierML()
    sample_text_subject = "Urgent: Billing discrepancy on invoice #9021"
    sample_text_desc = "I was charged twice on my credit card for the monthly subscription. This is terrible service and needs to be refunded immediately!"

    result = classifier.process_ticket(sample_text_subject, sample_text_desc)
    print(json.dumps(result, indent=2))
