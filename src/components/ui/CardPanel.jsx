import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CardList from './CardList.jsx';
import { useThemeMode } from "../../contexts/ThemeContext.jsx";

const CardPanel = ({ 
    allCards, 
    title, 
    cards, 
    cardOptions, 
    inputValue, 
    onInputChange, 
    onAddCard, 
    onRemoveCard, 
    onUpdateQuantity,
    isMobile, 
    totalColor = 'primary',
    disabled = false,
    isLandscape = false,
    viewMode = 'list',
}) => {
    const { isDark } = useThemeMode();

    return (
        <Paper 
            elevation={isLandscape ? 3 : 0}
            sx={{ 
                flex: 1,
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                minHeight: isLandscape ? 0 : { xs: '250px', sm: '300px', md: '350px' },
                height: isLandscape ? '100%' : 'auto',
                overflow: 'hidden',
                p: isLandscape ? 1.25 : { xs: 1.5, sm: 2, md: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: isLandscape ? 3 : 0,
                border: isLandscape 
                    ? `2px solid ${isDark ? 'rgba(58, 154, 186, 0.2)' : 'rgba(26, 90, 122, 0.15)'}` 
                    : `1px solid ${isDark ? 'rgba(58, 154, 186, 0.25)' : 'rgba(26, 90, 122, 0.15)'}`,
                borderTop: isLandscape 
                    ? `2px solid ${isDark ? 'rgba(58, 154, 186, 0.2)' : 'rgba(26, 90, 122, 0.15)'}` 
                    : `4px solid ${isDark ? '#d4a853' : '#1a5a7a'}`,
                boxSizing: 'border-box',
                background: isDark 
                    ? 'linear-gradient(180deg, #0d3050 0%, #0a2540 100%)' 
                    : 'linear-gradient(180deg, #ffffff 0%, #f0f8fa 100%)',
                boxShadow: isLandscape 
                    ? '0 8px 24px rgba(10, 37, 64, 0.2)' 
                    : '0 2px 8px rgba(10, 37, 64, 0.1)',
                '&:hover': {
                    boxShadow: isLandscape 
                        ? '0 12px 32px rgba(10, 37, 64, 0.25)' 
                        : '0 4px 12px rgba(10, 37, 64, 0.15)',
                    transform: isLandscape ? 'translateY(-2px)' : 'none',
                    borderTopColor: '#d4a853'
                }
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: isLandscape ? 1 : { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
                transition: 'all 0.3s ease',
                width: '100%',
                pb: isLandscape ? 0.75 : 1.5,
                flexShrink: 0,
                borderBottom: `2px solid ${isDark ? 'rgba(212, 168, 83, 0.3)' : 'rgba(26, 90, 122, 0.15)'}`
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontSize: isLandscape
                            ? '0.95rem'
                            : { xs: '1.1rem', sm: '1.25rem', md: '1.35rem', lg: '1.5rem', xl: '1.65rem' },
                        fontWeight: 700,
                        color: isDark ? '#e5c078' : '#0a2540',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        transition: 'font-size 0.3s ease'
                    }}
                >
                    {title}
                </Typography>
            </Box>
            
            <CardList
                allCards={allCards}
                cards={cards}
                onRemoveCard={onRemoveCard}
                onUpdateQuantity={onUpdateQuantity}
                isMobile={isMobile}
                cardOptions={cardOptions}
                inputValue={inputValue}
                onInputChange={onInputChange}
                onAddCard={onAddCard}
                title={title}
                disabled={disabled}
                viewMode={viewMode}
                isLandscape={isLandscape}
            />
        </Paper>
    );
};

export default CardPanel;
