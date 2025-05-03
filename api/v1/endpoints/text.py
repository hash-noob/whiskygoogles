import requests
import numpy as np
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from api.config import settings
from api import deps

router = APIRouter()

class TextQuery(BaseModel):
    query: str

def normalize_scores(scores, min_score=0.2, target_min=0.6, target_max=0.98):
    """
    Normalize vector similarity scores to a more intuitive confidence range.
    This preserves the ranking but scales the values to a more user-friendly range.
    """
    if not scores or len(scores) == 0:
        return []
    
    # Get min and max scores
    actual_min = min(scores)
    actual_max = max(scores)
    
    # If all scores are the same, return a list with target_max
    if actual_min == actual_max:
        return [target_max] * len(scores)
    
    # Apply a minimum score threshold
    scores = [max(s, min_score) for s in scores]
    actual_min = min(scores)
    
    # Linear rescaling to target range
    normalized = []
    for score in scores:
        if score < min_score:
            normalized.append(0)  # Below threshold gets zero
        else:
            # Rescale to target range
            normalized_score = target_min + (score - actual_min) * (target_max - target_min) / (actual_max - actual_min)
            normalized.append(min(normalized_score, target_max))  # Cap at target_max
    
    return normalized

@router.get("/search/text")
async def query_text(query: str = Query(..., description="The search query text")):
    try:
        if not query:
            raise HTTPException(status_code=400, detail="The query text cannot be empty")

        access_token = settings.get_access_token()

        url, headers, data = settings.get_embedding_request_data(access_token, 'text', query)

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        # Extract the first embedding from the response
        embedding_data = response.json()
        vector = embedding_data['predictions'][0]['textEmbedding']

        query_response = deps.index.query(
            vector=vector,
            top_k=settings.k,
            include_metadata=True
        )

        matches = query_response['matches']
        
        # Extract raw scores for normalization
        raw_scores = [match['score'] for match in matches]
        normalized_scores = normalize_scores(raw_scores)
        
        results = [{
            "score": normalized_scores[i],  # Use normalized score
            "raw_score": match['score'],    # Preserve raw score for reference
            "metadata": {
                "id": match['id'],
                "file_type": match['metadata'].get('file_type'),
                "segment": match['metadata'].get('segment'),
                "start_offset_sec": match['metadata'].get('start_offset_sec'),
                "end_offset_sec": match['metadata'].get('end_offset_sec'),
                "interval_sec": match['metadata'].get('interval_sec'),
            }
        } for i, match in enumerate(matches)]

        print(results)

        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))