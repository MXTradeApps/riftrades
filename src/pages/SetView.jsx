import { useMemo, useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch,
    useMediaQuery,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useCardData } from "../hooks/useCardData.jsx";
import { useThemeMode } from "../contexts/ThemeContext.jsx";
import { CardThumbnail } from "../components/ui/CardImagePreview.jsx";
import { useCardDetail } from "../contexts/CardDetailContext.jsx";

// Signature cards are marked with "(Signature)" in the card name and an
// asterisk in their extNumber (e.g., "234*/219"). We check both for safety.
const isSignatureCard = (card) => {
    const name = (card?.name || '').toLowerCase();
    const num = card?.extNumber || '';
    return name.includes('(signature)') || num.includes('*');
};

// Overnumbered cards have a card number greater than the printed set total
// (e.g., "220/219", "238/219"). These are the extra showcase / ultimate /
// alt-art printings that sit beyond the base set count. Signatures are a
// separate, overlapping category (marked with `*`) — we intentionally exclude
// them here so the two toggles are independent.
const isOvernumberedCard = (card) => {
    const raw = card?.extNumber || '';
    if (raw.includes('*')) return false; // signatures have their own toggle
    const match = raw.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!match) return false;
    const num = parseInt(match[1], 10);
    const total = parseInt(match[2], 10);
    if (!Number.isFinite(num) || !Number.isFinite(total) || total === 0) return false;
    return num > total;
};

const formatUSD = (value) => {
    if (!value || value <= 0) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const rarityColor = (rarity, isDark) => {
    const r = (rarity || '').toLowerCase();
    if (r === 'epic') return isDark ? '#c084fc' : '#7c3aed';
    if (r === 'rare') return isDark ? '#fbbf24' : '#b8892e';
    if (r === 'uncommon') return isDark ? '#5abada' : '#1a5a7a';
    if (r === 'common') return isDark ? '#a0c4d4' : '#4c4359';
    if (r === 'showcase') return isDark ? '#f472b6' : '#db2777';
    if (r === 'promo') return isDark ? '#34d399' : '#059669';
    return isDark ? '#a0c4d4' : '#4c4359';
};

const FilterToggle = ({ label, count, singular, plural, checked, onChange, accent, subtle, isDark }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1
    }}>
        <FormControlLabel
            control={
                <Switch
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    size="small"
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: accent },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: accent
                        }
                    }}
                />
            }
            label={
                <Typography sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isDark ? '#e8f4f8' : '#0a2540'
                }}>
                    {label}
                </Typography>
            }
            sx={{ m: 0 }}
        />
        <Typography sx={{
            fontSize: '0.75rem',
            color: subtle,
            fontStyle: 'italic'
        }}>
            {checked
                ? `${count} ${count === 1 ? singular : plural} hidden`
                : `${count} ${count === 1 ? singular : plural} included`}
        </Typography>
    </Box>
);

