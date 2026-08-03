import { buildSetsList } from '../../src/utils/sets.js';

describe('buildSetsList', () => {
    test('returns empty when cards are missing', () => {
        expect(buildSetsList(undefined)).toEqual([]);
        expect(buildSetsList([])).toEqual([]);
    });

    test('groups cards by set and sorts by set number ascending', () => {
        const cards = [
            { _setName: 'Spiritforged', _setNumber: 2, extNumber: '001' },
            { _setName: 'Origins', _setNumber: 1, extNumber: '010' },
            { _setName: 'Origins', _setNumber: 1, extNumber: '011' },
            { _setName: 'Spiritforged', _setNumber: 2, extNumber: null },
            { name: 'No set' },
        ];

        expect(buildSetsList(cards)).toEqual([
            { name: 'Origins', number: 1, count: 2 },
            { name: 'Spiritforged', number: 2, count: 1 },
        ]);
    });
});
