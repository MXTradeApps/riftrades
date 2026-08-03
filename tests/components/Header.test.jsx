import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../src/components/elements/Header.jsx';

const mockCards = [
    { _setName: 'Origins', _setNumber: 1, extNumber: '001' },
    { _setName: 'Origins', _setNumber: 1, extNumber: '002' },
    { _setName: 'Spiritforged', _setNumber: 2, extNumber: '010' },
];

jest.mock('../../src/hooks/useCardData.jsx', () => ({
    useCardData: () => ({
        cards: mockCards,
        dataReady: true,
    }),
}));

jest.mock('../../src/contexts/ThemeContext.jsx', () => ({
    useThemeMode: () => ({
        isDark: true,
        toggleMode: jest.fn(),
    }),
}));

jest.mock('../../src/components/auth/LoginButton.jsx', () => ({
    __esModule: true,
    default: () => <button type="button">Sign in</button>,
}));

function renderHeader(initialPath = '/binder') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Header lastUpdatedTimestamp={null} />
        </MemoryRouter>
    );
}

describe('Header drawer', () => {
    test('shows Browse Cards and loads sets on non-Home routes', () => {
        renderHeader('/binder');

        fireEvent.click(screen.getByRole('button', { name: /menu/i }));

        expect(screen.getByText('Browse Cards')).toBeInTheDocument();
        expect(screen.queryByText('Loading sets…')).not.toBeInTheDocument();
        expect(screen.getByText('Sets · Most Expensive')).toBeInTheDocument();
        expect(screen.getByText('Origins')).toBeInTheDocument();
        expect(screen.getByText('Spiritforged')).toBeInTheDocument();
    });
});