const CardRow = ({ card, rank, isDark, isMobile, onOpenDetail }) => {
    const accent = isDark ? '#d4a853' : '#1a5a7a';
    const subtle = isDark ? 'rgba(160, 196, 212, 0.8)' : 'rgba(26, 74, 110, 0.8)';
    const rColor = rarityColor(card.extRarity, isDark);

    const priceCell = (label, value, isMarket = false) => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            minWidth: isMobile ? 'auto' : 90
        }}>
            <Typography sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: subtle,
                lineHeight: 1
            }}>
                {label}
            </Typography>
            <Typography sx={{
                fontSize: isMarket ? '1.05rem' : '0.95rem',
                fontWeight: isMarket ? 800 : 600,
                color: isMarket ? accent : (isDark ? '#e8f4f8' : '#0a2540'),
                mt: 0.25,
                fontVariantNumeric: 'tabular-nums'
            }}>
                {formatUSD(value)}
            </Typography>
        </Box>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 1.25, sm: 1.5 },
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                border: `1px solid ${isDark ? 'rgba(58, 154, 186, 0.2)' : 'rgba(26, 90, 122, 0.12)'}`,
                background: isDark
                    ? 'linear-gradient(180deg, rgba(13, 48, 80, 0.85) 0%, rgba(10, 37, 64, 0.85) 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f5fafc 100%)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: isDark
                        ? '0 6px 16px rgba(0, 0, 0, 0.35)'
                        : '0 6px 16px rgba(10, 37, 64, 0.12)',
                    borderColor: accent
                }
            }}
        >
            {/* Rank */}
            <Box sx={{
                minWidth: { xs: 28, sm: 36 },
                textAlign: 'center',
                flexShrink: 0
            }}>
                <Typography sx={{
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    fontWeight: 800,
                    color: rank <= 3 ? accent : subtle,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1
                }}>
                    #{rank}
                </Typography>
            </Box>

            {/* Thumbnail */}
            <CardThumbnail
                imageUrl={card.imageUrl}
                alt={card.name}
                size={isMobile ? 40 : 48}
                onClick={card._uniqueId ? () => onOpenDetail(card) : undefined}
            />

            {/* Card info */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    flexWrap: 'wrap'
                }}>
                    <Typography
                        component={card._uniqueId ? 'button' : 'span'}
                        type={card._uniqueId ? 'button' : undefined}
                        onClick={card._uniqueId ? () => onOpenDetail(card) : undefined}
                        aria-label={card._uniqueId ? `View details for ${card.name}` : undefined}
                        sx={{
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        fontWeight: 700,
                        color: isDark ? '#e8f4f8' : '#0a2540',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        border: 0,
                        background: 'none',
                        p: 0,
                        m: 0,
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        cursor: card._uniqueId ? 'pointer' : 'default',
                    }}>
                        {card.name}
                    </Typography>
                    {card.isFoil && (
                        <Chip
                            icon={<AutoAwesomeIcon sx={{ fontSize: '0.75rem !important' }} />}
                            label="Foil"
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                color: isDark ? '#0a2540' : '#ffffff',
                                background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                                '& .MuiChip-icon': {
                                    color: isDark ? '#0a2540' : '#ffffff',
                                    ml: 0.5
                                },
                                '& .MuiChip-label': { px: 0.75 }
                            }}
                        />
                    )}
                    {isSignatureCard(card) && (
                        <Chip
                            label="Signature"
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                color: '#ffffff',
                                background: isDark
                                    ? 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)'
                                    : 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                '& .MuiChip-label': { px: 0.75 }
                            }}
                        />
                    )}
                    {isOvernumberedCard(card) && (
                        <Chip
                            label="Overnumbered"
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                color: '#ffffff',
                                background: isDark
                                    ? 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
                                    : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                '& .MuiChip-label': { px: 0.75 }
                            }}
                        />
                    )}
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 0.5,
                    flexWrap: 'wrap'
                }}>
                    {card.extNumber && (
                        <Typography sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: subtle,
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            #{card.extNumber}
                        </Typography>
                    )}
                    {card.extRarity && (
                        <Typography sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: rColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {card.extRarity}
                        </Typography>
                    )}
                    {card.subTypeName && !card.isFoil && (
                        <Typography sx={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: subtle
                        }}>
                            {card.subTypeName}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Prices */}
            {isMobile ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'flex-end',
                    flexShrink: 0
                }}>
                    {priceCell('Market', card.marketPrice, true)}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Typography sx={{
                            fontSize: '0.7rem',
                            color: subtle,
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            L {formatUSD(card.lowPrice)}
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.7rem',
                            color: subtle,
                            fontVariantNumeric: 'tabular-nums'
                        }}>
                            H {formatUSD(card.highPrice)}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box sx={{
                    display: 'flex',
                    gap: { sm: 2, md: 3 },
                    alignItems: 'center',
                    flexShrink: 0,
                    pr: 1
                }}>
                    {priceCell('Low', card.lowPrice)}
                    {priceCell('Market', card.marketPrice, true)}
                    {priceCell('High', card.highPrice)}
                </Box>
            )}
        </Paper>
    );
};

