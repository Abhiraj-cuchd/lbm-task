export function calculateNotesToDispense(availableDenoms:any, amount:any) {
    const denomValues = Object.keys(availableDenoms)
        .map(Number)
        .sort((a, b) => b - a);
    
    const result:any = {};
    let remainingAmount = amount;
    
    for (const denom of denomValues) {
        result[denom] = 0;
    }
    
    for (const denom of denomValues) {
        if (availableDenoms[denom] > 0 && remainingAmount >= denom) {
            result[denom] = 1;
            remainingAmount -= denom;
        }
    }
    
    for (const denom of denomValues) {
        if (availableDenoms[denom] > result[denom] && remainingAmount >= denom) {
            const additionalNotes = Math.min(
                Math.floor(remainingAmount / denom),
                availableDenoms[denom] - result[denom]
            );
            
            result[denom] += additionalNotes;
            remainingAmount -= additionalNotes * denom;
        }
    }
    
    if (remainingAmount > 0) {
        return greedyDispense(availableDenoms, amount);
    }
    
    return result;
}

export function greedyDispense(availableDenoms:any, amount:any) {
    const denomValues = Object.keys(availableDenoms)
        .map(Number)
        .sort((a, b) => b - a);
    
    const result:any = {};
    let remainingAmount = amount;
    for (const denom of denomValues) {
        result[denom] = 0;
    }
    
    for (const denom of denomValues) {
        const notesToDispense = Math.min(
            Math.floor(remainingAmount / denom),
            availableDenoms[denom]
        );
        
        result[denom] = notesToDispense;
        remainingAmount -= notesToDispense * denom;
    }
    
    
    if (remainingAmount > 0) {
        return null;
    }
    
    return result;
}