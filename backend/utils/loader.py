# backend/utils/loader.py
import json
from pathlib import Path

def load_bus_data():
    path = Path(__file__).parent.parent / "data" / "bus_data.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def load_privacy_policies():
    path = Path(__file__).parent.parent / "data" / "privacy_policy.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def prepare_chunks():
    """
    Convert JSON data into meaningful, full-sentence chunks for RAG.
    These chunks are designed for vectorstore embeddings to help Gemini answer smartly.
    """
    bus_data = load_bus_data()
    privacy_data = load_privacy_policies()
    
    chunks = []

    # -------------------------
    # Bus ticket info chunks
    # -------------------------
    for district in bus_data.get("districts", []):
        district_name = district.get("name")
        for point in district.get("dropping_points", []):
            # Full natural sentence
            chunks.append(
                f"In {district_name}, the bus ticket to {point['name']} costs {point['price']} BDT."
            )

    # -------------------------
    # Bus provider info chunks
    # -------------------------
    for provider in bus_data.get("bus_providers", []):
        coverage = provider.get("coverage_districts", [])
        if coverage:
            coverage_str = ", ".join(coverage)
            chunks.append(
                f"The bus company {provider['name']} operates in the following districts: {coverage_str}."
            )

    # -------------------------
    # Privacy policy chunks
    # -------------------------
    for policy in privacy_data.get("privacyPolicies", []):
        company = policy.get("company", "")
        desc = policy.get("description", "")
        contact = policy.get("contact", "")
        address = policy.get("address", "")
        link = policy.get("policyLink", "")
        # Compose full sentence chunk
        chunks.append(
            f"{company} Privacy Policy: {desc} You can contact them at {contact} or visit {link}. Their office is located at {address}."
        )

    return chunks