const SetView = ({ setName, onBack }) => {
    const { cards, loading } = useCardData();
    const { openDetail } = useCardDetail();
    const { isDark } = useThemeMode();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [filter, setFilter] = useState('');
    const [hideSignatures, setHideSignatures] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem('riftrades-hide-signatures') === 'true';
    });
    const [hideOvernumbered, setHideOvernumbered] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem('riftrades-hide-overnumbered') === 'true';
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('riftrades-hide-signatures', String(hideSignatures));
    }, [hideSignatures]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('riftrades-hide-overnumbered', String(hideOvernumbered));
    }, [hideOvernumbered]);

    const accent = isDark ? '#d4a853' : '#1a5a7a';
    const subtle = isDark ? 'rgba(160, 196, 212, 0.8)' : 'rgba(26, 74, 110, 0.8)';

    // All cards for the set (used to compute signature counts regardless of toggle)
    const allSetCards = useMemo(() => {
        if (!cards || cards.length === 0) return [];

        const forSet = cards.filter(c =>
            c._setName === setName &&
            c.extNumber && // only actual cards with a card number in-set
            c.name
        );

        forSet.sort((a, b) => {
            const ap = a.marketPrice || 0;
            const bp = b.marketPrice || 0;
            if (bp !== ap) return bp - ap;
            // fall back to name + foiling for stable ordering
            if (a.name !== b.name) return a.name.localeCompare(b.name);
            return (a.isFoil ? 1 : 0) - (b.isFoil ? 1 : 0);
        });

        return forSet;
    }, [cards, setName]);

    const signatureCount = useMemo(
        () => allSetCards.filter(isSignatureCard).length,
        [allSetCards]
    );

    const overnumberedCount = useMemo(
        () => allSetCards.filter(isOvernumberedCard).length,
        [allSetCards]
    );

    const setCards = useMemo(() => {
        if (!hideSignatures && !hideOvernumbered) return allSetCards;
        return allSetCards.filter(c => {
            if (hideSignatures && isSignatureCard(c)) return false;
            if (hideOvernumbered && isOvernumberedCard(c)) return false;
            return true;
        });
    }, [allSetCards, hideSignatures, hideOvernumbered]);

    const filteredCards = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return setCards;
        return setCards.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.extRarity || '').toLowerCase().includes(q) ||
            (c.extNumber || '').toLowerCase().includes(q) ||
            (c.subTypeName || '').toLowerCase().includes(q)
        );
    }, [setCards, filter]);

    const topMarket = setCards[0]?.marketPrice || 0;

    const bgGradient = isDark
        ? 'linear-gradient(135deg, #061825 0%, #0a2540 50%, #0d3050 100%)'
        : 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 50%, #c0dce8 100%)';

    return (
        <Box sx={{
            flexGrow: 1,
            width: '100%',
            background: bgGradient,
            overflow: 'auto',
            p: { xs: 1.5, sm: 2, md: 3 }
        }}>
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mb: 2,
                        borderRadius: 3,
                        border: `2px solid ${isDark ? 'rgba(58, 154, 186, 0.2)' : 'rgba(26, 90, 122, 0.15)'}`,
                        borderTop: `4px solid ${accent}`,
                        background: isDark
                            ? 'linear-gradient(180deg, #0d3050 0%, #0a2540 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #f0f8fa 100%)',
                        boxShadow: '0 8px 24px rgba(10, 37, 64, 0.15)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Tooltip title="Back to trade calculator">
                            <IconButton
                                onClick={onBack}
                                size="small"
                                sx={{
                                    color: accent,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: subtle
                        }}>
                            Set · Most Expensive
                        </Typography>
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.9rem', md: '2.1rem' },
                            fontWeight: 800,
                            letterSpacing: '-0.01em',
                            background: isDark
                                ? 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)'
                                : 'linear-gradient(135deg, #0d4560 0%, #1a5a7a 50%, #2a7a9a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            mb: 0.5
                        }}
                    >
                        {setName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                        <Typography sx={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: isDark ? '#a0c4d4' : '#1a4a6e'
                        }}>
                            {setCards.length} printing{setCards.length === 1 ? '' : 's'} sorted by TCGplayer Market price
                        </Typography>
                        {topMarket > 0 && (
                            <Chip
                                label={`Top: ${formatUSD(topMarket)}`}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: isDark ? '#0a2540' : '#ffffff',
                                    background: isDark
                                        ? 'linear-gradient(135deg, #e5c078 0%, #d4a853 100%)'
                                        : 'linear-gradient(135deg, #1a5a7a 0%, #2a7a9a 100%)'
                                }}
                            />
                        )}
                    </Box>

                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Filter by name, number, rarity…"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: subtle }} />
                                </InputAdornment>
                            ),
                            endAdornment: filter && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setFilter('')}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: isDark ? 'rgba(10, 37, 64, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }
                        }}
                    />

                    {(signatureCount > 0 || overnumberedCount > 0) && (
                        <Box sx={{
                            mt: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        }}>
                            {signatureCount > 0 && (
                                <FilterToggle
                                    label="Hide signature cards"
                                    count={signatureCount}
                                    singular="signature"
                                    plural="signatures"
                                    checked={hideSignatures}
                                    onChange={setHideSignatures}
                                    accent={accent}
                                    subtle={subtle}
                                    isDark={isDark}
                                />
                            )}
                            {overnumberedCount > 0 && (
                                <FilterToggle
                                    label="Hide overnumbered cards"
                                    count={overnumberedCount}
                                    singular="overnumbered card"
                                    plural="overnumbered cards"
                                    checked={hideOvernumbered}
                                    onChange={setHideOvernumbered}
                                    accent={accent}
                                    subtle={subtle}
                                    isDark={isDark}
                                />
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Card list */}
                {loading && setCards.length === 0 && (
                    <Typography sx={{
                        textAlign: 'center',
                        py: 4,
                        color: subtle,
                        fontStyle: 'italic'
                    }}>
                        Loading cards…
                    </Typography>
                )}

                {!loading && filteredCards.length === 0 && setCards.length > 0 && (
                    <Typography sx={{
                        textAlign: 'center',
                        py: 4,
                        color: subtle,
                        fontStyle: 'italic'
                    }}>
                        No cards match “{filter}”.
                    </Typography>
                )}

                {!loading && setCards.length === 0 && (
                    <Typography sx={{
                        textAlign: 'center',
                        py: 4,
                        color: subtle,
                        fontStyle: 'italic'
                    }}>
                        No cards found in this set.
                    </Typography>
                )}

                {filteredCards.map((card, idx) => {
                    const rank = setCards.indexOf(card) + 1;
                    return (
                        <CardRow
                            key={card._uniqueId || `${card.productId}-${card.subTypeName}-${idx}`}
                            card={card}
                            rank={rank}
                            isDark={isDark}
                            isMobile={isMobile}
                            onOpenDetail={openDetail}
                        />
                    );
                })}
            </Box>

        </Box>
    );
};

export default SetView;
