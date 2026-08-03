/**
 * Build the set list shown in the nav drawer (newest set number first).
 * Only counts catalog cards that have an in-set number.
 */
export function buildSetsList(cards) {
    if (!cards || cards.length === 0) return [];

    const bySet = new Map();
    for (const card of cards) {
        if (!card._setName || !card.extNumber) continue;
        const existing = bySet.get(card._setName);
        if (existing) {
            existing.count += 1;
        } else {
            bySet.set(card._setName, {
                name: card._setName,
                number: card._setNumber || 999,
                count: 1,
            });
        }
    }
    return Array.from(bySet.values()).sort((a, b) => a.number - b.number);
}
