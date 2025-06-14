def compute_score(details: dict) -> float:
    # Example: 1 - sum of all unsafe probabilities
    unsafe_keys = ['toxic', 'porn', 'hentai', 'sexy']
    unsafe_score = sum(details.get(k, 0) for k in unsafe_keys)
    return max(0.0, 1.0 - unsafe_score) 