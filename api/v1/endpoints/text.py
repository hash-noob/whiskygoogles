import requests
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from api.config import settings
from api import deps

router = APIRouter()

class TextQuery(BaseModel):
    query: str

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
        results = [{
            "score": match['score'],
            "metadata": {
                "id": match['id'],
                "file_type": match['metadata'].get('file_type'),
                "segment": match['metadata'].get('segment'),
                "start_offset_sec": match['metadata'].get('start_offset_sec'),
                "end_offset_sec": match['metadata'].get('end_offset_sec'),
                "interval_sec": match['metadata'].get('interval_sec'),
            }
        } for match in matches]

        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))