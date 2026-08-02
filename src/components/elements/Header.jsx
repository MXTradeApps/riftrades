import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    Menu as MenuIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    LocalOffer as SetIcon,
    PrivacyTip as PrivacyIcon
} from '@mui/icons-material';
import { formatTimestamp } from "../../utils/helpers.js";
import { useThemeMode } from "../../contexts/ThemeContext.jsx";
import LoginButton from "../auth/LoginButton.jsx";

const Header = ({ lastUpdatedTimestamp, sets = [], currentView = { type: 'home' }, onNavigate }) => {
    const { isDark, toggleMode } = useThemeMode();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (view) => {
        setDrawerOpen(false);
        if (onNavigate) onNavigate(view);
    };

    const handleRoute = (path) => {
        setDrawerOpen(false);
        navigate(path);
    };

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #0a2540 0%, #0d3050 50%, #1a4a6e 100%)',
                    borderBottom: '3px solid #d4a853',
                    boxShadow: '0 4px 20px rgba(10, 37, 64, 0.5)'
                }}
            >
                <Toolbar sx={{
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 1, sm: 1.25, md: 1.75 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Hamburger menu */}
                    <Tooltip title="Browse sets">
                        <IconButton
                            onClick={() => setDrawerOpen(true)}
                            sx={{
                                color: '#d4a853',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    backgroundColor: 'rgba(212, 168, 83, 0.15)',
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Center content */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexGrow: 1,
                        cursor: currentView.type !== 'home' ? 'pointer' : 'default'
                    }}
                        onClick={() => {
                            if (currentView.type !== 'home' && onNavigate) onNavigate({ type: 'home' });
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
                                background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '0.02em',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            ⚔️ Riftrades
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                mt: 0.5,
                                opacity: 0.9,
                                fontWeight: 500,
                                color: '#a0c4d4'
                            }}
                        >
                            Prices last updated: {lastUpdatedTimestamp ? formatTimestamp(lastUpdatedTimestamp) : 'Loading...'}
                        </Typography>
                    </Box>

                    {/* Theme toggle + sign-in */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <IconButton
                                onClick={toggleMode}
                                sx={{
                                    color: '#d4a853',
                                    '&:hover': {
                                        backgroundColor: 'rgba(212, 168, 83, 0.15)',
                                    }
                                }}
                            >
                                {isDark ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                        <LoginButton />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: 280, sm: 320 },
                        background: isDark
                            ? 'linear-gradient(180deg, #0d3050 0%, #0a2540 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #e8f4f8 100%)',
                        borderRight: `3px solid ${isDark ? '#d4a853' : '#1a5a7a'}`
                    }
                }}
            >
                {/* Drawer header */}
                <Box sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #0a2540 0%, #0d3050 50%, #1a4a6e 100%)',
                    borderBottom: '2px solid #d4a853'
                }}>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Menu
                    </Typography>
                    <IconButton
                        onClick={() => setDrawerOpen(false)}
                        sx={{ color: '#d4a853', p: 0.5 }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <List sx={{ py: 1 }}>
                    <ListItemButton
                        selected={currentView.type === 'home'}
                        onClick={() => handleNavigate({ type: 'home' })}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                                '&:hover': {
                                    backgroundColor: isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.15)'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Trade Calculator"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() => handleRoute('/privacy')}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                                '&:hover': {
                                    backgroundColor: isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.15)'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <PrivacyIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Privacy Policy"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>
                </List>

                <Divider sx={{ mx: 2, borderColor: isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.15)' }} />

                <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
                    <Typography sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isDark ? '#a0c4d4' : '#1a4a6e',
                        opacity: 0.8
                    }}>
                        Sets · Most Expensive
                    </Typography>
                </Box>

                <List sx={{ py: 0, overflow: 'auto' }}>
                    {sets.length === 0 && (
                        <Box sx={{ px: 2.5, py: 2 }}>
                            <Typography sx={{
                                fontSize: '0.85rem',
                                color: isDark ? '#a0c4d4' : '#1a4a6e',
                                opacity: 0.7,
                                fontStyle: 'italic'
                            }}>
                                Loading sets…
                            </Typography>
                        </Box>
                    )}
                    {sets.map((set) => {
                        const isActive = currentView.type === 'set' && currentView.setName === set.name;
                        return (
                            <ListItemButton
                                key={set.name}
                                selected={isActive}
                                onClick={() => handleNavigate({ type: 'set', setName: set.name })}
                                sx={{
                                    mx: 1,
                                    borderRadius: 2,
                                    mb: 0.25,
                                    '&.Mui-selected': {
                                        backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                                        '&:hover': {
                                            backgroundColor: isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.15)'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                                    <SetIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={set.name}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        fontSize: '0.92rem',
                                        color: isDark ? '#e8f4f8' : '#0a2540'
                                    }}
                                />
                                <Chip
                                    label={set.count}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: isDark ? '#0a2540' : '#ffffff',
                                        backgroundColor: isDark ? '#d4a853' : '#1a5a7a',
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
};

export default Header;
