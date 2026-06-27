def calculate_priority_score(
    severity: int, 
    urgency: int, 
    evidence_score: float = 1.0, 
    recurrence_count: int = 0
) -> float:
    """
    Revised weights:
    Severity 45%
    Urgency 35%
    Evidence 10%
    Recurrence 10%
    """
    sev_norm = severity / 5.0
    urg_norm = urgency / 5.0
    
    score = (
        (sev_norm * 45) + 
        (urg_norm * 35) + 
        (evidence_score * 10) + 
        (min(recurrence_count / 10.0, 1.0) * 10)
    )
    
    return min(max(round(score, 1), 0.0), 100.0)
