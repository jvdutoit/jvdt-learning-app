from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict

app = FastAPI(title="JVDT Communication Powerhouse API")

class JVDT7Scores(BaseModel):
    perception: int
    interpretation: int
    reflection: int
    application: int
    motivation: int
    orientation: int
    value_expression: int

class JournalEntry(BaseModel):
    text: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/diagnostics/jvdt7")
def submit_jvdt7(scores: JVDT7Scores):
    # naive normalization to 0..1 for now
    norm = {k: getattr(scores, k)/100 for k in scores.model_fields}
    code = "".join([
        "A" if scores.perception>=50 else "N",
        "R" if scores.interpretation>=50 else "C",
        "I" if scores.reflection>=50 else "E",
        "D" if scores.application>=50 else "P",
        "S" if scores.motivation>=50 else "M",
        "T" if scores.orientation>=50 else "H",
        "L" if scores.value_expression>=50 else "R",
    ])
    return {"normalized": norm, "code": code}

@app.get("/practices/recommendations")
def recommend(axis: str, stage: str):
    # stub mapping for demo
    demo = {
        ("Application", "Awareness"): [
            "Convert one abstract goal into three measurable actions"
        ],
        ("Reflection", "Balance"): [
            "Alternate 10 minutes of journaling with 10 minutes of sharing"
        ],
    }
    return {"axis": axis, "stage": stage, "practices": demo.get((axis, stage), [])}

@app.post("/journal/entries")
def add_journal(entry: JournalEntry):
    # naive tagger stub
    tags = []
    if "deadline" in entry.text.lower():
        tags.append("Orientation:T")
    if "vision" in entry.text.lower():
        tags.append("Application:D")
    return {"saved": True, "tags": tags}

@app.post("/simulator/run")
def simulator(payload: Dict):
    # echo back a coaching cue for demo
    return {"message": "Try balancing Love and Respect in your next reply."}
